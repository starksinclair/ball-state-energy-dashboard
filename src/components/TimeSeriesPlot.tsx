import { useState, useEffect, useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Brush,
} from "recharts";
import type { BaseRequest } from "../types/api";
import { useTimeSeries } from "../services/api";
import { AxiosError } from "axios";

interface TimeSeriesPlotProps {
  submitParams?: BaseRequest | null;
}

export default function TimeSeriesPlot({ submitParams }: TimeSeriesPlotProps) {
  const [queryParams, setQueryParams] = useState<BaseRequest | null>(null);
  // Update internal state when submitParams changes
  useEffect(() => {
    if (submitParams) {
      setQueryParams(submitParams);
    }
  }, [submitParams]);

  const { data, isLoading, error } = useTimeSeries(
    queryParams || {
      start_date: "",
      end_date: "",
      meter: "",
      smoothing_method: "ma",
      smoothing_window: 7,
      cleaning_method: "None",
    },
    { enabled: !!queryParams }
  );

  const totalMissing = useMemo(() => {
    return (
      data?.missing_counts?.reduce(
        (acc, curr) => acc + curr.number_of_missing,
        0
      ) || 0
    );
  }, [data?.missing_counts]);
  // Create a set of outlier timestamps for quick lookup (must be before early returns)
  // const outlierTimestamps = useMemo(() => {
  //   if (!data?.outliers) return new Set<string>();
  //   return new Set(
  //     data.outliers.map((outlier) =>
  //       new Date(outlier.DateTime).getTime().toString()
  //     )
  //   );
  // }, [data?.outliers]);

  // // Prepare outlier data for scatter plot (must be before early returns)
  // const outlierData = useMemo(() => {
  //   if (!data?.outliers) return [];
  //   return data.outliers.map((outlier) => {
  //     const dateObj = new Date(outlier.DateTime);
  //     return {
  //       date: dateObj.toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       }),
  //       fullDate: dateObj.getTime(),
  //       value: outlier.Value,
  //       DateTime: outlier.DateTime,
  //     };
  //   });
  // }, [data?.outliers]);

  if (!queryParams) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center py-8">
          Please submit the form to view time series data
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ball-state-blue"></div>
          <span className="ml-3 text-lg text-gray-600">
            Loading time series data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof AxiosError
              ? error.response?.data?.detail || error.message
              : "An error occurred loading time series data"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }
  const chartData = data.time_series
    .map((item) => {
      const date = new Date(item.date);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: item.date,
        smoothed: item.smoothed,
        ...Object.fromEntries(
          Object.entries(item).filter(
            ([key, value]) =>
              key !== "date" && key !== "smoothed" && typeof value === "number"
          )
        ),
      };
    })
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );

  const numericKeys = new Set<string>();
  data.time_series.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (
        key !== "date" &&
        key !== "smoothed" &&
        typeof item[key] === "number"
      ) {
        numericKeys.add(key);
      }
    });
  });

  const firstTimestamp = data.time_series[0]?.date || 0;
  const lastTimestamp =
    data.time_series[data.time_series.length - 1]?.date || 0;
  const daysDiff = Math.ceil(
    (new Date(lastTimestamp).getTime() - new Date(firstTimestamp).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const includeYear = daysDiff > 365;

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Mean Consumption
          </h4>
          <p className="text-2xl font-bold text-ball-state-blue">
            {data.statistics.mean.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Data Points
          </h4>
          <p className="text-2xl font-bold text-gray-600">
            {data.statistics.count}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Peak Consumption
          </h4>
          <p className="text-2xl font-bold text-[#ba0c2f]">
            {data.statistics.max.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Min Consumption
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {data.statistics.min.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Data Quality Metrics */}
      {(data.count || data.zero_counts || data.missing_counts) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
            Data Quality Metrics
          </h3>
          <div className="space-y-3">
            {data.count && (
              <div className="flex items-start">
                <span className="font-medium text-gray-700 min-w-[200px]">
                  Outlier Detection:
                </span>
                <p className="text-gray-600">{data.count}</p>
              </div>
            )}
            {data.zero_counts && (
              <div className="flex items-start">
                <span className="font-medium text-gray-700 min-w-[200px]">
                  Zero Values:
                </span>
                {/* <p className="text-gray-600">{data.zero_counts}</p> */}
              </div>
            )}
            {data.missing_counts && (
              <div className="flex items-start">
                <span className="font-medium text-gray-700 min-w-[200px]">
                  Missing Values:
                </span>
                <p className="text-gray-600">{totalMissing}</p>
                {/* {data?.missing_counts &&
                  data?.missing_counts?.map((missing) => (
                    <div key={missing.meter_name}>
                      <p>{missing.meter_name}</p>
                      <p>{missing.number_of_missing}</p>
                      <p>
                        {missing.missing_indices.map((index) =>
                          format(new Date(index), "yyyy-MM-dd HH:mm:ss")
                        )}
                      </p>
                    </div>
                  ))} */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
          Time Series Plot - {data.meter}
        </h3>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" aspect={2}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
                label={{
                  value: includeYear
                    ? "Date (Month Day, Year)"
                    : "Date (Month Day)",
                  angle: -0,
                  position: "insideBottom",
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                width={80}
                label={{
                  value: "Energy Consumption (kWh)",
                  angle: -90,
                  position: "insideBottomLeft",
                  offset: 10,
                }}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
              />
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
                travellerWidth={10}
                alwaysShowText={true}
              />

              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)}`,
                  name === "smoothed" ? "Smoothed" : name,
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="smoothed"
                stroke="#003DA5"
                strokeWidth={2}
                dot={false}
                name="Smoothed"
              />
              {Array.from(numericKeys).map((key, index) => {
                const colors = ["#ba0c2f", "#10b981"];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={1.5}
                    dot={false}
                    name={key}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outliers Table */}
      {data.outliers && data.outliers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
            Detected Outliers ({data.outliers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value (kWh)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deviation from Mean
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.outliers.map((outlier, index) => {
                  const deviation = outlier.Value - data.statistics.mean;
                  const deviationPercent = (
                    (deviation / data.statistics.mean) *
                    100
                  ).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(outlier.DateTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-[#ba0c2f]">
                        {outlier?.Value?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={
                            deviation > 0 ? "text-red-600" : "text-blue-600"
                          }
                        >
                          {deviation > 0 ? "+" : ""}
                          {deviation.toFixed(2)} ({deviationPercent}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Holiday */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
          Holiday
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holiday
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.holiday.map((h) => (
              <tr key={h.name + h.start}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {h.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {h.start}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {h.end}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Date Range Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
          Date Range Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Requested Start:</span>
            <p className="text-gray-600">
              {new Date(data.date_range.start).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Requested End:</span>
            <p className="text-gray-600">
              {new Date(data.date_range.end).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Actual Start:</span>
            <p className="text-gray-600">
              {new Date(data.date_range.actual_start).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Actual End:</span>
            <p className="text-gray-600">
              {new Date(data.date_range.actual_end).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
          Statistical Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">
              Standard Deviation:
            </span>
            <p className="text-gray-600">{data.statistics.std.toFixed(2)}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Median (Q50):</span>
            <p className="text-gray-600">{data.statistics.q50.toFixed(2)}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Meter:</span>
            <p className="text-gray-600">{data.meter}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
