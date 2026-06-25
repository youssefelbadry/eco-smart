console.log("[USAGE-CTRL-1] Starting usageController module load");

console.log("[USAGE-CTRL-2] Before import express");
import { Request, Response } from "express";
console.log("[USAGE-CTRL-3] After import express");

console.log("[USAGE-CTRL-4] Before import query");
import { query } from "../database";
console.log("[USAGE-CTRL-5] After import query");

console.log("[USAGE-CTRL-6] Before import success");
import { success } from "../utils/response";
console.log("[USAGE-CTRL-7] After import success");

console.log("[USAGE-CTRL-8] Before import AuthRequest");
import { AuthRequest } from "../middleware/auth";
console.log("[USAGE-CTRL-9] After import AuthRequest");

export async function usageOverview(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [dailies] = await query<any[]>(
    "SELECT usage_date, kwh, cost FROM daily_usage WHERE user_id = ? AND usage_date = CURDATE() LIMIT 1",
    [userId],
  );
  const [weeklies] = await query<any[]>(
    "SELECT week_start, week_end, total_kwh, total_cost FROM weekly_usage WHERE user_id = ? AND week_start <= CURDATE() ORDER BY week_start DESC LIMIT 1",
    [userId],
  );
  const [monthlies] = await query<any[]>(
    'SELECT month, total_kwh, total_cost FROM monthly_usage WHERE user_id = ? AND month <= DATE_FORMAT(CURDATE(), "%Y-%m-01") ORDER BY month DESC LIMIT 1',
    [userId],
  );

  const daily = (dailies as any) || {};
  const weekly = (weeklies as any) || {};
  const monthly = (monthlies as any) || {};

  const energyTargets = await query<any[]>(
    `SELECT target_kwh, daily_target_kwh FROM energy_targets WHERE user_id = ? AND month = DATE_FORMAT(CURDATE(), "%Y-%m-01") LIMIT 1`,
    [userId],
  );
  const targetRow = (energyTargets[0] as any) || {};
  const dailyTarget = Number(targetRow.daily_target_kwh ?? 30);
  const monthlyTarget = Number(targetRow.target_kwh ?? 900);

  const dailyUsage = Number(daily.kwh ?? 0);
  const weeklyUsage = Number(weekly.total_kwh ?? 0);
  const monthlyUsage = Number(monthly.total_kwh ?? 0);

  return success({
    res,
    data: {
      daily: {
        period_type: "daily",
        usage_kwh: dailyUsage,
        baseline_kwh: 0,
        target_kwh: dailyTarget,
        achievement_percent:
          dailyTarget > 0
            ? Math.min(
                100,
                Number(((dailyUsage / dailyTarget) * 100).toFixed(2)),
              )
            : 0,
        period_start: daily.usage_date ?? null,
        period_end: daily.usage_date ?? null,
        cost: daily.cost ?? 0,
      },
      weekly: {
        period_type: "weekly",
        usage_kwh: weeklyUsage,
        baseline_kwh: 0,
        target_kwh: dailyTarget * 7,
        achievement_percent:
          dailyTarget > 0
            ? Math.min(
                100,
                Number(((weeklyUsage / (dailyTarget * 7)) * 100).toFixed(2)),
              )
            : 0,
        period_start: weekly.week_start ?? null,
        period_end: weekly.week_end ?? null,
        cost: weekly.total_cost ?? 0,
      },
      monthly: {
        period_type: "monthly",
        usage_kwh: monthlyUsage,
        baseline_kwh: 0,
        target_kwh: monthlyTarget,
        achievement_percent:
          monthlyTarget > 0
            ? Math.min(
                100,
                Number(((monthlyUsage / monthlyTarget) * 100).toFixed(2)),
              )
            : 0,
        period_start: monthly.month ?? null,
        period_end: monthly.month ?? null,
        cost: monthly.total_cost ?? 0,
      },
    },
  });
}

export async function usageTrend(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const rows = await query<any[]>(
    `SELECT CONCAT(usage_date, ' ', LPAD(hour, 2, '0'), ':00:00') AS point_time, kwh AS usage_kwh
     FROM hourly_usage WHERE user_id = ? AND usage_date = CURDATE() ORDER BY hour ASC`,
    [userId],
  );
  return success({
    res,
    data: rows,
  });
}
