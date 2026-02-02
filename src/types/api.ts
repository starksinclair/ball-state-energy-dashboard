// API Request Types
export interface EnergyPredictionRequest {
  start_date: string;
  end_date: string;
  BreaksWeather: [boolean, boolean, boolean, boolean]; // [holidays, summer_break, in_session, weather]
}

// API Response Types
export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  cloud_cover: number;
}

export interface HolidayData {
  date: string;
  holiday_name: string;
  is_not_holiday: boolean;
}

export interface SummerBreakData {
  date: string;
  is_not_summer_break: boolean;
}

export interface InSessionData {
  date: string;
  in_session: boolean;
}

export interface EnergyPredictionData {
  date: string;
  predicted_consumption: number;
  actual_consumption?: number;
  confidence_interval_lower: number;
  confidence_interval_upper: number;
}

export interface EnergyPredictionResponse {
  predictions: EnergyPredictionData[];
  weather_data: WeatherData[];
  holiday_data: HolidayData[];
  summer_break_data: SummerBreakData[];
  in_session_data: InSessionData[];
  metadata: {
    model_version: string;
    generated_at: string;
    data_points: number;
  };
}

// UI State Types
export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  data: EnergyPredictionResponse | null;
  parameters: EnergyPredictionRequest;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface BaseRequest {
  start_date: string;
  end_date: string;
  meter: string;
  smoothing_method?: "ma" | "hp";
  smoothing_window?: number;
  cleaning_method?: "Prophet" | "Hampel" | "Polynomial" | "None";
  meters_to_add?: Record<string, string[]>; // e.g., {'totalfoundation':['FOUNDATIONAL_SCIENCE-FBPM7','FOUNDATIONAL_SCIENCE-FBPM17']}
}

interface TimeSeriesStatistics {
  mean: number;
  count: number;
  std: number;
  min: number;
  max: number;
  q25: number;
  q50: number;
  q75: number;
}
interface TimeSeriesDateRange {
  start: string;
  end: string;
  actual_start: string;
  actual_end: string;
}
interface TimeSeriesData {
  date: string;
  smoothed: number | null;
  [key: string]: string | number | null;
}
interface Holiday {
  name: string;
  start: string;
  end: string;
}
interface Annotation {
  start: string;
  end: string;
  label: string;
}
interface Outlier {
  DateTime: string;
  Value: number;
}

export interface TimeSeriesResponse {
  success?: boolean;
  meter: string;
  statistics: TimeSeriesStatistics;
  date_range: TimeSeriesDateRange;
  time_series: TimeSeriesData[];
  holiday: Holiday[];
  annotations?: Annotation[];
  count?: string;
  zero_counts?: string | [];
  missing_counts?: MissingCounts[];
  outliers?: Outlier[];
}

export interface MissingCounts {
  meter_name: string;
  number_of_missing: number;
  missing_indices: string[];
}

interface SeasonalAnalysisData extends TimeSeriesStatistics {
  season: string;
  session_status: string;
}
interface TemperatureAnalysisData extends Omit<SeasonalAnalysisData, "season"> {
  temp_bin: string;
}
export interface SeasonalAnalysisResponse {
  meter: string;
  date_range: TimeSeriesDateRange;
  boxplot_data: SeasonalAnalysisData[];
}

export interface TemperatureAnalysisResponse {
  meter: string;
  date_range: TimeSeriesDateRange;
  boxplot_data: TemperatureAnalysisData[];
}
// Plot Types
export type PlotType =
  | "time-series"
  | "forecast"
  | "seasonal-analysis"
  | "temperature-analysis";

export type FormField =
  | "start_date"
  | "end_date"
  | "meter"
  | "smoothing_method"
  | "smoothing_window"
  | "breaks_weather"
  | "cleaning_method";

export interface PlotTypeConfig {
  id: PlotType;
  label: string;
  description: string;
  available: boolean;
  fields: FormField[];
}

export interface MeterListResponse {
  success?: boolean;
  meters: string[];
  time_range: Pick<TimeSeriesDateRange, "start" | "end">;
}
