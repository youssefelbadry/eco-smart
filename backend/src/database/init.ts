import { query } from "./index";

const deviceCatalogItems = [
  {
    name: "Smart AC",
    category: "HVAC",
    location_type: "Living Room",
    estimated_power_watts: 1500,
    average_daily_hours: 6.0,
    default_status: "online",
  },
  {
    name: "Smart TV",
    category: "Entertainment",
    location_type: "Living Room",
    estimated_power_watts: 150,
    average_daily_hours: 4.0,
    default_status: "online",
  },
  {
    name: "Smart Fridge",
    category: "Kitchen",
    location_type: "Kitchen",
    estimated_power_watts: 200,
    average_daily_hours: 24.0,
    default_status: "online",
  },
  {
    name: "Smart Washing Machine",
    category: "Laundry",
    location_type: "Laundry Room",
    estimated_power_watts: 500,
    average_daily_hours: 1.0,
    default_status: "online",
  },
  {
    name: "Smart Oven",
    category: "Kitchen",
    location_type: "Kitchen",
    estimated_power_watts: 2500,
    average_daily_hours: 1.0,
    default_status: "online",
  },
  {
    name: "Smart Microwave",
    category: "Kitchen",
    location_type: "Kitchen",
    estimated_power_watts: 1200,
    average_daily_hours: 0.5,
    default_status: "online",
  },
  {
    name: "Smart Fan",
    category: "HVAC",
    location_type: "Bedroom",
    estimated_power_watts: 50,
    average_daily_hours: 4.0,
    default_status: "online",
  },
  {
    name: "Smart Water Heater",
    category: "Utilities",
    location_type: "Bathroom",
    estimated_power_watts: 4500,
    average_daily_hours: 2.0,
    default_status: "online",
  },
  {
    name: "Smart Lights",
    category: "Lighting",
    location_type: "Living Room",
    estimated_power_watts: 10,
    average_daily_hours: 5.0,
    default_status: "online",
  },
  {
    name: "Smart Door Lock",
    category: "Security",
    location_type: "Front Door",
    estimated_power_watts: 5,
    average_daily_hours: 24.0,
    default_status: "online",
  },
  {
    name: "Smart Security Camera",
    category: "Security",
    location_type: "Front Door",
    estimated_power_watts: 7,
    average_daily_hours: 24.0,
    default_status: "online",
  },
  {
    name: "Smart Router",
    category: "Connectivity",
    location_type: "Home Office",
    estimated_power_watts: 20,
    average_daily_hours: 24.0,
    default_status: "online",
  },
  {
    name: "Smart Dishwasher",
    category: "Kitchen",
    location_type: "Kitchen",
    estimated_power_watts: 1800,
    average_daily_hours: 1.0,
    default_status: "online",
  },
  {
    name: "Smart Coffee Machine",
    category: "Kitchen",
    location_type: "Kitchen",
    estimated_power_watts: 900,
    average_daily_hours: 0.5,
    default_status: "online",
  },
  {
    name: "Smart Vacuum",
    category: "Cleaning",
    location_type: "Living Room",
    estimated_power_watts: 600,
    average_daily_hours: 0.8,
    default_status: "online",
  },
  {
    name: "Smart Air Purifier",
    category: "Comfort",
    location_type: "Bedroom",
    estimated_power_watts: 80,
    average_daily_hours: 12.0,
    default_status: "online",
  },
  {
    name: "Smart Speaker",
    category: "Entertainment",
    location_type: "Living Room",
    estimated_power_watts: 30,
    average_daily_hours: 2.0,
    default_status: "online",
  },
  {
    name: "Smart Iron",
    category: "Laundry",
    location_type: "Laundry Room",
    estimated_power_watts: 1200,
    average_daily_hours: 0.5,
    default_status: "online",
  },
  {
    name: "Smart Desktop PC",
    category: "Computing",
    location_type: "Home Office",
    estimated_power_watts: 250,
    average_daily_hours: 3.0,
    default_status: "online",
  },
  {
    name: "Smart Gaming Console",
    category: "Entertainment",
    location_type: "Living Room",
    estimated_power_watts: 200,
    average_daily_hours: 2.0,
    default_status: "online",
  },
];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function hasColumn(table: string, column: string): Promise<boolean> {
  const rows = await query<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column],
  );
  return (rows[0]?.count || 0) > 0;
}

export async function ensureDatabaseInitialized(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS devices_catalog (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      location_type VARCHAR(255) NOT NULL,
      estimated_power_watts INT NOT NULL,
      average_daily_hours DECIMAL(5,2) NOT NULL,
      default_status ENUM('online','offline','warning') NOT NULL DEFAULT 'online',
      created_at TIMESTAMP NULL,
      updated_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  if (!(await hasColumn("devices", "device_catalog_id"))) {
    await query(
      `ALTER TABLE devices ADD COLUMN device_catalog_id BIGINT UNSIGNED NULL`,
    );
  }
  if (!(await hasColumn("devices", "estimated_power_watts"))) {
    await query(
      `ALTER TABLE devices ADD COLUMN estimated_power_watts INT NOT NULL DEFAULT 0`,
    );
  }
  if (!(await hasColumn("devices", "average_daily_hours"))) {
    await query(
      `ALTER TABLE devices ADD COLUMN average_daily_hours DECIMAL(5,2) NOT NULL DEFAULT 0`,
    );
  }

  if (!(await hasColumn("energy_targets", "daily_target_kwh"))) {
    await query(
      `ALTER TABLE energy_targets ADD COLUMN daily_target_kwh DECIMAL(10,2) NOT NULL DEFAULT 30`,
    );
  }

  for (const item of deviceCatalogItems) {
    await query(
      `INSERT INTO devices_catalog (name, category, location_type, estimated_power_watts, average_daily_hours, default_status, created_at, updated_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM devices_catalog WHERE name = ?)
      `,
      [
        item.name,
        item.category,
        item.location_type,
        item.estimated_power_watts,
        item.average_daily_hours,
        item.default_status,
        formatDate(new Date()),
        formatDate(new Date()),
        item.name,
      ],
    );
  }
}
