export interface EnergyTip {
  id: string
  category: string
  title: string
  description: string
  potentialSaving?: string
}

export const ENERGY_TIPS: EnergyTip[] = [
  {
    id: "heating-thermostat",
    category: "Heating & Cooling",
    title: "Lower your thermostat by 1°C",
    description: "Reducing your room temperature by just 1 degree can save around 10% on your heating bills. Aim for 18-21°C in living areas and 16-18°C in bedrooms.",
    potentialSaving: "£100-150 per year"
  },
  {
    id: "heating-timer",
    category: "Heating & Cooling",
    title: "Use heating controls and timers",
    description: "Set your heating to come on only when you need it. Most people only need heating for a few hours in the morning and evening.",
    potentialSaving: "£75-100 per year"
  },
  {
    id: "draught-proofing",
    category: "Heating & Cooling",
    title: "Draught proof windows and doors",
    description: "Block gaps around windows and doors with draught excluders to prevent heat escaping. This is one of the cheapest and most effective improvements.",
    potentialSaving: "£25-50 per year"
  },
  {
    id: "curtains-blinds",
    category: "Heating & Cooling",
    title: "Close curtains at dusk",
    description: "Closing curtains and blinds when it gets dark helps retain heat. Thermal or lined curtains are even more effective.",
    potentialSaving: "£15-30 per year"
  },
  {
    id: "radiator-reflectors",
    category: "Heating & Cooling",
    title: "Use radiator reflector panels",
    description: "Place heat-reflective panels behind radiators on external walls to reflect heat back into the room instead of warming the wall.",
    potentialSaving: "£15-25 per year per radiator"
  },
  {
    id: "bleed-radiators",
    category: "Heating & Cooling",
    title: "Bleed radiators regularly",
    description: "If radiators feel cold at the top, they may have air trapped inside. Bleeding them allows hot water to circulate properly.",
    potentialSaving: "Improved efficiency"
  },
  {
    id: "fridge-temperature",
    category: "Kitchen Appliances",
    title: "Set fridge to 3-5°C, freezer to -18°C",
    description: "Your fridge doesn't need to be colder than 3-5°C and freezer should be at -18°C. Every degree colder uses more energy.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "fridge-defrost",
    category: "Kitchen Appliances",
    title: "Defrost freezer regularly",
    description: "Ice buildup makes freezers work harder. Defrost when ice is more than 6mm thick, or use a frost-free model.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "fridge-full",
    category: "Kitchen Appliances",
    title: "Keep fridge and freezer reasonably full",
    description: "Full fridges and freezers are more efficient as the food helps maintain the cold temperature. Don't overfill though as air needs to circulate.",
    potentialSaving: "Improved efficiency"
  },
  {
    id: "fridge-door",
    category: "Kitchen Appliances",
    title: "Don't leave fridge door open",
    description: "Every time you open the fridge door, cold air escapes. Decide what you want before opening and close it quickly.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "kettle-amount",
    category: "Kitchen Appliances",
    title: "Only boil what you need",
    description: "Overfilling the kettle wastes energy and money. Only boil the amount of water you actually need.",
    potentialSaving: "£6-10 per year"
  },
  {
    id: "kettle-descale",
    category: "Kitchen Appliances",
    title: "Descale your kettle",
    description: "Limescale buildup makes kettles less efficient. Descale regularly using white vinegar or a descaling product.",
    potentialSaving: "Improved efficiency"
  },
  {
    id: "microwave-vs-oven",
    category: "Kitchen Appliances",
    title: "Use microwave instead of oven when possible",
    description: "Microwaves use less energy than ovens and are much quicker for reheating food and cooking small portions.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "oven-door",
    category: "Kitchen Appliances",
    title: "Keep oven door closed while cooking",
    description: "Opening the oven door lets heat escape and increases cooking time. Use the oven light to check on food instead.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "pan-lids",
    category: "Kitchen Appliances",
    title: "Use pan lids when cooking",
    description: "Putting lids on pans when boiling water or cooking reduces energy needed by up to 90%.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "dishwasher-full",
    category: "Kitchen Appliances",
    title: "Only run dishwasher when full",
    description: "Wait until the dishwasher is full before running it. Use the eco setting if available - it uses less water and energy.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "washing-30",
    category: "Laundry",
    title: "Wash clothes at 30°C",
    description: "Modern detergents work well at 30°C. Washing at lower temperatures uses much less energy than 40°C or 60°C.",
    potentialSaving: "£25-35 per year"
  },
  {
    id: "washing-full-load",
    category: "Laundry",
    title: "Only wash full loads",
    description: "Wait until you have a full load before using the washing machine. If you must do a small load, adjust the water level.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "air-dry",
    category: "Laundry",
    title: "Air dry clothes instead of tumble drying",
    description: "Tumble dryers are one of the most expensive appliances to run. Use a washing line, clothes horse, or heated airer instead.",
    potentialSaving: "£100-150 per year"
  },
  {
    id: "spin-speed",
    category: "Laundry",
    title: "Use highest spin speed",
    description: "A higher spin speed removes more water from clothes, reducing drying time whether you use a dryer or air dry.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "iron-batches",
    category: "Laundry",
    title: "Iron in batches",
    description: "Ironing uses lots of energy to heat up. Iron multiple items in one session rather than heating the iron up repeatedly.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "led-bulbs",
    category: "Lighting",
    title: "Switch to LED bulbs",
    description: "LED bulbs use up to 90% less energy than old incandescent bulbs and last much longer. They pay for themselves quickly.",
    potentialSaving: "£35-60 per year"
  },
  {
    id: "lights-off",
    category: "Lighting",
    title: "Turn lights off when leaving a room",
    description: "Don't leave lights on in empty rooms. Even LED bulbs use energy, and switching them on and off doesn't reduce their lifespan.",
    potentialSaving: "£15-25 per year"
  },
  {
    id: "natural-light",
    category: "Lighting",
    title: "Make the most of natural daylight",
    description: "Keep curtains and blinds open during the day to use natural light. Clean windows regularly to maximize light coming in.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "standby-power",
    category: "Entertainment",
    title: "Turn devices off at the plug",
    description: "Devices left on standby still use electricity. Turn off TVs, games consoles, and computers at the plug when not in use.",
    potentialSaving: "£35-65 per year"
  },
  {
    id: "tv-brightness",
    category: "Entertainment",
    title: "Reduce TV brightness",
    description: "Most TVs come with brightness set too high. Reducing it to a comfortable level saves energy and is better for your eyes.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "eco-settings",
    category: "Entertainment",
    title: "Use eco modes on devices",
    description: "Many TVs and other devices have eco or energy-saving modes. Enable these to reduce power consumption automatically.",
    potentialSaving: "£10-20 per year"
  },
  {
    id: "shower-time",
    category: "Personal Care",
    title: "Spend less time in the shower",
    description: "Reducing shower time by just one minute per person per day can save a significant amount on water heating costs.",
    potentialSaving: "£10-15 per person per year"
  },
  {
    id: "shower-vs-bath",
    category: "Personal Care",
    title: "Take showers instead of baths",
    description: "A typical bath uses about 80 liters of water, while a 5-minute shower uses around 35 liters. Showers are usually cheaper.",
    potentialSaving: "£15-25 per year"
  },
  {
    id: "water-heating",
    category: "Personal Care",
    title: "Don't overheat water",
    description: "Set your hot water cylinder thermostat to 60°C. Any hotter wastes energy and increases risk of scalding.",
    potentialSaving: "£20-30 per year"
  },
  {
    id: "insulate-tank",
    category: "Heating & Cooling",
    title: "Insulate hot water tank",
    description: "Fit an insulating jacket to your hot water cylinder if it doesn't have one. This reduces heat loss significantly.",
    potentialSaving: "£40-70 per year"
  },
  {
    id: "insulate-pipes",
    category: "Heating & Cooling",
    title: "Insulate hot water pipes",
    description: "Insulating pipes between your boiler and hot water cylinder reduces heat loss and gets hot water to taps faster.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "smart-meter",
    category: "Other",
    title: "Get a smart meter",
    description: "Smart meters show your energy use in real-time, helping you identify where you're using most energy and make savings.",
    potentialSaving: "Information tool - enables other savings"
  },
  {
    id: "energy-efficient",
    category: "Other",
    title: "Buy energy-efficient appliances",
    description: "When replacing appliances, look for the highest energy rating (A+++). They cost more initially but save money long-term.",
    potentialSaving: "Varies by appliance"
  },
  {
    id: "computer-sleep",
    category: "Computing",
    title: "Put computers to sleep",
    description: "Set computers to sleep mode after a short period of inactivity. Turn them off completely overnight and when away.",
    potentialSaving: "£15-25 per year"
  },
  {
    id: "laptop-vs-desktop",
    category: "Computing",
    title: "Use laptop instead of desktop",
    description: "Laptops use much less electricity than desktop computers. If buying new, consider whether a laptop would meet your needs.",
    potentialSaving: "£20-35 per year"
  },
  {
    id: "router-timer",
    category: "Computing",
    title: "Turn off WiFi router overnight",
    description: "WiFi routers run 24/7 but you don't need internet while sleeping. Use a timer plug to switch it off overnight.",
    potentialSaving: "£10-15 per year"
  },
  {
    id: "charger-unplug",
    category: "Computing",
    title: "Unplug chargers when not in use",
    description: "Phone and device chargers use small amounts of electricity even when not charging. Unplug them when finished.",
    potentialSaving: "£5-10 per year"
  },
  {
    id: "grants-support",
    category: "Other",
    title: "Check for grants and support",
    description: "Many households qualify for grants to improve home insulation or upgrade heating systems. Check eligibility with your local authority or energy supplier.",
    potentialSaving: "Potentially hundreds per year"
  }
]
