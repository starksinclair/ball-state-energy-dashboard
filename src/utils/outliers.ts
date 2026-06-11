import type { Outlier } from "../types/api";

type RawOutlier = {
  datetime?: string;
  value?: number;
  DateTime?: string;
  Value?: number;
};

/** API may return lowercase keys; legacy responses used DateTime / Value. */
export function normalizeOutlier(raw: RawOutlier): Outlier {
  return {
    datetime: raw.datetime ?? raw.DateTime ?? "",
    value: raw.value ?? raw.Value ?? 0,
  };
}

export function normalizeOutliers(outliers: RawOutlier[]): Outlier[] {
  return outliers.map(normalizeOutlier);
}
