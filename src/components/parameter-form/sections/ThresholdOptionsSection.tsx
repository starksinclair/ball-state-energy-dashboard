import { MeterMultiSelect } from "../MeterMultiSelect";
import type { ParameterFormBindings } from "../types";

interface ThresholdOptionsSectionProps {
  form: ParameterFormBindings;
}

export function ThresholdOptionsSection({ form }: ThresholdOptionsSectionProps) {
  if (form.selectedPlotType !== "threshold-detection") return null;

  const rpcaMeters = form.allMeters;
  const groupNames = new Set(
    form.meterGroups
      .filter((group) => group.name && group.meters.length > 0)
      .map((group) => group.name),
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 space-y-4">
      <p className="text-xs font-medium text-[#003DA5] dark:text-blue-400 uppercase tracking-wide">
        Threshold Detection Options
      </p>

      <div>
        <label
          htmlFor="thresholdMode"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Threshold Mode
        </label>
        <select
          id="thresholdMode"
          value={form.thresholdMode}
          onChange={(e) =>
            form.setThresholdMode(e.target.value as "rpca" | "fixed")
          }
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="rpca">RPCA — auto-recommend threshold</option>
          <option value="fixed">Fixed — use explicit threshold</option>
        </select>
      </div>

      {form.thresholdMode === "fixed" && (
        <div>
          <label
            htmlFor="threshold"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Threshold
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
              Required for fixed mode
            </span>
          </label>
          <input
            id="threshold"
            type="number"
            min={0}
            step="any"
            value={form.threshold}
            onChange={(e) => form.setThreshold(e.target.value)}
            required={form.thresholdMode === "fixed"}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Analysis Window
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="analysisWindowStart"
              className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
            >
              Start
            </label>
            <input
              type="date"
              id="analysisWindowStart"
              value={form.analysisWindowStart}
              onChange={(e) => form.setAnalysisWindowStart(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="analysisWindowEnd"
              className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5"
            >
              End
            </label>
            <input
              type="date"
              id="analysisWindowEnd"
              value={form.analysisWindowEnd}
              onChange={(e) => form.setAnalysisWindowEnd(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <MeterMultiSelect
        label="RPCA Meters"
        hint="All included by default — uncheck to omit"
        options={rpcaMeters}
        selected={form.includedMeters}
        onChange={form.setIncludedMeters}
        groupNames={groupNames}
      />

      <button
        type="button"
        onClick={() => form.setShowThresholdAdvanced((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-[#003DA5] dark:text-blue-400 hover:underline"
      >
        <svg
          className={`w-4 h-4 transition-transform ${form.showThresholdAdvanced ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        Advanced options
      </button>

      {form.showThresholdAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contribution Window
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={form.contributionWindowStart}
                onChange={(e) =>
                  form.setContributionWindowStart(e.target.value)
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="date"
                value={form.contributionWindowEnd}
                onChange={(e) => form.setContributionWindowEnd(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plot Window
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={form.plotWindowStart}
                onChange={(e) => form.setPlotWindowStart(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="date"
                value={form.plotWindowEnd}
                onChange={(e) => form.setPlotWindowEnd(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <MeterMultiSelect
            label="Series Meters"
            hint="Extra meters on stacked series plot"
            options={rpcaMeters}
            selected={form.seriesMeters}
            onChange={form.setSeriesMeters}
            groupNames={groupNames}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contributions top N
              </label>
              <input
                type="number"
                min={1}
                value={form.contributionsTopN}
                onChange={(e) =>
                  form.setContributionsTopN(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event contributions top N
              </label>
              <input
                type="number"
                min={1}
                value={form.eventContributionsTopN}
                onChange={(e) =>
                  form.setEventContributionsTopN(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contributions method
              </label>
              <select
                value={form.contributionsMethod}
                onChange={(e) =>
                  form.setContributionsMethod(
                    e.target.value as "sparse" | "raw",
                  )
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="sparse">sparse</option>
                <option value="raw">raw</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heatmap top N rows
              </label>
              <input
                type="number"
                min={1}
                value={form.heatmapTopN}
                onChange={(e) =>
                  form.setHeatmapTopN(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={form.heatmapNormalize}
                onChange={(e) => form.setHeatmapNormalize(e.target.checked)}
                className="rounded border-gray-300 text-[#ba0c2f] focus:ring-[#ba0c2f]"
              />
              Row-normalize heatmap
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={form.cleanAllMeters}
                onChange={(e) => form.setCleanAllMeters(e.target.checked)}
                className="rounded border-gray-300 text-[#ba0c2f] focus:ring-[#ba0c2f]"
              />
              <span>
                Clean all meters
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
                  Cleans all selected RPCA meters, or every numeric column if
                  none selected
                </span>
              </span>
            </label>
          </div>

          {form.thresholdMode === "rpca" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  n_thresholds
                </label>
                <input
                  type="number"
                  min={2}
                  value={form.nThresholds}
                  onChange={(e) =>
                    form.setNThresholds(
                      Math.max(2, parseInt(e.target.value, 10) || 80),
                    )
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RPCA max iterations
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.rpcaMaxIter}
                  onChange={(e) =>
                    form.setRpcaMaxIter(
                      Math.max(1, parseInt(e.target.value, 10) || 5000),
                    )
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Threshold min (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.thresholdMin}
                  onChange={(e) => form.setThresholdMin(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Threshold max (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.thresholdMax}
                  onChange={(e) => form.setThresholdMax(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RPCA tolerance
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.rpcaTol}
                  onChange={(e) =>
                    form.setRpcaTol(parseFloat(e.target.value) || 1e-6)
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
