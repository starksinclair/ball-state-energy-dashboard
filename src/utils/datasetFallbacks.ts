import axios from "axios";
import type { DatasetInfoResponse, MeterListResponse } from "../types/api";

export const EMPTY_METER_LIST: MeterListResponse = {
  meters: [],
  time_range: { start: "", end: "" },
};

export const EMPTY_DATASET_INFO: DatasetInfoResponse = {
  meters: [],
  time_range: { start: "", end: "" },
  holiday_keys: [],
  meter_count: 0,
};

export function isMeterListResponse(data: unknown): data is MeterListResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "meters" in data &&
    Array.isArray((data as MeterListResponse).meters)
  );
}

export function isDatasetInfoResponse(
  data: unknown,
): data is DatasetInfoResponse {
  return isMeterListResponse(data) && "holiday_keys" in data;
}

/** User-facing message when no dataset is loaded (404 / missing CSV). */
export function getDatasetMissingMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (error.response?.status === 404) {
    return "No dataset loaded. Upload energy CSV and holiday JSON above.";
  }
  return null;
}
