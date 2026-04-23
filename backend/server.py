from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth config
JWT_SECRET = os.environ.get('JWT_SECRET', 'krishna-tour-travels-secret-2026')
JWT_ALGO = 'HS256'
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = bcrypt.hashpw(
    os.environ.get('ADMIN_PASSWORD', 'admin123').encode('utf-8'),
    bcrypt.gensalt()
).decode('utf-8')

app = FastAPI(title="Krishna Tour & Travels API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()


# ---------- Models ----------
class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_type: str
    car_name: Optional[str] = None
    pickup_location: Optional[str] = None
    drop_location: Optional[str] = None
    self_drive_option: Optional[str] = None  # 'drop_at_location' or 'pickup_from_us'
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    drop_time: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = None
    passengers: Optional[int] = 2
    notes: Optional[str] = None
    status: str = "new"  # new, confirmed, completed, cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BookingCreate(BaseModel):
    trip_type: str
    car_name: Optional[str] = None
    pickup_location: Optional[str] = None
    drop_location: Optional[str] = None
    self_drive_option: Optional[str] = None
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    drop_time: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = None
    passengers: Optional[int] = 2
    notes: Optional[str] = None


class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    review_type: Literal["car", "driver", "site"]
    target_name: Optional[str] = None  # car name or driver name
    reviewer_name: str
    rating: int  # 1-5
    comment: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReviewCreate(BaseModel):
    review_type: Literal["car", "driver", "site"]
    target_name: Optional[str] = None
    reviewer_name: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Auth helpers ----------
def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("sub") != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Krishna Tour & Travels API", "status": "running"}


# ---- Bookings ----
@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    logger.info(f"New booking: {booking.id} for {booking.name}")
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(_: dict = Depends(verify_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    return doc


@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status_value: str, _: dict = Depends(verify_admin)):
    result = await db.bookings.update_one(
        {"id": booking_id}, {"$set": {"status": status_value}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, _: dict = Depends(verify_admin)):
    result = await db.bookings.delete_one({"id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


# ---- Reviews ----
@api_router.post("/reviews", response_model=Review)
async def create_review(payload: ReviewCreate):
    review = Review(**payload.model_dump())
    doc = review.model_dump()
    await db.reviews.insert_one(doc)
    return review


@api_router.get("/reviews", response_model=List[Review])
async def list_reviews(review_type: Optional[str] = None):
    query = {"review_type": review_type} if review_type else {}
    docs = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.get("/reviews/summary")
async def reviews_summary():
    pipeline = [
        {"$group": {
            "_id": {"type": "$review_type", "name": "$target_name"},
            "avg_rating": {"$avg": "$rating"},
            "count": {"$sum": 1},
        }}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(500)
    out = []
    for r in result:
        out.append({
            "review_type": r["_id"]["type"],
            "target_name": r["_id"]["name"],
            "avg_rating": round(r["avg_rating"], 2),
            "count": r["count"],
        })
    return out


# ---- Admin ----
@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(payload: AdminLogin):
    if payload.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not bcrypt.checkpw(payload.password.encode('utf-8'), ADMIN_PASSWORD_HASH.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return AdminToken(access_token=create_access_token(payload.username))


@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(verify_admin)):
    total = await db.bookings.count_documents({})
    new_count = await db.bookings.count_documents({"status": "new"})
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_count = await db.bookings.count_documents({"created_at": {"$gte": today_start.isoformat()}})
    review_count = await db.reviews.count_documents({})
    return {
        "total_bookings": total,
        "new_bookings": new_count,
        "today_bookings": today_count,
        "total_reviews": review_count,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
