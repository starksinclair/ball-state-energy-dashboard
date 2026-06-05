export const DEFAULT_N_HARMONICS_BY_PERIOD: Record<string, number> = {
  "24": 3,
  "168": 6,
};

export const DEFAULT_KW_TESTS_JSON =
  '[\n  { "period": 24 },\n  { "period": 168 }\n]';

export const DEFAULT_N_HARMONICS_JSON = '{"24": 3, "168": 6}';

export const EDA_ROUTE_OPTIONS: { value: string; label: string }[] = [
  {
    value: "trend-tests",
    label: "Trend Tests (Mann-Kendall & Seasonal Kendall)",
  },
  {
    value: "seasonality-tests",
    label: "Seasonality Tests (Harmonic F-test, K-W & OCSB)",
  },
  { value: "unit-root-tests", label: "Unit Root Tests (ADF, KPSS)" },
  { value: "seasonal-decompose", label: "Seasonal Decomposition" },
  { value: "autocorr", label: "Autocorrelation (ACF)" },
  { value: "annotated-timeseries", label: "Annotated Time Series" },
];
