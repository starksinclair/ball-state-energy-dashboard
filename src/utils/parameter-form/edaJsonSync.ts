import type { KruskalWallisTestSpec } from "../../types/api";
import { DEFAULT_N_HARMONICS_BY_PERIOD } from "../../constants/edaDefaults";

export function parseSeasonalityPeriodsText(text: string): number[] {
  return text
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n > 0);
}

function defaultNHarmonicsForPeriod(period: number): number {
  return DEFAULT_N_HARMONICS_BY_PERIOD[String(period)] ?? 3;
}

export function syncNHarmonicsJsonForPeriods(
  currentJson: string,
  periods: number[],
): string {
  let existing: Record<string, number> = {};
  try {
    const parsed = JSON.parse(currentJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      existing = Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).filter(
          ([, v]) => typeof v === "number" && !Number.isNaN(v),
        ),
      ) as Record<string, number>;
    }
  } catch {
    /* use defaults */
  }
  const next: Record<string, number> = {};
  for (const period of periods) {
    const key = String(period);
    next[key] = existing[key] ?? defaultNHarmonicsForPeriod(period);
  }
  return JSON.stringify(next);
}

function defaultKwTestSpec(period: number): KruskalWallisTestSpec {
  return { period };
}

export function syncKwTestsJsonForPeriods(
  currentJson: string,
  periods: number[],
): string {
  let existing: KruskalWallisTestSpec[] = [];
  try {
    const parsed = JSON.parse(currentJson) as unknown;
    if (Array.isArray(parsed)) {
      existing = parsed.filter(
        (item): item is KruskalWallisTestSpec =>
          item != null &&
          typeof item === "object" &&
          typeof (item as KruskalWallisTestSpec).period === "number",
      );
    }
  } catch {
    /* rebuild */
  }
  const byPeriod = new Map(
    existing.map((spec) => [spec.period, spec] as const),
  );
  const next = periods.map(
    (period) => byPeriod.get(period) ?? defaultKwTestSpec(period),
  );
  return JSON.stringify(next, null, 2);
}

export function syncFeatureLagsJsonForFeatures(
  currentJson: string,
  features: string[],
  defaultLag: number,
): string {
  let existing: Record<string, number> = {};
  try {
    const parsed = JSON.parse(currentJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      existing = Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).filter(
          ([, v]) => typeof v === "number" && !Number.isNaN(v),
        ),
      ) as Record<string, number>;
    }
  } catch {
    /* use defaultLag */
  }
  const next: Record<string, number> = {};
  for (const feat of features) {
    next[feat] = existing[feat] ?? defaultLag;
  }
  return JSON.stringify(next);
}
