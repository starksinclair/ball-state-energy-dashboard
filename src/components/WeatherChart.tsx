import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import type { WeatherData } from "../types/api";

interface WeatherChartProps {
  data: WeatherData[];
  title: string;
}

export default function WeatherChart({ data, title }: WeatherChartProps) {
  // Determine if we need to include year based on date range
  const firstDate = new Date(data[0]?.date);
  const lastDate = new Date(data[data.length - 1]?.date);
  const daysDiff = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const includeYear = daysDiff > 365; // Include year if range is more than 1 year

  const chartData = data
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(includeYear && { year: "2-digit" }),
      }),
      fullDate: item.date, // Keep full date for sorting
      temperature: item.temperature,
      humidity: item.humidity,
      windSpeed: item.wind_speed,
      precipitation: item.precipitation,
      cloudCover: item.cloud_cover,
    }))
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    ); // Sort chronologically

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
        {title}
      </h3>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{
                value: "Humidity (%)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const unit =
                  name === "temperature"
                    ? "°C"
                    : name === "humidity"
                      ? "%"
                      : name === "windSpeed"
                        ? "m/s"
                        : name === "precipitation"
                          ? "mm"
                          : "%";
                return [
                  `${value}${unit}`,
                  name === "temperature"
                    ? "Temperature"
                    : name === "humidity"
                      ? "Humidity"
                      : name === "windSpeed"
                        ? "Wind Speed"
                        : name === "precipitation"
                          ? "Precipitation"
                          : "Cloud Cover",
                ];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#ba0c2f"
              strokeWidth={2}
              dot={{ fill: "#ba0c2f", strokeWidth: 2, r: 4 }}
              name="Temperature"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#003DA5"
              strokeWidth={2}
              dot={{ fill: "#003DA5", strokeWidth: 2, r: 4 }}
              name="Humidity"
            />
            <Bar
              yAxisId="right"
              dataKey="precipitation"
              fill="#6B7280"
              name="Precipitation"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
