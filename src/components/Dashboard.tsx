import { useState } from "react";
import type { BaseRequest, PlotType } from "../types/api";
import ParameterForm from "./ParameterForm";
import TimeSeriesPlot from "./TimeSeriesPlot";
import SeasonalAnalysisPlot from "./SeasonalAnalysisPlot";
import TemperatureAnalysisPlot from "./TemperatureAnalysisPlot";
import bsuLogo from "../assets/bsu-logo.png";
import { PLOT_TYPES } from "../constants/plotTypes";

export default function Dashboard() {
  const [selectedPlotType, setSelectedPlotType] =
    useState<PlotType>("time-series");
  const [resetFormSignal, setResetFormSignal] = useState(0);
  // Track submitted params per plot type (only for passing to components)
  const [plotSubmitParams, setPlotSubmitParams] = useState<
    Partial<Record<PlotType, BaseRequest | null>>
  >({});

  const handleSubmit = (params: BaseRequest) => {
    // Store the submitted params for the current plot type
    setPlotSubmitParams((prev) => ({
      ...prev,
      [selectedPlotType]: params,
    }));
  };

  const switchPlotType = (plotType: PlotType) => {
    // If switching to a plot type with no cached params, reset the form
    if (!plotSubmitParams[plotType]) {
      setResetFormSignal((prev) => prev + 1);
    }
    setSelectedPlotType(plotType);
  };

  // Get the submit params for the currently active plot
  const activeSubmitParams = plotSubmitParams[selectedPlotType] ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-[#ba0c2f]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <img
              src={bsuLogo}
              alt="Ball State University"
              className="w-25 h-25"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#ba0c2f]">
                Modeling and Analysis Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Modeling and analysis of Ball State University energy
                consumption data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Model: v1.0.0</div>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-[#003DA5] mb-4">
          Select Plot Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLOT_TYPES.map((plotType) => (
            <button
              key={plotType.id}
              onClick={() => switchPlotType(plotType.id)}
              disabled={!plotType.available}
              className={`
                  p-2 rounded-lg border-2 transition-all text-left
                  ${
                    selectedPlotType === plotType.id
                      ? "border-[#003DA5] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                  ${
                    !plotType.available
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-md"
                  }
                `}
            >
              <h3
                className={`font-semibold mb-1 ${
                  selectedPlotType === plotType.id
                    ? "text-[#003DA5]"
                    : "text-gray-700"
                }`}
              >
                {plotType.label}
              </h3>
              <p className="text-sm text-gray-500">{plotType.description}</p>
              {!plotType.available && (
                <span className="text-xs text-gray-400 mt-2 block">
                  Coming soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ParameterForm
          onSubmit={handleSubmit}
          isLoading={false}
          resetSignal={resetFormSignal}
          initialValues={activeSubmitParams}
          selectedPlotType={selectedPlotType}
        />

        {/* Time Series Plot Display */}
        {selectedPlotType === "time-series" && (
          <TimeSeriesPlot submitParams={activeSubmitParams} />
        )}

        {/* Seasonal Analysis Plot Display */}
        {selectedPlotType === "seasonal-analysis" && (
          <SeasonalAnalysisPlot submitParams={activeSubmitParams} />
        )}

        {/* Temperature Analysis Plot Display */}
        {selectedPlotType === "temperature-analysis" && (
          <TemperatureAnalysisPlot submitParams={activeSubmitParams} />
        )}

        {/* Other plot types */}
        {selectedPlotType === "forecast" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500">Forecast plot coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
