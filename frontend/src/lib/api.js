import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Owner / contact constants — all WhatsApp & calls go to a single number.
export const PHONE_PRIMARY = "917600491012";
export const PHONE_DISPLAY = "+91 76004 91012";
export const PHONE_TEL = "+917600491012";
export const EMAIL = "krishntourandtravels@gmail.com";
export const OWNER = "Pankaj Gemita";
export const OFFICE = "Ahmedabad, Gujarat — service across Gujarat & India";
export const MAP_EMBED =
  "https://www.google.com/maps?q=Ahmedabad+Gujarat&output=embed";

// Driver allowance & extras for trips with driver
export const DRIVER_ALLOWANCE_PER_DAY = 300;
export const SELF_DRIVE_DELIVERY_PER_KM = 10;

// Pre-message attached to all WhatsApp deep-links
export const WA_DOC_NOTE =
  "Also Submit your Aadhar card and Driving Licence.";

export const buildWhatsAppLink = (message) =>
  `https://wa.me/${PHONE_PRIMARY}?text=${encodeURIComponent(message)}`;

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
