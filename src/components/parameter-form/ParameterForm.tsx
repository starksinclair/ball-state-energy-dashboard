import type { BaseRequest, PlotType } from "../../types/api";
import { useMeterList } from "../../services/api";
import { useParameterForm } from "../../hooks/useParameterForm";
import { buildBaseRequest } from "../../utils/parameter-form/buildBaseRequest";
import { ParameterFormHeader } from "./ParameterFormHeader";
import { EdaRouteSelector } from "./sections/EdaRouteSelector";
import { EssentialParametersSection } from "./sections/EssentialParametersSection";
import { EdaOptionsSection } from "./sections/EdaOptionsSection";
import { ForecastOptionsSection } from "./sections/ForecastOptionsSection";
import { SmoothingOptionsSection } from "./sections/SmoothingOptionsSection";
import { MeterGroupsSection } from "./sections/MeterGroupsSection";

interface ParameterFormProps {
  onSubmit: (params: BaseRequest) => void;
  isLoading: boolean;
  resetSignal: number;
  selectedPlotType?: PlotType;
  initialValues?: BaseRequest | null;
}

export default function ParameterForm({
  onSubmit,
  isLoading,
  resetSignal,
  selectedPlotType = "time-series",
  initialValues,
}: ParameterFormProps) {
  const { data: meterList, isFetched: meterListFetched } = useMeterList();
  const datasetReady = (meterList?.meters.length ?? 0) > 0;
  const form = useParameterForm({
    resetSignal,
    initialValues,
    selectedPlotType,
    meterList,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = buildBaseRequest({
      state: form,
      selectedPlotType,
      shouldShowField: form.shouldShowField,
      meterGroups: form.meterGroups,
    });
    if (result.ok) {
      onSubmit(result.params);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors">
      <ParameterFormHeader />

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {meterListFetched && !datasetReady && (
          <div
            role="alert"
            className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
          >
            No energy dataset is loaded. Expand <strong>Dataset</strong> above and
            upload your CSV and holiday JSON before running analysis.
          </div>
        )}

        {selectedPlotType === "eda-plots" && (
          <EdaRouteSelector form={form} />
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-[#ba0c2f] rounded" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Essential Parameters
            </h3>
          </div>

          <EssentialParametersSection form={form} />
          <EdaOptionsSection form={form} />
          <ForecastOptionsSection form={form} />
        </div>

        <SmoothingOptionsSection form={form} />
        <MeterGroupsSection form={form} />

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isLoading || (meterListFetched && !datasetReady)}
            className="w-full px-6 py-3 text-base font-semibold bg-[#ba0c2f] text-white rounded-lg hover:bg-[#9a0a26] focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Analysis...
              </span>
            ) : (
              "Generate Analysis"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
