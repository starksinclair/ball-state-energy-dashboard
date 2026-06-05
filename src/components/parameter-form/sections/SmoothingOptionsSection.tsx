import type { ParameterFormBindings } from "../types";

interface SmoothingOptionsSectionProps {
  form: ParameterFormBindings;
}

export function SmoothingOptionsSection({ form }: SmoothingOptionsSectionProps) {
  return (
    <>
{/* Advanced Options - Collapsible */}
        {(form.shouldShowField("smoothing_method") ||
          form.shouldShowField("smoothing_window")) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => form.setShowAdvanced(!form.showAdvanced)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-gray-400 dark:bg-gray-600 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Smoothing Options
                </h3>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  form.showAdvanced ? "rotate-180" : ""
                }`}
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

            {form.showAdvanced && (
              <div className="space-y-4 pl-10">
                {form.shouldShowField("smoothing_method") && (
                  <div>
                    <label
                      htmlFor="smoothingMethod"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Smoothing Method
                    </label>
                    <select
                      id="smoothingMethod"
                      value={form.smoothingMethod}
                      onChange={(e) =>
                        form.setSmoothingMethod(e.target.value as "ma" | "hp")
                      }
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    >
                      <option value="">None (No smoothing)</option>
                      <option value="ma">Moving Average (MA)</option>
                      <option value="hp">Hodrick-Prescott (HP)</option>
                    </select>
                  </div>
                )}

                {form.shouldShowField("smoothing_window") && form.smoothingMethod === "ma" && (
                  <div>
                    <label
                      htmlFor="smoothingWindow"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Smoothing Window
                      <span className="text-xs text-gray-500 font-normal ml-2">
                        Days (1-30)
                      </span>
                    </label>
                    <input
                      type="number"
                      id="smoothingWindow"
                      value={form.smoothingWindow}
                      onChange={(e) =>
                        form.setSmoothingWindow(parseInt(e.target.value) || 7)
                      }
                      min="1"
                      max="30"
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    />
                  </div>
                )}
                {form.shouldShowField("smoothing_window") && form.smoothingMethod === "hp" && (
                  <div>
                    <label
                      htmlFor="hpLambda"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Smoothing Parameter (lambda, λ)
                      <span className="text-xs text-gray-500 font-normal ml-2">
                        Higher lambda gives a smoother trend
                      </span>
                    </label>
                    <input
                      type="number"
                      id="hpLambda"
                      value={form.hpLambda}
                      onChange={(e) =>
                        form.setHpLambda(parseInt(e.target.value, 10) || 1600)
                      }
                      min="1"
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
    </>
  );
}
