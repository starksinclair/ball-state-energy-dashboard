import { useState } from "react";
import type { BaseRequest, PlotType } from "../types/api";
import ParameterForm from "./ParameterForm";
import TimeSeriesPlot from "./TimeSeriesPlot";
import SeasonalAnalysisPlot from "./SeasonalAnalysisPlot";
import TemperatureAnalysisPlot from "./TemperatureAnalysisPlot";
import ChatbotWidget from "./ChatbotWidget";
import DatasetUploadPanel from "./DatasetUploadPanel";
import EdaPlotsPanel from "./EdaPlotsPanel";
import bsuLogo from "../assets/bsu-logo.png";
import { PLOT_TYPES } from "../constants/plotTypes";
import { useDarkMode } from "../hooks/use-darkmode";

export default function Dashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-[#ba0c2f] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img
              src={bsuLogo}
              alt="Ball State University"
              className="w-25 h-25"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#ba0c2f] dark:text-red-400">
                Modeling and Analysis Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Modeling and analysis of Ball State University energy
                consumption data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">Model: v1.0.0</div>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-0 z-10 transition-colors">
        <h2 className="text-xl font-semibold text-[#003DA5] dark:text-blue-400 mb-4">
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
                      ? "border-[#003DA5] dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                    ? "text-[#003DA5] dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {plotType.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{plotType.description}</p>
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
        <DatasetUploadPanel />

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

        {/* EDA Plots Display */}
        {selectedPlotType === "eda-plots" && (
          <EdaPlotsPanel submitParams={activeSubmitParams} />
        )}

      </main>
      <ChatbotWidget />
    </div>
  );
}
