from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import resend
import razorpay

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth
JWT_SECRET = os.environ.get('JWT_SECRET', 'krishn-tour-travels-secret-2026')
JWT_ALGO = 'HS256'
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = bcrypt.hashpw(
    os.environ.get('ADMIN_PASSWORD', 'admin123').encode('utf-8'),
    bcrypt.gensalt()
).decode('utf-8')

# Email
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'krishntourandtravels@gmail.com')

# Razorpay (will be placeholder until user adds real keys)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
UPI_ID = os.environ.get('UPI_ID', '7600491012@upi')

razorpay_enabled = bool(
    RAZORPAY_KEY_ID
    and RAZORPAY_KEY_SECRET
    and not RAZORPAY_KEY_ID.endswith("placeholder")
    and not RAZORPAY_KEY_SECRET.endswith("placeholder")
    and not RAZORPAY_KEY_SECRET.endswith("secret")
)
razorpay_client = (
    razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)) if razorpay_enabled else None
)

app = FastAPI(title="Krishn Tour & Travels API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


# ---------- Models ----------
class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_type: str  # "Car with Driver" / "Self Drive Car" / "One-Way Trip" / "Round Trip" / "Wedding/Marriage" / "Corporate Pickup" / "Airport Transfer" / "Emergency"
    car_name: Optional[str] = None
    pickup_location: Optional[str] = None
    drop_location: Optional[str] = None
    self_drive_option: Optional[str] = None
    self_drive_delivery_km: Optional[float] = None
    pickup_date: Optional[str] = None
    drop_date: Optional[str] = None
    pickup_time: Optional[str] = None
    drop_time: Optional[str] = None
    duration_days: Optional[int] = None
    name: str
    phone: str
    email: Optional[str] = None
    passengers: Optional[int] = 2
    notes: Optional[str] = None
    estimated_total: Optional[float] = None
    advance_paid: float = 0
    payment_status: str = "pending"  # pending / advance_paid / fully_paid
    payment_method: Optional[str] = None  # razorpay / upi / cash
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    needs_negotiation: bool = False
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BookingCreate(BaseModel):
    trip_type: str
    car_name: Optional[str] = None
    pickup_location: Optional[str] = None
    drop_location: Optional[str] = None
    self_drive_option: Optional[str] = None
    self_drive_delivery_km: Optional[float] = None
    pickup_date: Optional[str] = None
    drop_date: Optional[str] = None
    pickup_time: Optional[str] = None
    drop_time: Optional[str] = None
    duration_days: Optional[int] = None
    name: str
    phone: str
    email: Optional[str] = None
    passengers: Optional[int] = 2
    notes: Optional[str] = None
    estimated_total: Optional[float] = None
    needs_negotiation: bool = False


class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    review_type: Literal["car", "driver", "site"]
    target_name: Optional[str] = None
    reviewer_name: str
    rating: int
    comment: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReviewCreate(BaseModel):
    review_type: Literal["car", "driver", "site"]
    target_name: Optional[str] = None
    reviewer_name: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class CarAvailability(BaseModel):
    model_config = ConfigDict(extra="ignore")
    car_name: str
    available: bool = True
    note: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CarAvailabilityUpdate(BaseModel):
    available: bool
    note: Optional[str] = None


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PaymentOrderRequest(BaseModel):
    booking_id: str
    amount_inr: float  # advance amount in rupees


# ---------- Auth ----------
def create_access_token(username: str) -> str:
    return jwt.encode(
        {"sub": username, "exp": datetime.now(timezone.utc) + timedelta(days=7)},
        JWT_SECRET, algorithm=JWT_ALGO,
    )


def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("sub") != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---------- Email helper ----------
def _build_booking_email_html(b: dict) -> str:
    rows = []
    fields = [
        ("Booking ID", b.get("id", "")[:8].upper()),
        ("Trip", b.get("trip_type")),
        ("Car", b.get("car_name") or "—"),
        ("Customer", b.get("name")),
        ("Phone", b.get("phone")),
        ("Email", b.get("email") or "—"),
        ("Pickup", b.get("pickup_location") or "—"),
        ("Drop", b.get("drop_location") or "—"),
        ("Pickup Date", b.get("pickup_date") or "—"),
        ("Drop Date", b.get("drop_date") or "—"),
        ("Pickup Time", b.get("pickup_time") or "—"),
        ("Drop Time", b.get("drop_time") or "—"),
        ("Duration", f"{b.get('duration_days')} days" if b.get("duration_days") else "—"),
        ("Passengers", str(b.get("passengers", "—"))),
        ("Estimated Total", f"₹{b.get('estimated_total')}" if b.get("estimated_total") else "—"),
        ("Notes", b.get("notes") or "—"),
        ("Negotiation Requested", "Yes" if b.get("needs_negotiation") else "No"),
    ]
    for k, v in fields:
        rows.append(
            f'<tr><td style="padding:8px 14px;border-bottom:1px solid #f1f1f1;color:#666;font-size:13px;">{k}</td>'
            f'<td style="padding:8px 14px;border-bottom:1px solid #f1f1f1;font-weight:600;color:#1a1a1a;font-size:13px;">{v}</td></tr>'
        )
    body = "".join(rows)
    return f"""
    <div style="font-family:Inter,Arial,sans-serif;background:#faf8f5;padding:24px;">
      <table style="max-width:600px;margin:0 auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:24px;">
            <h1 style="margin:0;font-size:22px;">🚖 New Booking — Krishn Tour and Travels</h1>
            <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">Owner: Pankaj Gemita</p>
          </td>
        </tr>
        <tr><td><table style="width:100%;border-collapse:collapse;">{body}</table></td></tr>
        <tr>
          <td style="background:#f8f8f8;padding:16px 24px;font-size:11px;color:#888;text-align:center;">
            Reply to the customer on +91 7600491012 (WhatsApp/Call). View admin dashboard for full details.
          </td>
        </tr>
      </table>
    </div>
    """


async def send_booking_email(booking_dict: dict) -> None:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set; skipping email")
        return
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFY_EMAIL],
            "subject": f"New Booking: {booking_dict.get('name')} — {booking_dict.get('trip_type')}",
            "html": _build_booking_email_html(booking_dict),
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent: {result.get('id') if isinstance(result, dict) else result}")
    except Exception as e:
        logger.error(f"Email send failed: {e}")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {
        "message": "Krishn Tour and Travels API",
        "status": "running",
        "razorpay_enabled": razorpay_enabled,
        "email_enabled": bool(resend.api_key),
    }


@api_router.get("/config")
async def public_config():
    """Public config used by the frontend (safe values only)."""
    return {
        "razorpay_enabled": razorpay_enabled,
        "razorpay_key_id": RAZORPAY_KEY_ID if razorpay_enabled else "",
        "upi_id": UPI_ID,
        "owner_name": os.environ.get("OWNER_NAME", "Pankaj Gemita"),
    }


# ---- Bookings ----
@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    asyncio.create_task(send_booking_email(doc))
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
    await db.reviews.insert_one(review.model_dump())
    return review


@api_router.get("/reviews", response_model=List[Review])
async def list_reviews(review_type: Optional[str] = None):
    query = {"review_type": review_type} if review_type else {}
    docs = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


# ---- Car Availability ----
@api_router.get("/cars/availability")
async def list_availability():
    docs = await db.car_availability.find({}, {"_id": 0}).to_list(200)
    return docs


@api_router.put("/cars/availability/{car_name}")
async def set_availability(
    car_name: str, payload: CarAvailabilityUpdate, _: dict = Depends(verify_admin)
):
    update = {
        "car_name": car_name,
        "available": payload.available,
        "note": payload.note,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.car_availability.update_one(
        {"car_name": car_name}, {"$set": update}, upsert=True
    )
    return {"ok": True, "car": update}


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
    paid_count = await db.bookings.count_documents({"payment_status": {"$in": ["advance_paid", "fully_paid"]}})
    return {
        "total_bookings": total,
        "new_bookings": new_count,
        "today_bookings": today_count,
        "total_reviews": review_count,
        "paid_bookings": paid_count,
    }


# ---- Payment ----
@api_router.post("/payments/create-order")
async def create_payment_order(payload: PaymentOrderRequest):
    booking = await db.bookings.find_one({"id": payload.booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if not razorpay_enabled:
        # Fallback to UPI manual flow
        return {
            "method": "upi",
            "upi_id": UPI_ID,
            "amount": payload.amount_inr,
            "note": "Razorpay not configured. Pay via UPI and click 'I have paid'.",
        }
    try:
        order = razorpay_client.order.create(
            {
                "amount": int(payload.amount_inr * 100),
                "currency": "INR",
                "receipt": payload.booking_id,
                "notes": {"booking_id": payload.booking_id},
            }
        )
        await db.bookings.update_one(
            {"id": payload.booking_id},
            {"$set": {"razorpay_order_id": order["id"]}},
        )
        return {
            "method": "razorpay",
            "order_id": order["id"],
            "key_id": RAZORPAY_KEY_ID,
            "amount": payload.amount_inr,
            "currency": "INR",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay error: {e}")


class RazorpayVerify(BaseModel):
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@api_router.post("/payments/verify")
async def verify_payment(payload: RazorpayVerify):
    if not razorpay_enabled:
        raise HTTPException(status_code=400, detail="Razorpay not configured")
    try:
        razorpay_client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id,
                "razorpay_signature": payload.razorpay_signature,
            }
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Signature verification failed")

    await db.bookings.update_one(
        {"id": payload.booking_id},
        {"$set": {
            "payment_status": "advance_paid",
            "payment_method": "razorpay",
            "razorpay_payment_id": payload.razorpay_payment_id,
        }},
    )
    return {"ok": True}


class UPIPaidNotify(BaseModel):
    booking_id: str
    amount: float


@api_router.post("/payments/upi-notify")
async def upi_notify(payload: UPIPaidNotify):
    """Customer clicks 'I have paid via UPI' — admin verifies later."""
    result = await db.bookings.update_one(
        {"id": payload.booking_id},
        {"$set": {
            "payment_status": "advance_paid",
            "payment_method": "upi_pending_verify",
            "advance_paid": payload.amount,
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
