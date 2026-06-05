import { toast } from "react-toastify";
import type {
  BaseRequest,
  FormField,
  KruskalWallisTestSpec,
  PlotType,
} from "../../types/api";
import type { MeterGroup } from "../../types/parameterForm";
import type { ParameterFormBindings } from "../../components/parameter-form/types";
import { CLEANING_METHOD_EXTRA_FIELDS } from "../../constants/cleaningMethodExtraFields";
import { parseSeasonalityPeriodsText } from "./edaJsonSync";
import { parseOptionalNumber } from "./parseOptionalNumber";
import {
  resolveProphetBoolSeasonality,
  resolveYearlySeasonality,
} from "./seasonalityResolvers";

export type BuildResult =
  | { ok: true; params: BaseRequest }
  | { ok: false };

interface BuildBaseRequestArgs {
  state: ParameterFormBindings;
  selectedPlotType: PlotType;
  shouldShowField: (field: FormField) => boolean;
  meterGroups: MeterGroup[];
}

export function buildBaseRequest({
  state,
  selectedPlotType,
  shouldShowField,
  meterGroups,
}: BuildBaseRequestArgs): BuildResult {
  if (!state.startDate || !state.endDate) {
    toast.error("Please select both start and end dates");
    return { ok: false };
  }

  if (new Date(state.startDate) > new Date(state.endDate)) {
    toast.error("Start date must be before or equal to end date");
    return { ok: false };
  }

  const params: BaseRequest = {
    start_date: state.startDate,
    end_date: state.endDate,
    meter: state.meter,
  };

  if (shouldShowField("cleaning_method") && state.cleaningMethod) {
    params.cleaning_method = state.cleaningMethod as
      | "Prophet"
      | "Hampel"
      | "Polynomial"
      | "None";
    const extraFields = CLEANING_METHOD_EXTRA_FIELDS[params.cleaning_method];
    if (extraFields?.length) {
      for (const f of extraFields) {
        const v = state.cleaningExtra[f.key];
        if (typeof v === "number" && !Number.isNaN(v)) {
          if (f.key === "cleaning_window") params.cleaning_window = v;
          else if (f.key === "cleaning_n_sigma") params.cleaning_n_sigma = v;
          else if (f.key === "cleaning_interval_width") {
            params.cleaning_interval_width = v;
          }
        }
      }
    }
  }

  if (shouldShowField("smoothing_method") && state.smoothingMethod) {
    params.smoothing_method = state.smoothingMethod;
  }
  if (shouldShowField("smoothing_window")) {
    if (state.smoothingMethod === "ma" && state.smoothingWindow) {
      params.smoothing_window = state.smoothingWindow;
    } else if (state.smoothingMethod === "hp" && state.hpLambda) {
      params.smoothing_window = state.hpLambda;
    }
  }

  if (selectedPlotType === "time-series" && (state.forecast || state.assessment)) {
    params.forecast = state.forecast;
    params.assessment = state.assessment;
    params.test_hours = state.testHours;
    params.model = state.forecastModel;
    params.interval_type = state.forecastIntervalType;
    params.interval_width = state.forecastIntervalWidth;

    if (state.forecastModel === "SARIMAX") {
      params.sarimax_order = state.sarimaxOrder;
      params.sarimax_seasonal_order = state.sarimaxSeasonalOrder;
      if (state.sarimaxTrend) params.sarimax_trend = state.sarimaxTrend;
      params.sarimax_enforce_stationarity = state.sarimaxEnforceStationarity;
      params.sarimax_enforce_invertibility = state.sarimaxEnforceInvertibility;
      params.sarimax_concentrate_scale = state.sarimaxConcentrateScale;
      params.sarimax_measurement_error = state.sarimaxMeasurementError;
      params.sarimax_simple_differencing = state.sarimaxSimpleDifferencing;
      params.sarimax_method = state.sarimaxMethod;
      params.sarimax_maxiter = state.sarimaxMaxiter;
      params.sarimax_cov_type = state.sarimaxCovType;
    }

    if (state.forecastModel === "Prophet") {
      params.prophet_changepoint_prior_scale = state.prophetChangepointPriorScale;
      params.prophet_seasonality_prior_scale = state.prophetSeasonalityPriorScale;
      params.prophet_holidays_prior_scale = state.prophetHolidaysPriorScale;
      params.prophet_n_changepoints = state.prophetNChangepoints;
      params.prophet_changepoint_range = state.prophetChangepointRange;
      params.prophet_growth = state.prophetGrowth;
      params.prophet_weekly_seasonality = resolveProphetBoolSeasonality(
        state.prophetWeeklySeasonality,
        state.prophetWeeklySeasonalityOrder,
      );
      params.prophet_daily_seasonality = resolveProphetBoolSeasonality(
        state.prophetDailySeasonality,
        state.prophetDailySeasonalityOrder,
      );
      params.prophet_mcmc_samples = state.prophetMcmcSamples;
      params.seasonality_mode = state.npSeasonalityMode;
      params.yearly_seasonality = resolveYearlySeasonality(
        state.npYearlySeasonality,
        state.npYearlySeasonalityOrder,
      );
    }

    if (state.forecastModel === "NeuralProphet") {
      params.n_lags = state.neuralProphetNLags;
      params.n_forecasts = state.neuralProphetNForecasts;
      params.n_changepoints = state.npNChangepoints;
      params.changepoints_range = state.npChangepointsRange;
      params.trend_reg = state.npTrendReg;
      params.seasonality_reg = state.npSeasonalityReg;
      params.seasonality_mode = state.npSeasonalityMode;
      if (state.laggedFeatures.length > 0) {
        params.lagged_features = state.laggedFeatures;
      }
      const epochs = parseOptionalNumber(state.npEpochs);
      if (epochs !== undefined) params.epochs = epochs;
      if (state.npFeatureLagsMode === "uniform") {
        const fl = parseOptionalNumber(state.npFeatureLagsUniform);
        if (fl !== undefined) params.feature_lags = fl;
      } else if (
        state.npFeatureLagsMode === "json" &&
        state.npFeatureLagsJson.trim()
      ) {
        try {
          const parsed = JSON.parse(state.npFeatureLagsJson) as Record<
            string,
            number
          >;
          if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
          ) {
            throw new Error("Expected JSON object");
          }
          params.feature_lags = parsed;
        } catch {
          toast.error("feature_lags must be valid JSON object");
          return { ok: false };
        }
      }
      params.yearly_seasonality = resolveYearlySeasonality(
        state.npYearlySeasonality,
        state.npYearlySeasonalityOrder,
      );
      const arReg = parseOptionalNumber(state.npArReg);
      if (arReg !== undefined) params.ar_reg = arReg;
      const lr = parseOptionalNumber(state.npLearningRate);
      if (lr !== undefined) params.learning_rate = lr;
      const bs = parseOptionalNumber(state.npBatchSize);
      if (bs !== undefined) params.batch_size = bs;
      const nsw = parseOptionalNumber(state.npNewerSamplesWeight);
      if (nsw !== undefined) params.newer_samples_weight = nsw;
    }

    if (state.features.length > 0) {
      params.features = state.features;
    }
  }

  if (selectedPlotType === "eda-plots") {
    params.eda_route = state.edaRoute;
    if (state.edaRoute === "trend-tests") {
      params.seasonal_periods = state.edaSeasonalPeriods;
    }
    if (state.edaRoute === "seasonality-tests") {
      const periods = parseSeasonalityPeriodsText(state.edaSeasonalityPeriodsText);
      if (periods.length === 0) {
        toast.error(
          "Enter at least one seasonality period (hours), e.g. 24, 168",
        );
        return { ok: false };
      }
      params.seasonality_periods = periods;
      params.use_hac = state.edaUseHac;
      params.include_kruskal_wallis = state.edaIncludeKruskalWallis;
      if (state.edaKwTestsMode === "custom" && state.edaKwTestsJson.trim()) {
        try {
          const parsed = JSON.parse(state.edaKwTestsJson) as unknown;
          if (!Array.isArray(parsed)) throw new Error("Expected JSON array");
          params.kw_tests = parsed as KruskalWallisTestSpec[];
        } catch {
          toast.error("kw_tests must be a valid JSON array");
          return { ok: false };
        }
      }
      if (state.edaNHarmonicsMode === "shared") {
        const n = parseInt(state.edaNHarmonicsShared, 10);
        if (!Number.isNaN(n) && n > 0) params.n_harmonics = n;
      } else if (
        state.edaNHarmonicsMode === "dict" &&
        state.edaNHarmonicsJson.trim()
      ) {
        try {
          const parsed = JSON.parse(state.edaNHarmonicsJson) as Record<
            string,
            number
          >;
          if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
          ) {
            throw new Error("Expected JSON object");
          }
          params.n_harmonics = parsed;
        } catch {
          toast.error("n_harmonics must be valid JSON object");
          return { ok: false };
        }
      }
    }
    if (state.edaRoute === "unit-root-tests") {
      params.unit_root_regression = state.edaUnitRootRegression;
      params.include_break_test = state.edaIncludeBreakTest;
    }
    if (state.edaRoute === "seasonal-decompose") {
      params.decompose_period = state.edaDecomposePeriod;
      params.decompose_model = state.edaDecomposeModel;
    }
    if (state.edaRoute === "autocorr") {
      params.acf_lags = state.edaAcfLags;
    }
    if (state.edaRoute === "annotated-timeseries") {
      params.smoothing_method = state.edaSmoothingMethod;
      params.smoothing_window = state.edaSmoothingWindow;
      params.annotated = state.edaAnnotated;
    }
  }

  const selectedGroup = meterGroups.find(
    (group) => group.name === state.meter && group.meters.length > 0,
  );
  if (selectedGroup) {
    params.meters_to_add = { [selectedGroup.name]: selectedGroup.meters };
  }

  return { ok: true, params };
}
