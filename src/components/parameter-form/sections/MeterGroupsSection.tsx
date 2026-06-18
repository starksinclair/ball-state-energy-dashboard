import { MeterMultiSelect } from "../MeterMultiSelect";
import type { ParameterFormBindings } from "../types";

interface MeterGroupsSectionProps {
  form: ParameterFormBindings;
}

export function MeterGroupsSection({ form }: MeterGroupsSectionProps) {
  return (
    <>
{/* Meter Groups - Collapsible */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => form.setShowMeterGroups(!form.showMeterGroups)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Meter Groups
              </h3>
              {form.meterGroups.filter((g) => g.name && g.meters.length > 0).length >
                0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#ba0c2f] text-white rounded-full">
                  {form.meterGroups.filter((g) => g.name && g.meters.length > 0)
                    .length}
                </span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                form.showMeterGroups ? "rotate-180" : ""
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

          {form.showMeterGroups && (
            <div className="space-y-4 pl-10">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
                <p className="text-sm text-red-900 dark:text-red-300 mb-2">
                  <strong>Create form.meter groups</strong> to sum multiple meters
                  together. Saved groups will appear in the Meter dropdown
                  above.
                </p>
              </div>

              {/* Saved Groups */}
              {form.meterGroups
                .filter(
                  (group) =>
                    group.name &&
                    group.meters.length > 0 &&
                    form.editingGroupId !== group.id
                )
                .map((group) => (
                  <div
                    key={group.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {group.name}
                          </h4>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            {group.meters.length} form.meter
                            {group.meters.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.meters.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded border border-red-200"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button
                          type="button"
                          onClick={() => form.editMeterGroup(group.id)}
                          className="p-1.5 text-[#ba0c2f] hover:bg-red-50 rounded transition-colors"
                          title="Edit group"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => form.removeMeterGroup(group.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove group"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Add New Group Button */}
              {form.editingGroupId === null && (
                <button
                  type="button"
                  onClick={form.addMeterGroup}
                  className="w-full px-4 py-3 text-sm font-medium text-[#ba0c2f] dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Meter Group
                </button>
              )}

              {/* Editing Form */}
              {form.meterGroups
                .filter((group) => form.editingGroupId === group.id)
                .map((group) => (
                  <div
                    key={group.id}
                    className="bg-gray-50 dark:bg-gray-700/50 border-2 border-[#ba0c2f] dark:border-red-500 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        {group.name ? `Editing: ${group.name}` : "New Group"}
                      </h4>
                      <button
                        type="button"
                        onClick={form.cancelEdit}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor={`group-name-${group.id}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        >
                          Group Name
                        </label>
                        <input
                          type="text"
                          id={`group-name-${group.id}`}
                          value={group.name}
                          onChange={(e) =>
                            form.updateMeterGroupName(group.id, e.target.value)
                          }
                          placeholder="e.g., totalfoundation"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba0c2f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <MeterMultiSelect
                        label="Select Meters"
                        hint="Choose meters to sum into this group"
                        options={form.meterList?.meters ?? []}
                        selected={group.meters}
                        onChange={(meters) =>
                          form.updateMeterGroupMeters(group.id, meters)
                        }
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => form.saveMeterGroup(group.id)}
                          disabled={
                            !group.name.trim() ||
                            group.meters.length === 0 ||
                            form.meterGroups.some(
                              (g) =>
                                g.id !== group.id &&
                                g.name.toLowerCase() ===
                                  group.name.toLowerCase()
                            )
                          }
                          className="flex-1 px-4 py-2 text-sm font-medium bg-[#ba0c2f] text-white rounded-lg hover:bg-[#9a0a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Group
                        </button>
                        <button
                          type="button"
                          onClick={form.cancelEdit}
                          className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
    </>
  );
}
