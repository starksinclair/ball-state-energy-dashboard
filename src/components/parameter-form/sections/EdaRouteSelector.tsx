import type { EdaRoute } from "../../../types/api";
import { EDA_ROUTE_OPTIONS } from "../../../constants/edaDefaults";
import type { ParameterFormBindings } from "../types";

interface EdaRouteSelectorProps {
  form: ParameterFormBindings;
}

export function EdaRouteSelector({ form }: EdaRouteSelectorProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <label
        htmlFor="edaRoute"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        EDA Analysis Type
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
          Select the exploratory analysis to run
        </span>
      </label>
      <select
        id="edaRoute"
        value={form.edaRoute}
        onChange={(e) => form.setEdaRoute(e.target.value as EdaRoute)}
        className="w-full px-3 py-2.5 text-sm border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
      >
        {EDA_ROUTE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
