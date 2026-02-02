import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  BaseRequest,
  TimeSeriesResponse,
  SeasonalAnalysisResponse,
  TemperatureAnalysisResponse,
  MeterListResponse,
} from "../types/api";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const useTimeSeries = (
  request: BaseRequest,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [
      "time-series",
      request.start_date,
      request.end_date,
      request.meter,
      request.smoothing_method,
      request.smoothing_window,
      request.cleaning_method,
      request.meters_to_add,
    ],
    queryFn: async () => {
      const params: Record<string, string | number | Record<string, string[]>> = {
        start_date: request.start_date,
        end_date: request.end_date,
        meter: request.meter,
      };

      if (request.smoothing_method) {
        params.smoothing_method = request.smoothing_method;
      }
      if (request.smoothing_window !== undefined) {
        params.smoothing_window = request.smoothing_window;
      }
      if (request.cleaning_method) {
        params.cleaning_method = request.cleaning_method;
      }
      if (request.meters_to_add) {
        // Send as JSON string for complex object
        params.meters_to_add = JSON.stringify(request.meters_to_add);
      }

      const response = await axios.get<TimeSeriesResponse>(
        `${API_URL}/time-series`,
        { params }
      );
      return response.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useSeasonalAnalysis = (
  request: Pick<BaseRequest, "start_date" | "end_date" | "meter">,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [
      "seasonal-analysis",
      request.start_date,
      request.end_date,
      request.meter,
    ],
    queryFn: async () => {
      const response = await axios.get<SeasonalAnalysisResponse>(
        `${API_URL}/seasonal-analysis`,
        {
          params: {
            start_date: request.start_date,
            end_date: request.end_date,
            meter: request.meter,
          },
        }
      );
      return response.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useMeterList = () => {
  return useQuery({
    queryKey: ["meter-list"],
    queryFn: async () => {
      const response = await axios.get<MeterListResponse>(
        `${API_URL}/meter-list`
      );
      return response.data;
    },
  });
};

export const useTemperatureAnalysis = (
  request: Pick<BaseRequest, "start_date" | "end_date" | "meter">,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [
      "temperature-analysis",
      request.start_date,
      request.end_date,
      request.meter,
    ],
    queryFn: async () => {
      const response = await axios.get<TemperatureAnalysisResponse>(
        `${API_URL}/temperature-analysis`,
        {
          params: {
            start_date: request.start_date,
            end_date: request.end_date,
            meter: request.meter,
          },
        }
      );
      return response.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: keepPreviousData,
    ...options,
  });
};
