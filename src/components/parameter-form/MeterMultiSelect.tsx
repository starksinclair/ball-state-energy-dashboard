import { useState } from "react";

export interface MeterMultiSelectProps {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  /** Meter names that render a "(Group)" suffix */
  groupNames?: Set<string>;
  showBulkActions?: boolean;
  emptyMessage?: string;
  maxHeightClass?: string;
}

function toggleMeter(list: string[], meter: string, checked: boolean): string[] {
  if (checked) {
    return list.includes(meter) ? list : [...list, meter];
  }
  return list.filter((m) => m !== meter);
}

export function MeterMultiSelect({
  label,
  hint,
  options,
  selected,
  onChange,
  groupNames,
  showBulkActions = true,
  emptyMessage = "No meters — upload dataset first",
  maxHeightClass = "max-h-48",
}: MeterMultiSelectProps) {
  const [filter, setFilter] = useState("");
  const filterLower = filter.trim().toLowerCase();
  const filteredOptions = filterLower
    ? options.filter((m) => m.toLowerCase().includes(filterLower))
    : options;
  const allSelected =
    options.length > 0 && options.every((m) => selected.includes(m));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {hint && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
              {hint}
            </span>
          )}
        </label>
        {showBulkActions && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange([...options])}
              disabled={options.length === 0}
              className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:border-[#ba0c2f] disabled:opacity-50"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              disabled={options.length === 0}
              className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:border-[#ba0c2f] disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <input
        type="search"
        placeholder="Filter meters…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <div
        className={`${maxHeightClass} overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 space-y-1`}
      >
        {options.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
            {emptyMessage}
          </p>
        ) : filteredOptions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
            No meters match filter
          </p>
        ) : (
          filteredOptions.map((meterName) => (
            <label
              key={meterName}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
            >
              <input
                type="checkbox"
                checked={selected.includes(meterName)}
                onChange={(e) =>
                  onChange(toggleMeter(selected, meterName, e.target.checked))
                }
                className="rounded border-gray-300 text-[#ba0c2f] focus:ring-[#ba0c2f]"
              />
              <span className="truncate">
                {meterName}
                {groupNames?.has(meterName) && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    (Group)
                  </span>
                )}
              </span>
            </label>
          ))
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {selected.length} of {options.length} meters selected
        {!allSelected && options.length > 0 && " (some omitted)"}
      </p>
    </div>
  );
}
