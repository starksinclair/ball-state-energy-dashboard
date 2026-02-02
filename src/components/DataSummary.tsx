import type { EnergyPredictionResponse } from "../types/api";

interface DataSummaryProps {
  data: EnergyPredictionResponse;
}

export default function DataSummary({ data }: DataSummaryProps) {
  const predictions = data.predictions;
  const avgPredicted =
    predictions.reduce((sum, p) => sum + p.predicted_consumption, 0) /
    predictions.length;
  const avgActual =
    predictions.reduce((sum, p) => sum + (p.actual_consumption || 0), 0) /
    predictions.length;
  const maxPredicted = Math.max(
    ...predictions.map((p) => p.predicted_consumption)
  );

  const weatherData = data.weather_data;
  const avgTemp =
    weatherData.length > 0
      ? weatherData.reduce((sum, w) => sum + (w.temperature * 1.8 + 32), 0) /
        weatherData.length
      : 0;
  const avgHumidity =
    weatherData.length > 0
      ? weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length
      : 0;

  const holidayCount = data.holiday_data.filter(
    (h) => !h.is_not_holiday
  ).length;
  const inSessionDays = data.in_session_data.filter((s) => s.in_session).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Avg Predicted Consumption
        </h4>
        <p className="text-2xl font-bold text-ball-state-blue">
          {avgPredicted.toLocaleString()} kWh
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Avg Actual Consumption
        </h4>
        <p className="text-2xl font-bold text-ball-state-red">
          {avgActual.toLocaleString()} kWh
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Peak Consumption
        </h4>
        <p className="text-2xl font-bold text-orange-600">
          {maxPredicted.toLocaleString()} kWh
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Data Points
        </h4>
        <p className="text-2xl font-bold text-gray-600">
          {data.metadata.data_points}
        </p>
      </div>

      {weatherData.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Avg Temperature
            </h4>
            <p className="text-2xl font-bold text-red-600">
              {avgTemp.toFixed(1)}°F
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Avg Humidity
            </h4>
            <p className="text-2xl font-bold text-blue-600">
              {avgHumidity.toFixed(1)}%
            </p>
          </div>
        </>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Holidays
        </h4>
        <p className="text-2xl font-bold text-purple-600">{holidayCount}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          In-Session Days
        </h4>
        <p className="text-2xl font-bold text-green-600">{inSessionDays}</p>
      </div>
    </div>
  );
}
