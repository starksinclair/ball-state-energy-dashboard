export const THRESHOLD_MODE_DEFAULT = "rpca" as const;

export const THRESHOLD_NUMERIC_DEFAULTS = {
  n_thresholds: 80,
  rpca_tol: 1e-6,
  rpca_max_iter: 5000,
  contributions_top_n: 10,
  event_contributions_top_n: 5,
  heatmap_top_n: 50,
} as const;

export const THRESHOLD_BOOL_DEFAULTS = {
  heatmap_normalize: true,
  clean_all_meters: true,
} as const;

export const CONTRIBUTIONS_METHOD_DEFAULT = "sparse" as const;

/** Fallback window dates from API docs when dataset time_range is unavailable. */
export const THRESHOLD_WINDOW_FALLBACKS = {
  analysis_start: "2024-04-01",
  analysis_end: "2024-10-30",
  contribution_start: "2024-08-20",
  contribution_end: "2024-08-31",
  plot_start: "2024-08-14",
  plot_end: "2024-08-30",
} as const;

export function sliceDateOnly(value: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function defaultAnalysisWindow(timeRange?: {
  start?: string;
  end?: string;
}): { start: string; end: string } {
  if (timeRange?.start && timeRange?.end) {
    return {
      start: sliceDateOnly(timeRange.start),
      end: sliceDateOnly(timeRange.end),
    };
  }
  return {
    start: THRESHOLD_WINDOW_FALLBACKS.analysis_start,
    end: THRESHOLD_WINDOW_FALLBACKS.analysis_end,
  };
}

export function defaultContributionWindow() {
  return {
    start: THRESHOLD_WINDOW_FALLBACKS.contribution_start,
    end: THRESHOLD_WINDOW_FALLBACKS.contribution_end,
  };
}

export function defaultPlotWindow() {
  return {
    start: THRESHOLD_WINDOW_FALLBACKS.plot_start,
    end: THRESHOLD_WINDOW_FALLBACKS.plot_end,
  };
}
