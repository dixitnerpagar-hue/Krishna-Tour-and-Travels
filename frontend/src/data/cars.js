// Car fleet data, organised by category
export const CAR_CATEGORIES = [
  {
    id: "hatchback",
    title: "Hatchback",
    subtitle: "City rides · Compact",
    cars: [
      {
        name: "Maruti Swift",
        image: "https://images.unsplash.com/photo-1583267746897-2cf66319ef97?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
        seats: 4,
        bags: 2,
        per_km: 10,
        per_day: 1800,
        features: ["AC", "Fuel Efficient", "Music"],
        type: "hatchback",
      },
      {
        name: "Hyundai i20",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
        seats: 4,
        bags: 2,
        per_km: 11,
        per_day: 2000,
        features: ["AC", "Bluetooth", "Touchscreen"],
        type: "hatchback",
      },
    ],
  },
  {
    id: "sedan",
    title: "Sedan",
    subtitle: "Comfort · Everyday",
    cars: [
      {
        name: "Maruti Swift Dzire",
        image: "https://images.unsplash.com/photo-1774389412736-44fc35ae7699?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx3aGl0ZSUyMHNlZGFuJTIwY2FyJTIwdHJhdmVsfGVufDB8fHx8MTc3NjQyODk2OXww&ixlib=rb-4.1.0&q=85",
        seats: 4,
        bags: 2,
        per_km: 12,
        per_day: 2200,
        features: ["AC", "Fuel Efficient", "Music System"],
        type: "sedan",
      },
      {
        name: "Honda City",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
        seats: 4,
        bags: 3,
        per_km: 14,
        per_day: 2600,
        features: ["AC", "Premium Interior", "Sunroof"],
        type: "sedan",
      },
    ],
  },
  {
    id: "suv",
    title: "SUV",
    subtitle: "Premium · Powerful",
    cars: [
      {
        name: "Toyota Fortuner",
        image: "https://images.unsplash.com/photo-1758411898637-dc03ee565fb8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHByZW1pdW0lMjBzdXYlMjBjYXIlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc2NDI4OTY5fDA&ixlib=rb-4.1.0&q=85",
        seats: 7,
        bags: 5,
        per_km: 25,
        per_day: 5500,
        features: ["4x4 Available", "Leather Seats", "Panoramic"],
        type: "suv",
      },
      {
        name: "Hyundai Creta",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
        seats: 5,
        bags: 4,
        per_km: 18,
        per_day: 3800,
        features: ["AC", "Cruise Control", "Sunroof"],
        type: "suv",
      },
    ],
  },
  {
    id: "muv",
    title: "MUV",
    subtitle: "Family · Spacious",
    cars: [
      {
        name: "Toyota Innova Crysta",
        image: "https://images.unsplash.com/photo-1762887137951-4b7b793282ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwyfHx3aGl0ZSUyMHByZW1pdW0lMjBzdXYlMjBjYXIlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc2NDI4OTY5fDA&ixlib=rb-4.1.0&q=85",
        seats: 7,
        bags: 4,
        per_km: 18,
        per_day: 3500,
        features: ["AC", "Push Start", "Music System"],
        type: "muv",
      },
      {
        name: "Maruti Ertiga",
        image: "https://images.unsplash.com/photo-1758411898970-39925f9f6d9f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHw0fHx3aGl0ZSUyMHByZW1pdW0lMjBzdXYlMjBjYXIlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc2NDI4OTY5fDA&ixlib=rb-4.1.0&q=85",
        seats: 6,
        bags: 3,
        per_km: 14,
        per_day: 2800,
        features: ["AC", "Spacious Cabin", "Music System"],
        type: "muv",
      },
    ],
  },
];

export const ALL_CARS = CAR_CATEGORIES.flatMap((c) => c.cars);

export const TRIP_TYPES = [
  { value: "Car with Driver", label: "Car with Driver", needsDrop: true, isSelfDrive: false },
  { value: "Self Drive Car", label: "Self Drive Car", needsDrop: false, isSelfDrive: true },
  { value: "Corporate Pickup", label: "Corporate Pickup", needsDrop: true, isSelfDrive: false },
  { value: "Airport Transfer", label: "Airport Transfer", needsDrop: true, isSelfDrive: false },
  { value: "Wedding/Marriage", label: "Wedding / Marriage", needsDrop: false, isSelfDrive: true },
];

export const SERVICES = [
  {
    title: "Car with Driver",
    desc: "Plan your getaway with a comfortable cab and a trusted driver. Pune to Mumbai, Lonavala, anywhere in India.",
    image:
      "https://images.unsplash.com/photo-1738482223844-7ff598553cf7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Self Drive Cars",
    desc: "Premium self-drive cars delivered to your doorstep or pick-up from our station. Drive your way.",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Airport Transfers",
    desc: "Pre-booked cabs for hassle-free airport pickups & drops with on-time service, 24x7 availability.",
    image:
      "https://images.unsplash.com/photo-1764090317825-9b76e437c8d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Wedding Cars",
    desc: "Decorated luxury cars for your special day. Make the baraat grand and unforgettable.",
    image:
      "https://images.unsplash.com/photo-1760110885805-273b5bf5e50b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    title: "Corporate Travel",
    desc: "Chauffeur-driven premium sedans and SUVs for executives, clients and business meetings.",
    image:
      "https://images.unsplash.com/photo-1576566465339-2b99f6b33277?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
];

export const DRIVERS = [
  { name: "Rajesh Kumar", years: 12, languages: "Hindi · English · Marathi" },
  { name: "Anil Sharma", years: 8, languages: "Hindi · English" },
  { name: "Sunil Patil", years: 10, languages: "Marathi · Hindi · English" },
  { name: "Mahesh Yadav", years: 15, languages: "Hindi · English · Punjabi" },
];
