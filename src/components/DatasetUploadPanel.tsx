import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDatasetInfo, useDatasetUpload } from "../services/api";
import axios from "axios";

const MAX_CSV_BYTES = 100 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateRange(start?: string, end?: string): string {
  if (!start || !end) return "—";
  const s = new Date(start).toLocaleDateString();
  const e = new Date(end).toLocaleDateString();
  return `${s} — ${e}`;
}

export default function DatasetUploadPanel() {
  const [expanded, setExpanded] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const { data: datasetInfo, isLoading: infoLoading, isFetched } =
    useDatasetInfo();
  const hasDataset = (datasetInfo?.meters.length ?? 0) > 0;
  const upload = useDatasetUpload();

  const handleCsvChange = (file: File | null) => {
    if (!file) {
      setCsvFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Energy file must be a .csv");
      return;
    }
    if (file.size > MAX_CSV_BYTES) {
      toast.error(`CSV must be under ${formatBytes(MAX_CSV_BYTES)}`);
      return;
    }
    setCsvFile(file);
  };

  const handleJsonChange = (file: File | null) => {
    if (!file) {
      setJsonFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("Holiday file must be a .json");
      return;
    }
    setJsonFile(file);
  };

  const handleUpload = async () => {
    if (!csvFile || !jsonFile) {
      toast.error("Select both the energy CSV and holiday JSON files");
      return;
    }
    try {
      const result = await upload.mutateAsync({
        energyCsv: csvFile,
        holidayJson: jsonFile,
      });
      toast.success(result.message ?? "Dataset uploaded successfully");
      setCsvFile(null);
      setJsonFile(null);
      if (csvInputRef.current) csvInputRef.current.value = "";
      if (jsonInputRef.current) jsonInputRef.current.value = "";
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "Upload failed";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 transition-colors border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="h-1 w-8 bg-[#ba0c2f] rounded" />
          <div>
            <h2 className="text-lg font-semibold text-[#ba0c2f] dark:text-blue-400">
              Dataset
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {infoLoading
                ? "Loading dataset info…"
                : hasDataset
                  ? `${datasetInfo!.meters.length} meters · ${formatDateRange(
                      datasetInfo!.time_range?.start,
                      datasetInfo!.time_range?.end,
                    )}`
                  : isFetched
                    ? "No dataset loaded — upload CSV + JSON"
                    : "Upload energy CSV + holiday JSON"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-200 dark:border-gray-700 pt-4">
          {!hasDataset && isFetched && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-900 dark:text-amber-200">
              Default CSV not found. Upload <strong>All_AptMeters.csv</strong> and{" "}
              <strong>HOLIDAYDICT.json</strong> to enable meters and analysis.
            </div>
          )}

          {hasDataset && datasetInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">Meters</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {datasetInfo.meters.length}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 sm:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Time range</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {formatDateRange(
                    datasetInfo.time_range?.start,
                    datasetInfo.time_range?.end,
                  )}
                </p>
              </div>
              {(datasetInfo.holiday_keys?.length ?? 0) > 0 && (
                <div className="sm:col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Holidays ({datasetInfo.holiday_keys!.length})
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 break-words">
                    {datasetInfo.holiday_keys!.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload replaces the single active dataset used by all analytics
            endpoints. Both files are required.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="energyCsv"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Energy CSV
                <span className="text-xs font-normal text-gray-500 ml-2">
                  e.g. All_AptMeters.csv
                </span>
              </label>
              <input
                ref={csvInputRef}
                id="energyCsv"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) =>
                  handleCsvChange(e.target.files?.[0] ?? null)
                }
                className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ba0c2f] file:text-white hover:file:bg-[#002d7a]"
              />
              {csvFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {csvFile.name} ({formatBytes(csvFile.size)})
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                First column must be <code>Date / Time</code>; remaining columns
                are meter names. Max {formatBytes(MAX_CSV_BYTES)}.
              </p>
            </div>

            <div>
              <label
                htmlFor="holidayJson"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Holiday JSON
                <span className="text-xs font-normal text-gray-500 ml-2">
                  e.g. HOLIDAYDICT.json
                </span>
              </label>
              <input
                ref={jsonInputRef}
                id="holidayJson"
                type="file"
                accept=".json,application/json"
                onChange={(e) =>
                  handleJsonChange(e.target.files?.[0] ?? null)
                }
                className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ba0c2f] file:text-white hover:file:bg-[#9a0a26]"
              />
              {jsonFile && (
                <p className="text-xs text-gray-500 mt-1">{jsonFile.name}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Top-level object; each holiday has 6 dates (3 start/end pairs).
                <code className="ml-1">Summer Break</code> must be the last key.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!csvFile || !jsonFile || upload.isPending}
            className="px-5 py-2.5 text-sm font-semibold bg-[#ba0c2f] text-white rounded-lg hover:bg-[#9a0a26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {upload.isPending ? "Uploading…" : "Upload dataset"}
          </button>
        </div>
      )}
    </div>
  );
}
