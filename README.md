# Krishna Tour & Travels — Pune

A full-stack premium cab booking website for Krishna Tour & Travels (Pune).
Built with **React + FastAPI + MongoDB**.

## Features

- Hero with tagline + subheading "Your Comfort, Our Wheels"
- Multi-step booking form
  - Trip types: Car with Driver, Self Drive Car, Corporate Pickup, Airport Transfer, Wedding/Marriage
  - Self-drive options: drop at your location (extra charges) OR pick from our location (Vishwakarma Metro, Pune) with embedded map
  - Pickup AND Drop time fields
- Fleet by category: **Hatchback, Sedan, SUV, MUV**
- Services section incl. Car with Driver & Self Drive Cars
- Driver Reviews + Car Reviews (1-5 stars) with "Write a Review" form
- Rate Us section (overall site rating)
- Get in Touch with embedded Google Map of Vishwakarma Institute Of Technology Metro Station
- Booking flow → confirmation page with **Payment step** → **Aadhar Card & Driving Licence submission via WhatsApp** (for self-drive / wedding)
- Floating WhatsApp CTA — all messages route to **+91 9913258261** with pre-message including "Also Submit your Aadhar card and Driving Licence"
- **Admin Dashboard** at `/admin` (login: `admin` / `admin123`)
  - Real-time stats (new / today / total bookings)
  - Bookings table with confirm + delete actions
  - Reviews tab
  - Polls every 15s for new bookings (notifications)

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
# Create .env (see backend/.env.example)
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=krishna_db
# CORS_ORIGINS=*
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=admin123
# JWT_SECRET=your-secret
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend

```bash
cd frontend
yarn install
# Create .env: REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

## Tech Stack

- **Frontend**: React 19, React Router, TailwindCSS, shadcn/ui, lucide-react, sonner
- **Backend**: FastAPI, Motor (async MongoDB), bcrypt, PyJWT
- **Database**: MongoDB

## Contact

- Phone / WhatsApp: **+91 99132 58261**
- Email: dixitnerpagar@gmail.com
- Office: Vishwakarma College Metro Station, Pune
