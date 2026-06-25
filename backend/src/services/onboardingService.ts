import { execute, query } from "../database";

const DEVICE_ASSIGN_COUNT = 5;
const DAILY_KWH_TARGET = 30;
const MONTHLY_KWH_TARGET = 900;
const COST_PER_KWH = 0.2;

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDeviceStatus(
  defaultStatus: string,
): "online" | "warning" | "offline" {
  if (defaultStatus === "warning") {
    return Math.random() < 0.75 ? "warning" : "online";
  }
  if (defaultStatus === "offline") {
    return Math.random() < 0.5 ? "offline" : "online";
  }
  const roll = Math.random();
  if (roll < 0.03) return "offline";
  if (roll < 0.15) return "warning";
  return "online";
}

function getHourlyWeights(): number[] {
  return [
    0.35, 0.3, 0.3, 0.35, 0.5, 0.8, 1.1, 1.3, 1.4, 1.3, 1.1, 1.0, 0.95, 0.95,
    1.0, 1.1, 1.25, 1.4, 1.6, 1.5, 1.15, 0.9, 0.75, 0.6,
  ];
}

function buildHourlyDistribution(totalKwh: number): number[] {
  const weights = getHourlyWeights();
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  return weights.map((weight) =>
    Number(((totalKwh * weight) / sum).toFixed(3)),
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

async function getRandomDeviceCatalogItems(): Promise<any[]> {
  // Some MySQL servers do not support binding LIMIT as a parameter.
  return query<any[]>(
    `SELECT id, name, category, location_type, estimated_power_watts, average_daily_hours, default_status
     FROM devices_catalog ORDER BY RAND() LIMIT ${DEVICE_ASSIGN_COUNT}`,
  );
}

async function createEnergyTargets(userId: number): Promise<void> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  await execute(
    `INSERT INTO energy_targets (user_id, target_kwh, daily_target_kwh, month, achieved, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, ?)`,
    [
      userId,
      MONTHLY_KWH_TARGET,
      DAILY_KWH_TARGET,
      formatLocalDate(monthStart),
      formatDate(new Date()),
      formatDate(new Date()),
    ],
  );
}

function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const offset = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - offset);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(0, 0, 0, 0);
  return end;
}

function getRandomDailyKwh(estimatedKwh: number): number {
  const factor = clamp(0.8 + Math.random() * 0.4, 0.75, 1.25);
  return Number((estimatedKwh * factor).toFixed(2));
}

async function insertDeviceRows(
  userId: number,
  catalogItems: any[],
): Promise<any[]> {
  const deviceRows: any[] = [];
  for (const item of catalogItems) {
    const status = normalizeDeviceStatus(item.default_status);
    const isOn = status !== "offline" ? 1 : 0;
    const now = formatDate(new Date());
    const insertResult: any = await execute(
      `INSERT INTO devices (user_id, name, category, location, status, is_on, meta_key, meta_value, meta_unit, last_seen, created_at, updated_at, device_catalog_id, estimated_power_watts, average_daily_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        item.name,
        item.category,
        item.location_type,
        status,
        isOn,
        "estimated_power_watts",
        String(item.estimated_power_watts),
        "W",
        now,
        now,
        now,
        item.id,
        item.estimated_power_watts,
        item.average_daily_hours,
      ],
    );
    deviceRows.push({
      id: Number(insertResult.insertId),
      ...item,
    });
  }
  return deviceRows;
}

async function insertDailyUsage(
  userId: number,
  date: Date,
  kwh: number,
  cost: number,
): Promise<void> {
  await execute(
    `INSERT INTO daily_usage (user_id, usage_date, kwh, cost, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      formatLocalDate(date),
      kwh,
      cost,
      formatDate(date),
      formatDate(date),
    ],
  );
}

async function insertHourlyUsage(
  userId: number,
  date: Date,
  hour: number,
  kwh: number,
): Promise<void> {
  await execute(
    `INSERT INTO hourly_usage (user_id, usage_date, hour, kwh, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      formatLocalDate(date),
      hour,
      kwh,
      formatDate(date),
      formatDate(date),
    ],
  );
}

async function insertWeeklyUsage(
  userId: number,
  start: Date,
  end: Date,
  totalKwh: number,
  totalCost: number,
): Promise<void> {
  await execute(
    `INSERT INTO weekly_usage (user_id, week_start, week_end, total_kwh, total_cost, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      formatLocalDate(start),
      formatLocalDate(end),
      totalKwh,
      totalCost,
      formatDate(new Date()),
      formatDate(new Date()),
    ],
  );
}

async function insertMonthlyUsage(
  userId: number,
  month: Date,
  totalKwh: number,
  totalCost: number,
): Promise<void> {
  await execute(
    `INSERT INTO monthly_usage (user_id, month, total_kwh, total_cost, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      formatLocalDate(month),
      totalKwh,
      totalCost,
      formatDate(new Date()),
      formatDate(new Date()),
    ],
  );
}

function createAlertMessage(
  deviceName: string,
  type: string,
): { message: string; severity: "low" | "medium" | "high" | "critical" } {
  switch (type) {
    case "High Consumption":
      return {
        message: `${deviceName} recorded unusually high consumption in the last billing period. Review settings to reduce usage.`,
        severity: "high",
      };
    case "Peak Usage Detected":
      return {
        message: `A consumption spike was detected during peak hours for ${deviceName}. Consider shifting usage to off-peak times.`,
        severity: "medium",
      };
    case "Energy Target Exceeded":
      return {
        message: `Your energy target was exceeded today because ${deviceName} consumed more than expected.`,
        severity: "high",
      };
    case "Abnormal Usage Spike":
      return {
        message: `An abnormal usage spike was detected for ${deviceName}. Check the device and energy dashboard.`,
        severity: "critical",
      };
    default:
      return {
        message: `Review your ${deviceName} usage for optimal performance.`,
        severity: "medium",
      };
  }
}

function randomPastDate(daysBack: number): Date {
  const now = new Date();
  const result = new Date(now);
  result.setDate(now.getDate() - Math.floor(Math.random() * daysBack));
  result.setHours(
    8 + Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 60),
    0,
    0,
  );
  return result;
}

async function createInitialAlerts(
  userId: number,
  devices: any[],
): Promise<void> {
  const alertTypes = [
    "High Consumption",
    "Peak Usage Detected",
    "Energy Target Exceeded",
    "Abnormal Usage Spike",
  ];
  const activeDevice = devices[Math.floor(Math.random() * devices.length)];
  const alertsToCreate = Math.max(
    3,
    Math.min(5, Math.floor(3 + Math.random() * 3)),
  );

  for (let idx = 0; idx < alertsToCreate; idx += 1) {
    const type = alertTypes[idx % alertTypes.length];
    const { message, severity } = createAlertMessage(activeDevice.name, type);
    const createdAt = randomPastDate(7);
    await execute(
      `INSERT INTO alerts (user_id, device_id, type, message, severity, is_read, is_resolved, resolved_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, 0, NULL, ?, ?)`,
      [
        userId,
        activeDevice?.id ?? null,
        type,
        message,
        severity,
        formatDate(createdAt),
        formatDate(createdAt),
      ],
    );
  }
}

async function createUsageHistory(
  userId: number,
  devices: any[],
): Promise<void> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const estimatedDailyKwh = Math.max(
    3,
    devices.reduce((sum, device) => {
      return (
        sum + (device.estimated_power_watts * device.average_daily_hours) / 1000
      );
    }, 0),
  );
  const baseDailyKwh = clamp(estimatedDailyKwh * 0.95, 10, 35);

  const dailyHistory: { date: Date; kwh: number }[] = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dailyKwh = getRandomDailyKwh(baseDailyKwh);
    dailyHistory.push({ date, kwh: dailyKwh });
    await insertDailyUsage(
      userId,
      date,
      dailyKwh,
      Number((dailyKwh * COST_PER_KWH).toFixed(2)),
    );
  }

  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  const weekDays = dailyHistory.filter(
    (record) => record.date >= weekStart && record.date <= today,
  );
  const weekTotalKwh = Number(
    weekDays.reduce((acc, record) => acc + record.kwh, 0).toFixed(2),
  );
  await insertWeeklyUsage(
    userId,
    weekStart,
    weekEnd,
    weekTotalKwh,
    Number((weekTotalKwh * COST_PER_KWH).toFixed(2)),
  );

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthDays = dailyHistory.filter((record) => record.date >= monthStart);
  const monthTotalKwh = Number(
    monthDays.reduce((acc, record) => acc + record.kwh, 0).toFixed(2),
  );
  await insertMonthlyUsage(
    userId,
    monthStart,
    monthTotalKwh,
    Number((monthTotalKwh * COST_PER_KWH).toFixed(2)),
  );

  const last48Hours = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    today,
  ];
  for (const date of last48Hours) {
    const dayRecord = dailyHistory.find(
      (record) => formatLocalDate(record.date) === formatLocalDate(date),
    );
    const dayKwh = dayRecord?.kwh ?? baseDailyKwh;
    const hourlyValues = buildHourlyDistribution(dayKwh);
    for (let hour = 0; hour < 24; hour += 1) {
      await insertHourlyUsage(userId, date, hour, hourlyValues[hour]);
    }
  }
}

export async function onboardUser(userId: number): Promise<void> {
  const catalogItems = await getRandomDeviceCatalogItems();
  const assignedDevices = await insertDeviceRows(userId, catalogItems);
  await createEnergyTargets(userId);
  await createUsageHistory(userId, assignedDevices);
  await createInitialAlerts(userId, assignedDevices);
}
