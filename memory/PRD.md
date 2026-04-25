# PRD — Krishn Tour and Travels

Owner: **Pankaj Gemita** · Ahmedabad, Gujarat
Contact: +91 7600491012 · krishntourandtravels@gmail.com

## Original Problem
Build a full-stack premium cab booking website for the Indian market (Ahmedabad-based) with multiple trip types, payment integration, email notifications, and an admin dashboard.

## Implemented (Apr 2026 — Iteration 2)
- Brand: "Krishn Tour and Travels" with custom logo
- 8 trip types incl. Round Trip, One-Way Trip, Self-Drive, Wedding/Marriage, Emergency
- 8 standard cars (Wagon R → Fortuner) + 4 premium cars (Mercedes/BMW/Audi/Fortuner premium)
- 10 popular round/one-way routes (Ahmedabad ⇌ Vadodara, Surat, Rajkot, Bhuj, Jodhpur, Udaipur, Indore, Jamnagar, Bhavnagar, Gandhidham)
- Pickup + Drop date + Pickup + Drop time fields
- Self-drive: drop-at-location (₹10/km) or pick from Ahmedabad office, Aadhar/DL upload via WhatsApp
- Wedding cars no-decoration + scratch/damage clause
- Auto price-negotiation flag for >7-day bookings
- 50% advance + 50% post-ride payment flow
- **Razorpay** payment gateway (with UPI fallback to `7600491012@upi`)
- **Resend** email notifications to `krishntourandtravels@gmail.com` on every booking
- Driver + Car reviews + Rate Us section (1-5 stars)
- Emergency Booking — direct call to owner
- Admin Dashboard with **Car Availability** toggle (mark cars as currently booked)
- 29/29 backend tests passing; frontend e2e verified

## Backlog (P1)
- Real Razorpay keys (currently placeholder → UPI fallback)
- File upload for Aadhar/DL (currently WhatsApp only)
- SMS notifications via Twilio
- Razorpay webhook for auto-confirmation

## Backlog (P2)
- Multi-language (Gujarati, Hindi)
- Driver login with availability calendar
- Admin: edit bookings, export to CSV
- Customer login + booking history
- Loyalty / referral program

## Auth
- Admin: `admin` / `admin123` — change via env `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- JWT secret: env `JWT_SECRET`
