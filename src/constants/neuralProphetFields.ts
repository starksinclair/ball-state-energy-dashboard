/** Regressor columns available for features / lagged_features. */
export const NP_REGRESSOR_OPTIONS = [
  "is_not_weekend",
  "IsNotHoliday",
  "IsnotSummerBreak",
] as const;

export type NpYearlySeasonalityUi = "auto" | "true" | "false" | "custom";

/** Prophet weekly/daily: on, off, or Fourier order. */
export type ProphetSeasonalityBoolUi = "true" | "false" | "custom";

export type NpFeatureLagsUi = "default" | "uniform" | "json";
