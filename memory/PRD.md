# PRD — Krishna Tour & Travels

## Original Problem
Recreate the website at `https://swift-sedan-book.preview.emergentagent.com/` (Krishna Tour & Travels — Pune cab booking) with a long list of customisations and ship the source as a zip the user can drop into a GitHub repo.

## Implemented (Apr 2026)
- Hero with subheading "Your Comfort, Our Wheels"
- Trip types: Car with Driver / Self Drive Car / Corporate Pickup / Airport Transfer / Wedding/Marriage
- Conditional fields: Pickup+Drop for driver trips, Self-drive options (drop at location / pick from our location with Google Map embed of Vishwakarma Metro Station, Pune) for self-drive trips
- Pickup Time + Drop Time fields
- Fleet categories: Hatchback / Sedan / SUV / MUV
- Services with Car with Driver & Self Drive Cars
- Driver Reviews + Car Reviews + Write Review form (1-5 stars)
- Rate Us section
- Get in Touch with phone 9913258261, email dixitnerpagar@gmail.com, office at Vishwakarma Metro
- Multi-step Booking Confirmation page: Payment → Documents (Aadhar + DL via WhatsApp) → Done
- All WhatsApp links → +91 9913258261 with pre-message "Also Submit your Aadhar card and Driving Licence"
- Admin Dashboard at /admin (admin/admin123) — JWT auth, stats, bookings table with confirm+delete, reviews
- 21/21 backend tests passing

## Backlog (P1)
- Email notifications to gametipm1010@gmail.com (needs Resend/SMTP key)
- Real payment gateway (Razorpay/Stripe) on Payment step
- File-upload for Aadhar/DL on confirmation page (currently WhatsApp only)
- SMS booking notifications

## Backlog (P2)
- Admin: edit bookings, export to CSV, search/filter
- Driver login with availability calendar
- Multi-language (Marathi)

## Auth
- Admin: `admin / admin123` — change via env `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- JWT secret: env `JWT_SECRET`
