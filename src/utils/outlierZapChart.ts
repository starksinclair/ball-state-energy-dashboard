import type { OutlierPreviewSeriesPoint } from "../types/api";

export function nearestPoint(
  series: OutlierPreviewSeriesPoint[],
  clickXMs: number,
): OutlierPreviewSeriesPoint | null {
  if (!series.length) return null;
  return series.reduce((best, p) => {
    const t = new Date(p.datetime).getTime();
    const bestT = new Date(best.datetime).getTime();
    return Math.abs(t - clickXMs) < Math.abs(bestT - clickXMs) ? p : best;
  });
}

export function addZap(
  manualOutliers: Record<string, string[]>,
  meter: string,
  datetime: string,
): Record<string, string[]> {
  const existing = manualOutliers[meter] ?? [];
  if (existing.includes(datetime)) return manualOutliers;
  return { ...manualOutliers, [meter]: [...existing, datetime].sort() };
}

export function removeZap(
  manualOutliers: Record<string, string[]>,
  meter: string,
  datetime: string,
): Record<string, string[]> {
  const existing = manualOutliers[meter];
  if (!existing?.length) return manualOutliers;
  const next = existing.filter((ts) => ts !== datetime);
  if (next.length === 0) {
    const rest = { ...manualOutliers };
    delete rest[meter];
    return rest;
  }
  return { ...manualOutliers, [meter]: next };
}

export function zapsForMeter(
  manualOutliers: Record<string, string[]>,
  meter: string,
): string[] {
  return manualOutliers[meter] ?? [];
}

export function valueAtDatetime(
  series: OutlierPreviewSeriesPoint[],
  datetime: string,
): number | undefined {
  return series.find((p) => p.datetime === datetime)?.value;
}
