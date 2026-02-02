// import {
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";
// import type { EnergyPredictionData } from "../types/api";

// interface EnergyChartProps {
//   data: EnergyPredictionData[];
//   title: string;
// }

// export default function EnergyChart({ data, title }: EnergyChartProps) {
//   // Determine if we need to include year based on date range
//   const firstDate = new Date(data[0]?.date);
//   const lastDate = new Date(data[data.length - 1]?.date);
//   const daysDiff = Math.ceil(
//     (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
//   );
//   const includeYear = daysDiff > 365; // Include year if range is more than 1 year

//   const chartData = data
//     .map((item) => ({
//       date: new Date(item.date).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         ...(includeYear && { year: "2-digit" }),
//       }),
//       fullDate: item.date, // Keep full date for sorting
//       predicted: item.predicted_consumption,
//       actual: item.actual_consumption,
//       lowerBound: item.confidence_interval_lower,
//       upperBound: item.confidence_interval_upper,
//     }))
//     .sort(
//       (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
//     ); // Sort chronologically

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold text-ball-state-blue mb-4">
//         {title}
//       </h3>
//       <div className="h-full w-full">
//         <ResponsiveContainer width="100%" height={500}>
//           <AreaChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tick={{ fontSize: 12 }}
//               angle={-45}
//               textAnchor="end"
//               label={{
//                 value: includeYear
//                   ? "Date (Month Day, Year)"
//                   : "Date (Month Day)",
//                 angle: -0,
//                 position: "insideBottom",
//               }}
//               interval={"preserveStartEnd"}
//               height={80}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               label={{
//                 value: "Energy Consumption (kWh)",
//                 angle: -90,
//                 position: "insideBottomLeft",
//                 offset: 10,
//               }}
//             />
//             <Tooltip
//               formatter={(value: number, name: string) => [
//                 `${value.toLocaleString()} kWh`,
//                 name === "predicted"
//                   ? "Predicted"
//                   : name === "actual"
//                     ? "Actual"
//                     : name === "lowerBound"
//                       ? "Lower Bound"
//                       : "Upper Bound",
//               ]}
//               labelFormatter={(label) => `Date: ${label}`}
//             />
//             <Legend />
//             <Area
//               type="monotone"
//               dataKey="upperBound"
//               stackId="1"
//               stroke="none"
//               fill="#e5e7eb"
//               name="Confidence Interval"
//             />
//             <Area
//               type="monotone"
//               dataKey="lowerBound"
//               stackId="1"
//               stroke="none"
//               fill="#e5e7eb"
//             />
//             <Line
//               type="monotone"
//               dataKey="predicted"
//               stroke="#003DA5"
//               strokeWidth={2}
//               dot={{ fill: "#003DA5", strokeWidth: 2, r: 4 }}
//               name="Predicted"
//             />
//             <Line
//               type="monotone"
//               dataKey="actual"
//               stroke="#ba0c2f"
//               strokeWidth={2}
//               dot={{ fill: "#ba0c2f", strokeWidth: 2, r: 4 }}
//               name="Actual"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
export const boxplotData = [
  // EarlyWinter
  {
    x: 1,
    min: 41.336,
    q1: 49.455,
    median: 61.335,
    q3: 77.492,
    max: 95.45,
    season: "EarlyWinter",
    status: "In Session",
  },
  {
    x: 1.5,
    min: 34.322,
    q1: 45.37,
    median: 47.215,
    q3: 51.2,
    max: 86.59,
    season: "EarlyWinter",
    status: "Not in Session",
  },
  // LateWinter
  {
    x: 2,
    min: 41.336,
    q1: 49.455,
    median: 61.335,
    q3: 77.492,
    max: 95.45,
    season: "LateWinter",
    status: "In Session",
  },
  {
    x: 2.5,
    min: 34.322,
    q1: 45.37,
    median: 47.215,
    q3: 51.2,
    max: 86.59,
    season: "LateWinter",
    status: "Not in Session",
  },
  // EarlySpring
  {
    x: 3,
    min: 41.336,
    q1: 49.455,
    median: 61.335,
    q3: 77.492,
    max: 95.45,
    season: "EarlySpring",
    status: "In Session",
  },
  {
    x: 3.5,
    min: 34.322,
    q1: 45.37,
    median: 47.215,
    q3: 51.2,
    max: 86.59,
    season: "EarlySpring",
    status: "Not in Session",
  },
  // LateSpring
  {
    x: 4,
    min: 38.534,
    q1: 53.935,
    median: 61.087,
    q3: 77.53,
    max: 102.753,
    season: "LateSpring",
    status: "In Session",
  },
  {
    x: 4.5,
    min: 39.057,
    q1: 51.69,
    median: 53.96,
    q3: 56.932,
    max: 85.26,
    season: "LateSpring",
    status: "Not in Session",
  },
  // Summer
  {
    x: 5,
    min: 36.736,
    q1: 47.915,
    median: 54.23,
    q3: 65.46,
    max: 99.03,
    season: "Summer",
    status: "In Session",
  },
  {
    x: 5.5,
    min: 33.73,
    q1: 46.615,
    median: 49.83,
    q3: 53.617,
    max: 88.87,
    season: "Summer",
    status: "Not in Session",
  },
  // EarlyFall
  {
    x: 6,
    min: 38.534,
    q1: 53.935,
    median: 61.087,
    q3: 77.53,
    max: 102.753,
    season: "EarlyFall",
    status: "In Session",
  },
  {
    x: 6.5,
    min: 39.057,
    q1: 51.69,
    median: 53.96,
    q3: 56.932,
    max: 85.26,
    season: "EarlyFall",
    status: "Not in Session",
  },
  // LateFall
  {
    x: 7,
    min: 35.39,
    q1: 51.015,
    median: 59.395,
    q3: 75.587,
    max: 114.24,
    season: "LateFall",
    status: "In Session",
  },
  {
    x: 7.5,
    min: 35.449,
    q1: 47.842,
    median: 50.863,
    q3: 54.253,
    max: 89.036,
    season: "LateFall",
    status: "Not in Session",
  },
];
import {
  VictoryChart,
  VictoryBoxPlot,
  VictoryAxis,
  VictoryLabel,
  VictoryLegend,
} from "victory";

const EnergyUsageBoxplot = () => {
  // Transform the data for Victory

  const seasons = [
    "EarlyWinter",
    "LateWinter",
    "EarlySpring",
    "LateSpring",
    "Summer",
    "EarlyFall",
    "LateFall",
  ];

  // Calculate the actual min and max from the data
  const allValues = boxplotData.flatMap((d) => [d.min, d.max]);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const padding = (dataMax - dataMin) * 0.1; // 10% padding
  const yDomain = [Math.max(0, dataMin - padding), dataMax + padding];

  // Debug: log the domain to verify it's correct
  // console.log(
  //   "Box plot domain:",
  //   yDomain,
  //   "Data range:",
  //   dataMin,
  //   "-",
  //   dataMax
  // );

  return (
    <div className="w-full h-full bg-gray-900 p-6 flex items-center justify-center">
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <VictoryChart
          width={1000}
          height={600}
          padding={{ top: 80, bottom: 80, left: 90, right: 60 }}
          // domain={{ y: yDomain }}
          style={{
            background: { fill: "#2d2d2d" },
            parent: { background: "#2d2d2d" },
          }}
        >
          {/* Title */}
          <VictoryLabel
            text="Energy Usage by Season and Session Status"
            x={500}
            y={30}
            textAnchor="middle"
            style={{
              fontSize: 20,
              fill: "#cccccc",
              fontFamily: "sans-serif",
            }}
          />

          {/* Y Axis */}
          <VictoryAxis
            dependentAxis
            label="Energy Usage"
            style={{
              axis: { stroke: "#666666" },
              axisLabel: {
                fontSize: 14,
                fill: "#cccccc",
                padding: 50,
              },
              tickLabels: {
                fontSize: 12,
                fill: "#cccccc",
                padding: 5,
              },
              grid: { stroke: "none" },
            }}
          />

          {/* X Axis */}
          <VictoryAxis
            tickValues={[1.25, 2.25, 3.25, 4.25, 5.25, 6.25, 7.25]}
            tickFormat={seasons}
            style={{
              axis: { stroke: "#666666" },
              tickLabels: {
                fontSize: 13,
                fill: "#cccccc",
                padding: 8,
              },
              grid: { stroke: "none" },
            }}
          />

          {/* In Session Boxplots */}
          <VictoryBoxPlot
            data={boxplotData.filter((d) => d.status === "In Session")}
            x="x"
            min="min"
            q1="q1"
            median="median"
            q3="q3"
            max="max"
            boxWidth={15}
            whiskerWidth={10}
            style={{
              min: { stroke: "#999999", strokeWidth: 1 },
              max: { stroke: "#999999", strokeWidth: 1 },
              q1: { fill: "#7a9b8e", stroke: "#333333", strokeWidth: 1 },
              q3: { fill: "#7a9b8e", stroke: "#333333", strokeWidth: 1 },
              median: { stroke: "#333333", strokeWidth: 2 },
              minLabels: { fill: "none" },
              maxLabels: { fill: "none" },
            }}
          />

          {/* Not in Session Boxplots */}
          <VictoryBoxPlot
            data={boxplotData.filter((d) => d.status === "Not in Session")}
            x="x"
            min="min"
            q1="q1"
            median="median"
            q3="q3"
            max="max"
            boxWidth={15}
            whiskerWidth={10}
            style={{
              min: { stroke: "#999999", strokeWidth: 1 },
              max: { stroke: "#999999", strokeWidth: 1 },
              q1: { fill: "#a67c6d", stroke: "#333333", strokeWidth: 1 },
              q3: { fill: "#a67c6d", stroke: "#333333", strokeWidth: 1 },
              median: { stroke: "#333333", strokeWidth: 2 },
              minLabels: { fill: "none" },
              maxLabels: { fill: "none" },
            }}
          />

          {/* Legend */}
          <VictoryLegend
            x={820}
            y={60}
            orientation="vertical"
            gutter={20}
            style={{
              labels: { fontSize: 13, fill: "#cccccc" },
            }}
            data={[
              {
                name: "In Session",
                symbol: { fill: "#7a9b8e", stroke: "#333333", strokeWidth: 1 },
              },
              {
                name: "Not in Session",
                symbol: { fill: "#a67c6d", stroke: "#333333", strokeWidth: 1 },
              },
            ]}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default EnergyUsageBoxplot;
