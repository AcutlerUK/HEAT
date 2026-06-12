export interface Appliance {
  id: string
  name: string
  category: string
  watts: number
  defaultMinutes: number
  defaultUsesPerWeek: number
  notes?: string
  fuelType?: 'electric' | 'gas' | 'oil' | 'lpg'
  gasKWhRating?: number
  oilKWhRating?: number
  lpgKWhRating?: number
}

export const APPLIANCE_CATEGORIES = [
  "Heating & Cooling",
  "Kitchen Appliances",
  "Laundry",
  "Entertainment",
  "Lighting",
  "Computing",
  "Personal Care",
  "Other"
] as const

export const APPLIANCES: Appliance[] = [
  {
    id: "tv-65",
    name: "Television 65 inch",
    category: "Entertainment",
    watts: 110,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Average for LED, LCD and OLED Flatscreens"
  },
  {
    id: "tv-55",
    name: "Television 55 inch",
    category: "Entertainment",
    watts: 90,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Average for LED, LCD and OLED Flatscreens"
  },
  {
    id: "tv-43",
    name: "Television 43 inch",
    category: "Entertainment",
    watts: 60,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Average for LED, LCD and OLED Flatscreens"
  },
  {
    id: "tv-32",
    name: "Television 32 inch",
    category: "Entertainment",
    watts: 40,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Average for LED, LCD and OLED Flatscreens"
  },
  {
    id: "fridge-freezer",
    name: "Fridge Freezer",
    category: "Kitchen Appliances",
    watts: 180,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7, average consumption"
  },
  {
    id: "fridge-only",
    name: "Refrigerator (Fridge only)",
    category: "Kitchen Appliances",
    watts: 100,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "chest-freezer",
    name: "Chest Freezer",
    category: "Kitchen Appliances",
    watts: 100,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7, most efficient type"
  },
  {
    id: "upright-freezer",
    name: "Upright Freezer",
    category: "Kitchen Appliances",
    watts: 150,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "washing-machine",
    name: "Washing Machine",
    category: "Laundry",
    watts: 2100,
    defaultMinutes: 120,
    defaultUsesPerWeek: 3,
    notes: "Average cycle including heating water"
  },
  {
    id: "washer-dryer",
    name: "Washer Dryer",
    category: "Laundry",
    watts: 2500,
    defaultMinutes: 180,
    defaultUsesPerWeek: 3,
    notes: "Full wash and dry cycle"
  },
  {
    id: "tumble-dryer",
    name: "Tumble Dryer",
    category: "Laundry",
    watts: 2500,
    defaultMinutes: 90,
    defaultUsesPerWeek: 3,
    notes: "Vented or condenser"
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    category: "Kitchen Appliances",
    watts: 1800,
    defaultMinutes: 120,
    defaultUsesPerWeek: 5,
    notes: "Average eco cycle"
  },
  {
    id: "electric-oven",
    name: "Electric Oven",
    category: "Kitchen Appliances",
    watts: 2400,
    defaultMinutes: 60,
    defaultUsesPerWeek: 5,
    notes: "Single oven, fan assisted"
  },
  {
    id: "electric-hob",
    name: "Electric Hob (4 rings)",
    category: "Kitchen Appliances",
    watts: 2000,
    defaultMinutes: 60,
    defaultUsesPerWeek: 7,
    notes: "Average of all rings"
  },
  {
    id: "microwave",
    name: "Microwave Oven",
    category: "Kitchen Appliances",
    watts: 800,
    defaultMinutes: 15,
    defaultUsesPerWeek: 7,
    notes: "Standard 800W model"
  },
  {
    id: "kettle",
    name: "Electric Kettle",
    category: "Kitchen Appliances",
    watts: 3000,
    defaultMinutes: 5,
    defaultUsesPerWeek: 14,
    notes: "3kW rapid boil kettle"
  },
  {
    id: "toaster",
    name: "Toaster",
    category: "Kitchen Appliances",
    watts: 1200,
    defaultMinutes: 3,
    defaultUsesPerWeek: 7,
    notes: "2 slice toaster"
  },
  {
    id: "coffee-machine",
    name: "Coffee Machine",
    category: "Kitchen Appliances",
    watts: 1400,
    defaultMinutes: 5,
    defaultUsesPerWeek: 7,
    notes: "Pod or filter machine"
  },
  {
    id: "slow-cooker",
    name: "Slow Cooker",
    category: "Kitchen Appliances",
    watts: 200,
    defaultMinutes: 240,
    defaultUsesPerWeek: 2,
    notes: "Low setting, 4-6 hours"
  },
  {
    id: "air-fryer",
    name: "Air Fryer",
    category: "Kitchen Appliances",
    watts: 1500,
    defaultMinutes: 25,
    defaultUsesPerWeek: 4,
    notes: "Average cooking time"
  },
  {
    id: "vacuum-cleaner",
    name: "Vacuum Cleaner",
    category: "Other",
    watts: 900,
    defaultMinutes: 20,
    defaultUsesPerWeek: 2,
    notes: "Upright or cylinder"
  },
  {
    id: "iron",
    name: "Iron",
    category: "Laundry",
    watts: 2400,
    defaultMinutes: 20,
    defaultUsesPerWeek: 2,
    notes: "Steam iron"
  },
  {
    id: "hair-dryer",
    name: "Hair Dryer",
    category: "Personal Care",
    watts: 2000,
    defaultMinutes: 10,
    defaultUsesPerWeek: 7,
    notes: "High heat setting"
  },
  {
    id: "straighteners",
    name: "Hair Straighteners",
    category: "Personal Care",
    watts: 50,
    defaultMinutes: 15,
    defaultUsesPerWeek: 7,
    notes: "Ceramic plates"
  },
  {
    id: "electric-shower",
    name: "Electric Shower (9.5kW)",
    category: "Personal Care",
    watts: 9500,
    defaultMinutes: 10,
    defaultUsesPerWeek: 7,
    notes: "Per person per day"
  },
  {
    id: "immersion-heater",
    name: "Immersion Heater",
    category: "Heating & Cooling",
    watts: 3000,
    defaultMinutes: 60,
    defaultUsesPerWeek: 7,
    notes: "Water heating, 3kW element"
  },
  {
    id: "electric-radiator",
    name: "Electric Radiator (1kW)",
    category: "Heating & Cooling",
    watts: 1000,
    defaultMinutes: 360,
    defaultUsesPerWeek: 7,
    notes: "Per radiator, 6 hours typical"
  },
  {
    id: "oil-filled-radiator",
    name: "Oil Filled Radiator (2kW)",
    category: "Heating & Cooling",
    watts: 2000,
    defaultMinutes: 360,
    defaultUsesPerWeek: 7,
    notes: "Portable heater"
  },
  {
    id: "fan-heater",
    name: "Fan Heater (2kW)",
    category: "Heating & Cooling",
    watts: 2000,
    defaultMinutes: 120,
    defaultUsesPerWeek: 7,
    notes: "Portable fan heater"
  },
  {
    id: "halogen-heater",
    name: "Halogen Heater (1.2kW)",
    category: "Heating & Cooling",
    watts: 1200,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    notes: "Portable heater"
  },
  {
    id: "electric-blanket",
    name: "Electric Blanket",
    category: "Heating & Cooling",
    watts: 100,
    defaultMinutes: 120,
    defaultUsesPerWeek: 7,
    notes: "Under blanket, single bed"
  },
  {
    id: "dehumidifier",
    name: "Dehumidifier",
    category: "Heating & Cooling",
    watts: 300,
    defaultMinutes: 480,
    defaultUsesPerWeek: 7,
    notes: "Compressor type, 8 hours"
  },
  {
    id: "desktop-computer",
    name: "Desktop Computer",
    category: "Computing",
    watts: 200,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Including monitor"
  },
  {
    id: "laptop",
    name: "Laptop Computer",
    category: "Computing",
    watts: 50,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    notes: "Average usage"
  },
  {
    id: "games-console",
    name: "Games Console",
    category: "Entertainment",
    watts: 150,
    defaultMinutes: 120,
    defaultUsesPerWeek: 5,
    notes: "PS5/Xbox Series X in use"
  },
  {
    id: "wifi-router",
    name: "WiFi Router",
    category: "Computing",
    watts: 10,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "led-bulb-10w",
    name: "LED Bulb (10W)",
    category: "Lighting",
    watts: 10,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    notes: "Equivalent to 60W incandescent"
  },
  {
    id: "led-bulb-6w",
    name: "LED Bulb (6W)",
    category: "Lighting",
    watts: 6,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    notes: "Equivalent to 40W incandescent"
  },
  {
    id: "halogen-bulb-50w",
    name: "Halogen Bulb (50W)",
    category: "Lighting",
    watts: 50,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    notes: "GU10 spotlight"
  },
  {
    id: "phone-charger",
    name: "Phone Charger",
    category: "Computing",
    watts: 5,
    defaultMinutes: 120,
    defaultUsesPerWeek: 7,
    notes: "Charging time"
  },
  {
    id: "tablet-charger",
    name: "Tablet Charger",
    category: "Computing",
    watts: 12,
    defaultMinutes: 180,
    defaultUsesPerWeek: 5,
    notes: "Charging time"
  },
  {
    id: "electric-vehicle",
    name: "Electric Vehicle Charging (7kW)",
    category: "Other",
    watts: 7000,
    defaultMinutes: 300,
    defaultUsesPerWeek: 2,
    notes: "Home wallbox charger, 5 hours"
  },
  {
    id: "hot-tub",
    name: "Hot Tub",
    category: "Other",
    watts: 3000,
    defaultMinutes: 120,
    defaultUsesPerWeek: 3,
    notes: "Heating cycle"
  },
  {
    id: "aquarium-pump",
    name: "Aquarium Pump & Heater",
    category: "Other",
    watts: 150,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "security-system",
    name: "Security System",
    category: "Other",
    watts: 5,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "doorbell-video",
    name: "Video Doorbell",
    category: "Other",
    watts: 3,
    defaultMinutes: 1440,
    defaultUsesPerWeek: 7,
    notes: "Runs 24/7"
  },
  {
    id: "ceiling-fan",
    name: "Ceiling Fan",
    category: "Heating & Cooling",
    watts: 75,
    defaultMinutes: 360,
    defaultUsesPerWeek: 7,
    notes: "Summer cooling"
  },
  {
    id: "printer",
    name: "Printer (Inkjet)",
    category: "Computing",
    watts: 30,
    defaultMinutes: 15,
    defaultUsesPerWeek: 2,
    notes: "Average weekly use"
  },
  {
    id: "bread-maker",
    name: "Bread Maker",
    category: "Kitchen Appliances",
    watts: 600,
    defaultMinutes: 180,
    defaultUsesPerWeek: 1,
    notes: "Full baking cycle"
  },
  {
    id: "food-mixer",
    name: "Food Mixer",
    category: "Kitchen Appliances",
    watts: 300,
    defaultMinutes: 10,
    defaultUsesPerWeek: 2,
    notes: "Stand mixer"
  },
  {
    id: "blender",
    name: "Blender",
    category: "Kitchen Appliances",
    watts: 400,
    defaultMinutes: 3,
    defaultUsesPerWeek: 5,
    notes: "Smoothie maker"
  },
  {
    id: "gas-boiler-24kw",
    name: "Gas Combi Boiler (24kW)",
    category: "Heating & Cooling",
    watts: 100,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 24,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "gas-boiler-30kw",
    name: "Gas Combi Boiler (30kW)",
    category: "Heating & Cooling",
    watts: 120,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 30,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "gas-boiler-system-18kw",
    name: "Gas System Boiler (18kW)",
    category: "Heating & Cooling",
    watts: 80,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 18,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "gas-boiler-system-28kw",
    name: "Gas System Boiler (28kW)",
    category: "Heating & Cooling",
    watts: 100,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 28,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "gas-boiler-regular-15kw",
    name: "Gas Regular Boiler (15kW)",
    category: "Heating & Cooling",
    watts: 70,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 15,
    notes: "Traditional with hot water tank, typical 5hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "gas-boiler-regular-25kw",
    name: "Gas Regular Boiler (25kW)",
    category: "Heating & Cooling",
    watts: 90,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    fuelType: "gas",
    gasKWhRating: 25,
    notes: "Traditional with hot water tank, typical 5hr/day runtime. Electric consumption shown, gas usage calculated separately"
  },
  {
    id: "oil-boiler-combi-18kw",
    name: "Oil Combi Boiler (18kW)",
    category: "Heating & Cooling",
    watts: 90,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "oil",
    oilKWhRating: 18,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, oil usage calculated separately"
  },
  {
    id: "oil-boiler-combi-26kw",
    name: "Oil Combi Boiler (26kW)",
    category: "Heating & Cooling",
    watts: 110,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "oil",
    oilKWhRating: 26,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, oil usage calculated separately"
  },
  {
    id: "oil-boiler-system-20kw",
    name: "Oil System Boiler (20kW)",
    category: "Heating & Cooling",
    watts: 85,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "oil",
    oilKWhRating: 20,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, oil usage calculated separately"
  },
  {
    id: "oil-boiler-system-32kw",
    name: "Oil System Boiler (32kW)",
    category: "Heating & Cooling",
    watts: 120,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "oil",
    oilKWhRating: 32,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, oil usage calculated separately"
  },
  {
    id: "oil-boiler-regular-26kw",
    name: "Oil Regular Boiler (26kW)",
    category: "Heating & Cooling",
    watts: 95,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    fuelType: "oil",
    oilKWhRating: 26,
    notes: "Traditional with hot water tank, typical 5hr/day runtime. Electric consumption shown, oil usage calculated separately"
  },
  {
    id: "lpg-boiler-combi-24kw",
    name: "LPG Combi Boiler (24kW)",
    category: "Heating & Cooling",
    watts: 100,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "lpg",
    lpgKWhRating: 24,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, LPG usage calculated separately"
  },
  {
    id: "lpg-boiler-combi-30kw",
    name: "LPG Combi Boiler (30kW)",
    category: "Heating & Cooling",
    watts: 120,
    defaultMinutes: 180,
    defaultUsesPerWeek: 7,
    fuelType: "lpg",
    lpgKWhRating: 30,
    notes: "Central heating & hot water, typical 3hr/day runtime. Electric consumption shown, LPG usage calculated separately"
  },
  {
    id: "lpg-boiler-system-18kw",
    name: "LPG System Boiler (18kW)",
    category: "Heating & Cooling",
    watts: 80,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "lpg",
    lpgKWhRating: 18,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, LPG usage calculated separately"
  },
  {
    id: "lpg-boiler-system-28kw",
    name: "LPG System Boiler (28kW)",
    category: "Heating & Cooling",
    watts: 100,
    defaultMinutes: 240,
    defaultUsesPerWeek: 7,
    fuelType: "lpg",
    lpgKWhRating: 28,
    notes: "With hot water cylinder, typical 4hr/day runtime. Electric consumption shown, LPG usage calculated separately"
  },
  {
    id: "lpg-boiler-regular-20kw",
    name: "LPG Regular Boiler (20kW)",
    category: "Heating & Cooling",
    watts: 85,
    defaultMinutes: 300,
    defaultUsesPerWeek: 7,
    fuelType: "lpg",
    lpgKWhRating: 20,
    notes: "Traditional with hot water tank, typical 5hr/day runtime. Electric consumption shown, LPG usage calculated separately"
  }
]
