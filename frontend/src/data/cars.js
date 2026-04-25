// Krishn Tour and Travels — fleet & route data
//
// Daily rate ranges and per-km rates as provided by the owner.
// "RENT THIS CAR" pattern matches the radhecab.com layout.

const PIC = {
  wagonr: "/cars/wagonr.png",
  dzire: "/cars/dzire.png",
  aura: "/cars/aura.png",
  ertiga: "/cars/ertiga.png",
  city: "/cars/aura.png",
  innova: "/cars/innova.jpeg",
  crysta: "/cars/crysta.png",
  fortuner: "/cars/fortuner.jpeg",
  benz: "/cars/mercedes.png",
  bmw: "/cars/bmw.png",
  audi: "/cars/audi.png",
};

export const STANDARD_FLEET = [
  { name: "Wagon R",            type: "hatchback", per_km: 10, day: 2200, seats: 4, bags: 2, image: PIC.wagonr },
  { name: "Maruti Swift Dzire", type: "sedan",     per_km: 11, day: 2700, seats: 4, bags: 2, image: PIC.dzire },
  { name: "Hyundai Aura",       type: "sedan",     per_km: 11, day: 2700, seats: 4, bags: 2, image: PIC.aura },
  { name: "Maruti Ertiga",      type: "muv",       per_km: 14, day: 3300, seats: 6, bags: 3, image: PIC.ertiga },
  { name: "Honda City",         type: "sedan",     per_km: 14, day: 3300, seats: 4, bags: 3, image: PIC.city },
  { name: "Innova",             type: "muv",       per_km: 17, day: 5000, seats: 7, bags: 4, image: PIC.innova },
  { name: "Toyota Innova Crysta", type: "muv",     per_km: 20, day: 5500, seats: 7, bags: 4, image: PIC.crysta },
  { name: "Toyota Fortuner",    type: "suv",       per_km: 25, day: 7000, seats: 7, bags: 5, image: PIC.fortuner },
];

export const PREMIUM_FLEET = [
  { name: "Mercedes E-Class", type: "premium", per_km_min: 35, per_km_max: 80, day_min: 8500, day_max: 13000, seats: 4, bags: 3, image: PIC.benz },
  { name: "BMW 5-Series",     type: "premium", per_km_min: 35, per_km_max: 60, day_min: 8500, day_max: 13000, seats: 4, bags: 3, image: PIC.bmw },
  { name: "Audi A6",          type: "premium", per_km_min: 35, per_km_max: 80, day_min: 8500, day_max: 13000, seats: 4, bags: 3, image: PIC.audi },
  { name: "Toyota Fortuner (Premium)", type: "premium", per_km_min: 25, per_km_max: 55, day_min: 4999, day_max: 7500, seats: 7, bags: 5, image: PIC.fortuner },
];

export const ALL_CARS = [
  ...STANDARD_FLEET.map(c => c.name),
  ...PREMIUM_FLEET.map(c => c.name),
];

export const TRIP_TYPES = [
  { value: "Car with Driver",  needsDrop: true,  isSelfDrive: false, isRoute: false },
  { value: "Self Drive Car",   needsDrop: false, isSelfDrive: true,  isRoute: false },
  { value: "Round Trip",       needsDrop: true,  isSelfDrive: false, isRoute: true },
  { value: "One-Way Trip",     needsDrop: true,  isSelfDrive: false, isRoute: true },
  { value: "Corporate Pickup", needsDrop: true,  isSelfDrive: false, isRoute: false },
  { value: "Airport Transfer", needsDrop: true,  isSelfDrive: false, isRoute: false },
  { value: "Wedding/Marriage", needsDrop: false, isSelfDrive: true,  isRoute: false },
  { value: "Emergency",        needsDrop: false, isSelfDrive: false, isRoute: false },
];

// Round/One-way preset routes (Sedan & SUV starting prices)
export const ROUTES = [
  { from: "Ahmedabad", to: "Vadodara",   sedan: 1799, suv: 2699 },
  { from: "Ahmedabad", to: "Rajkot",     sedan: 2899, suv: 3899 },
  { from: "Ahmedabad", to: "Surat",      sedan: 3599, suv: 4199 },
  { from: "Ahmedabad", to: "Bhuj",       sedan: 3899, suv: 4899 },
  { from: "Ahmedabad", to: "Jodhpur",    sedan: 6499, suv: 7999 },
  { from: "Ahmedabad", to: "Udaipur",    sedan: 3999, suv: 4999 },
  { from: "Ahmedabad", to: "Indore",     sedan: 7499, suv: 8999 },
  { from: "Ahmedabad", to: "Jamnagar",   sedan: 4500, suv: 5500 },
  { from: "Ahmedabad", to: "Bhavnagar",  sedan: 2700, suv: 3500 },
  { from: "Ahmedabad", to: "Gandhidham", sedan: 3699, suv: 4499 },
];

export const SERVICES = [
  {
    title: "Car with Driver",
    desc: "Trusted, uniformed drivers for outstation trips. Pune to Mumbai, Lonavala, anywhere across India.",
    image: "https://images.unsplash.com/photo-1738482223844-7ff598553cf7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Self Drive Cars",
    desc: "Premium self-drive cars delivered to your doorstep (₹10/km delivery) or pickup from our location. Aadhar + DL required.",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Round / One-Way Trips",
    desc: "Pre-planned routes Ahmedabad ⇌ Vadodara, Surat, Rajkot, Bhuj, Udaipur and 5 more — with driver, toll & parking extra.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Airport Transfers",
    desc: "Pre-booked cabs for hassle-free airport pickups & drops with on-time service, 24x7 availability.",
    image: "https://images.unsplash.com/photo-1764090317825-9b76e437c8d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Wedding Cars (No Decoration)",
    desc: "Premium cars for the baraat & guests. Decoration not provided. Scratch / damage charges applicable as per assessment.",
    image: "https://images.unsplash.com/photo-1760110885805-273b5bf5e50b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Corporate Travel",
    desc: "Chauffeur-driven sedans and SUVs for executives, clients and business meetings.",
    image: "https://images.unsplash.com/photo-1576566465339-2b99f6b33277?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
];

export const DRIVERS = [
  { name: "Rajesh Kumar", years: 12, languages: "Hindi · English · Gujarati" },
  { name: "Anil Sharma",  years: 8,  languages: "Hindi · English" },
  { name: "Sunil Patel",  years: 10, languages: "Gujarati · Hindi · English" },
  { name: "Mahesh Yadav", years: 15, languages: "Hindi · English · Punjabi" },
];
