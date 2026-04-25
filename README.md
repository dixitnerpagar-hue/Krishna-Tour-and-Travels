# Krishn Tour and Travels

Owner: **Pankaj Gemita** · Ahmedabad, Gujarat
Phone / WhatsApp: **+91 7600491012**
Email: **krishntourandtravels@gmail.com**

A full-stack premium cab booking website built with **React + FastAPI + MongoDB**.

## Features

### Customer flows
- **Hero** with tagline + subheading "Your Comfort, Our Wheels"
- **Multi-trip booking form**:
  - Trip types: Car with Driver · Self Drive Car · Round Trip · One-Way Trip · Corporate Pickup · Airport Transfer · Wedding/Marriage · Emergency
  - Self-drive options: drop-at-location (₹10/km delivery) OR pickup from our location with embedded map
  - Pickup AND Drop **Date** + **Time** fields
  - Duration > 7 days → automatic price-negotiation flag
- **8 Standard fleet** cars with radhecab.com-style price card (Rs.X/km · Round Trip 300KM/day · Driver allowance ₹300/day · Toll & Parking extra)
  - Wagon R, Maruti Swift Dzire, Hyundai Aura, Maruti Ertiga, Honda City, Innova, Toyota Innova Crysta, Toyota Fortuner
- **Premium fleet**: Mercedes E-Class · BMW 5-Series · Audi A6 · Toyota Fortuner (premium pricing range)
- **Routes section** — pre-priced popular Round/One-way routes:
  - Ahmedabad ⇌ Vadodara, Rajkot, Surat, Bhuj, Jodhpur, Udaipur, Indore, Jamnagar, Bhavnagar, Gandhidham
- **Emergency Booking** — direct call to owner
- **Driver + Car Reviews** with submit form
- **Rate Us** section (1-5 stars)

### Booking flow
1. Submit booking → confirmation page
2. **Pay 50% advance** via Razorpay or UPI (`7600491012@upi`)
3. **Submit Aadhar + Driving Licence** on WhatsApp (for self-drive / wedding cars)
4. Balance 50% paid after the ride

### Owner / Admin Dashboard (`/admin`)
- Login: `admin` / `admin123` (configurable via env)
- Live stats: New / Today / Total / Paid / Reviews
- **Bookings** table with confirm + delete + payment status
- **Car Availability** toggle — mark a car off to show "Currently booked" badge to public
- **Reviews** view (driver / car / site)
- Polls every 15s for new bookings

### Integrations
- **Resend** email — every booking sends a beautifully formatted HTML email to `krishntourandtravels@gmail.com`
- **Razorpay** payment gateway (with UPI fallback when keys are not configured)
- **Google Maps** embed for pickup location

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill real values
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
cp .env.example .env   # set REACT_APP_BACKEND_URL
yarn start
```

## Required env vars (`backend/.env`)

| Key | Purpose |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | DB name |
| `CORS_ORIGINS` | comma-separated origins (`*` ok) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | dashboard login |
| `JWT_SECRET` | random string |
| `RESEND_API_KEY` | from resend.com |
| `SENDER_EMAIL` | `onboarding@resend.dev` (Resend default) |
| `NOTIFY_EMAIL` | where booking notifications are sent |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | from razorpay.com (or leave placeholder for UPI fallback) |
| `UPI_ID` | UPI handle for advance payments |
| `OWNER_NAME` | shown across the site |

## Tech Stack

- **Frontend**: React 19 · React Router · TailwindCSS · shadcn/ui · lucide-react · sonner
- **Backend**: FastAPI · Motor (async MongoDB) · bcrypt · PyJWT · Resend · Razorpay
- **Database**: MongoDB

## How to enable Razorpay (procedure)

1. Sign up at https://razorpay.com (free, KYC takes 1-2 days)
2. Dashboard → **Settings** → **API Keys** → "Generate Test Keys"
3. Edit `backend/.env` and set:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxx
   ```
4. Restart backend: `sudo supervisorctl restart backend`
5. The "Pay 50% Advance" button will now open the Razorpay checkout instead of UPI fallback.

## License
Proprietary — © Krishn Tour and Travels
