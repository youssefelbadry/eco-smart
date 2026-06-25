export interface DeviceCatalogItem {
  name: string;
  category: string;
  location: string;
  estimated_power_watts: number;
  status: string;
}

export const DEVICE_CATALOG: DeviceCatalogItem[] = [
  {
    name: "Smart AC",
    category: "Climate Control",
    location: "Living Room",
    estimated_power_watts: 1500,
    status: "online",
  },
  {
    name: "Smart TV",
    category: "Entertainment",
    location: "Living Room",
    estimated_power_watts: 120,
    status: "online",
  },
  {
    name: "Smart Fridge",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 150,
    status: "online",
  },
  {
    name: "Smart Washing Machine",
    category: "Laundry",
    location: "Laundry Room",
    estimated_power_watts: 500,
    status: "online",
  },
  {
    name: "Smart Oven",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 2000,
    status: "online",
  },
  {
    name: "Smart Microwave",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 1000,
    status: "online",
  },
  {
    name: "Smart Fan",
    category: "Climate Control",
    location: "Bedroom",
    estimated_power_watts: 75,
    status: "online",
  },
  {
    name: "Smart Water Heater",
    category: "Climate Control",
    location: "Bathroom",
    estimated_power_watts: 3000,
    status: "online",
  },
  {
    name: "Smart Lights",
    category: "Lighting",
    location: "Living Room",
    estimated_power_watts: 15,
    status: "online",
  },
  {
    name: "Smart Door Lock",
    category: "Security",
    location: "Front Door",
    estimated_power_watts: 10,
    status: "online",
  },
  {
    name: "Smart Security Camera",
    category: "Security",
    location: "Front Door",
    estimated_power_watts: 5,
    status: "online",
  },
  {
    name: "Smart Router",
    category: "Network",
    location: "Office",
    estimated_power_watts: 20,
    status: "online",
  },
  {
    name: "Smart Dishwasher",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 1200,
    status: "online",
  },
  {
    name: "Smart Coffee Machine",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 800,
    status: "online",
  },
  {
    name: "Smart Vacuum",
    category: "Cleaning",
    location: "Living Room",
    estimated_power_watts: 30,
    status: "online",
  },
  {
    name: "Smart Air Purifier",
    category: "Climate Control",
    location: "Bedroom",
    estimated_power_watts: 50,
    status: "online",
  },
  {
    name: "Smart Speaker",
    category: "Entertainment",
    location: "Living Room",
    estimated_power_watts: 5,
    status: "online",
  },
  {
    name: "Smart Iron",
    category: "Laundry",
    location: "Laundry Room",
    estimated_power_watts: 1000,
    status: "online",
  },
  {
    name: "Smart Desktop PC",
    category: "Entertainment",
    location: "Office",
    estimated_power_watts: 300,
    status: "online",
  },
  {
    name: "Smart Gaming Console",
    category: "Entertainment",
    location: "Living Room",
    estimated_power_watts: 150,
    status: "online",
  },
  {
    name: "Smart Thermostat",
    category: "Climate Control",
    location: "Living Room",
    estimated_power_watts: 5,
    status: "online",
  },
  {
    name: "Smart Blender",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 500,
    status: "online",
  },
  {
    name: "Smart Hair Dryer",
    category: "Personal Care",
    location: "Bathroom",
    estimated_power_watts: 1500,
    status: "online",
  },
  {
    name: "Smart Electric Kettle",
    category: "Kitchen Appliances",
    location: "Kitchen",
    estimated_power_watts: 1500,
    status: "online",
  },
  {
    name: "Smart Dehumidifier",
    category: "Climate Control",
    location: "Basement",
    estimated_power_watts: 700,
    status: "online",
  },
];

export function getRandomDevices(count: number): DeviceCatalogItem[] {
  const shuffled = [...DEVICE_CATALOG].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
