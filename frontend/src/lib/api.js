import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Attach admin token automatically for any request when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// All bookings/messages route to this WhatsApp number
export const WHATSAPP_NUMBER = "919913258261";
export const PHONE_DISPLAY = "+91 99132 58261";
export const PHONE_TEL = "+919913258261";
export const EMAIL = "dixitnerpagar@gmail.com";
export const OFFICE = "Vishwakarma College Metro Station, Pune, Maharashtra";
export const MAP_EMBED =
  "https://www.google.com/maps?q=Vishwakarma+Institute+Of+Technology+Metro+Station+Pune&output=embed";

export const buildWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
