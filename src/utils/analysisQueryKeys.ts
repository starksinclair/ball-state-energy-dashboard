import type { BaseRequest, PlotType } from "../types/api";

export function timeSeriesQueryKey(request: BaseRequest) {
  return [
    "time-series",
    request.start_date,
    request.end_date,
    request.meter,
    request.smoothing_method,
    request.smoothing_window,
    request.cleaning_method,
    request.cleaning_window,
    request.cleaning_n_sigma,
    request.cleaning_interval_width,
    request.meters_to_add,
    request.forecast,
    request.assessment,
    request.test_hours,
    request.model,
    request.interval_type,
    request.interval_width,
    request.sarimax_order,
    request.sarimax_seasonal_order,
    request.sarimax_trend,
    request.sarimax_enforce_stationarity,
    request.sarimax_enforce_invertibility,
    request.sarimax_concentrate_scale,
    request.sarimax_measurement_error,
    request.sarimax_simple_differencing,
    request.sarimax_method,
    request.sarimax_maxiter,
    request.sarimax_cov_type,
    request.prophet_changepoint_prior_scale,
    request.prophet_seasonality_prior_scale,
    request.prophet_holidays_prior_scale,
    request.prophet_n_changepoints,
    request.prophet_changepoint_range,
    request.prophet_growth,
    request.prophet_weekly_seasonality,
    request.prophet_daily_seasonality,
    request.prophet_mcmc_samples,
    request.n_lags,
    request.n_forecasts,
    request.lagged_features,
    request.feature_lags,
    request.epochs,
    request.n_changepoints,
    request.changepoints_range,
    request.trend_reg,
    request.seasonality_reg,
    request.seasonality_mode,
    request.yearly_seasonality,
    request.ar_reg,
    request.learning_rate,
    request.batch_size,
    request.newer_samples_weight,
    request.features,
  ] as const;
}

export function seasonalAnalysisQueryKey(
  request: Pick<
    BaseRequest,
    | "start_date"
    | "end_date"
    | "meter"
    | "meters_to_add"
    | "cleaning_method"
    | "cleaning_window"
    | "cleaning_n_sigma"
    | "cleaning_interval_width"
  >,
) {
  return [
    "seasonal-analysis",
    request.start_date,
    request.end_date,
    request.meter,
    request.meters_to_add,
    request.cleaning_method,
    request.cleaning_window,
    request.cleaning_n_sigma,
    request.cleaning_interval_width,
  ] as const;
}

export function temperatureAnalysisQueryKey(
  request: Pick<
    BaseRequest,
    | "start_date"
    | "end_date"
    | "meter"
    | "meters_to_add"
    | "cleaning_method"
    | "cleaning_window"
    | "cleaning_n_sigma"
    | "cleaning_interval_width"
  >,
) {
  return [
    "temperature-analysis",
    request.start_date,
    request.end_date,
    request.meter,
    request.meters_to_add,
    request.cleaning_method,
    request.cleaning_window,
    request.cleaning_n_sigma,
    request.cleaning_interval_width,
  ] as const;
}

export function edaPlotQueryKey(request: BaseRequest) {
  return [
    "eda-plot",
    request.eda_route,
    request.start_date,
    request.end_date,
    request.meter,
    request.meters_to_add,
    request.cleaning_method,
    request.cleaning_window,
    request.cleaning_n_sigma,
    request.cleaning_interval_width,
    request.seasonal_periods,
    request.seasonality_periods,
    request.n_harmonics,
    request.use_hac,
    request.include_kruskal_wallis,
    request.kw_tests,
    request.unit_root_regression,
    request.include_break_test,
    request.decompose_period,
    request.decompose_model,
    request.acf_lags,
    request.smoothing_method,
    request.smoothing_window,
    request.annotated,
  ] as const;
}

export function analysisQueryKey(
  plotType: PlotType,
  request: BaseRequest | null,
): readonly unknown[] | null {
  if (!request) return null;

  switch (plotType) {
    case "time-series":
    case "forecast":
      return timeSeriesQueryKey(request);
    case "seasonal-analysis":
      return seasonalAnalysisQueryKey(request);
    case "temperature-analysis":
      return temperatureAnalysisQueryKey(request);
    case "eda-plots":
      return request.eda_route ? edaPlotQueryKey(request) : null;
    default:
      return null;
  }
}
