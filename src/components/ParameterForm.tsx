import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import type { BaseRequest, PlotType, FormField } from "../types/api";
import { useMeterList } from "../services/api";
import { PLOT_TYPES } from "../constants/plotTypes";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [breaksWeather, setBreaksWeather] = useState<
    [boolean, boolean, boolean, boolean]
  >([true, true, true, true]);
  const [meter, setMeter] = useState("");
  const [cleaningMethod, setCleaningMethod] = useState("");
  const [smoothingMethod, setSmoothingMethod] = useState<"ma" | "hp">("ma");
  const [smoothingWindow, setSmoothingWindow] = useState(7);
  const [meterGroups, setMeterGroups] = useState<
    Array<{ id: string; name: string; meters: string[] }>
  >([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const { data: meterList } = useMeterList();
  
  // Load meter groups from localStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem("meterGroups");
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups);
        setMeterGroups(parsed);
      } catch (error) {
        console.error("Error loading meter groups from localStorage:", error);
      }
    }
  }, []);

  // Helper function to save meter groups to localStorage
  const saveMeterGroupsToStorage = (groups: Array<{ id: string; name: string; meters: string[] }>) => {
    if (groups.length > 0) {
      localStorage.setItem("meterGroups", JSON.stringify(groups));
    } else {
      localStorage.removeItem("meterGroups");
    }
  };

  // Combine original meters with group names for the dropdown
  const allMeters = useMemo(() => {
    const originalMeters = meterList?.meters || [];
    const groupNames = meterGroups
      .filter((group) => group.name && group.meters.length > 0)
      .map((group) => group.name);
    return [...originalMeters, ...groupNames];
  }, [meterList?.meters, meterGroups]);
  useEffect(() => {
    setStartDate("");
    setEndDate("");
    setBreaksWeather([true, true, true, true]);
    setMeter("");
    setCleaningMethod("");
    setSmoothingMethod("ma");
    setSmoothingWindow(7);
  }, [resetSignal]);

  useEffect(() => {
    if (!initialValues) return;
    setStartDate(initialValues.start_date);
    setEndDate(initialValues.end_date);
    setMeter(initialValues.meter);
    setCleaningMethod(initialValues.cleaning_method ?? "");
    setSmoothingMethod(initialValues.smoothing_method ?? "ma");
    setSmoothingWindow(initialValues.smoothing_window ?? 7);
    if (initialValues.meters_to_add) {
      const groups = Object.entries(initialValues.meters_to_add).map(
        ([name, meterList], index) => ({
          id: `group-${index}`,
          name,
          meters: meterList,
        })
      );
      setMeterGroups(groups);
    }
  }, [initialValues]);

  // Get the current plot type configuration
  const plotConfig = useMemo(
    () => PLOT_TYPES.find((plot) => plot.id === selectedPlotType),
    [selectedPlotType]
  );

  // Helper function to check if a field should be shown
  const shouldShowField = (field: FormField): boolean => {
    return plotConfig?.fields.includes(field) ?? false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before or equal to end date");
      return;
    }

    const params: BaseRequest = {
      start_date: startDate,
      end_date: endDate,
      meter: meter,
    };

    // Only include optional fields if they're in the configuration
    if (shouldShowField("cleaning_method") && cleaningMethod) {
      params.cleaning_method = cleaningMethod as
        | "Prophet"
        | "Hampel"
        | "Polynomial"
        | "None";
    }
    if (shouldShowField("smoothing_method") && smoothingMethod) {
      params.smoothing_method = smoothingMethod;
    }
    if (shouldShowField("smoothing_window") && smoothingWindow) {
      params.smoothing_window = smoothingWindow;
    }

    // Include meters_toadd if there are any groups
    if (meterGroups.length > 0) {
      const metersToAdd: Record<string, string[]> = {};
      meterGroups.forEach((group) => {
        if (group.name && group.meters.length > 0) {
          metersToAdd[group.name] = group.meters;
        }
      });
      if (Object.keys(metersToAdd).length > 0) {
        params.meters_to_add = metersToAdd;
      }
    }
    console.log(params);

    onSubmit(params);
  };

  const handleBreaksWeatherChange = (index: number, value: boolean) => {
    const newBreaksWeather = [...breaksWeather] as [
      boolean,
      boolean,
      boolean,
      boolean,
    ];
    newBreaksWeather[index] = value;
    setBreaksWeather(newBreaksWeather);
  };

  const addMeterGroup = () => {
    const newId = `group-${Date.now()}`;
    const updatedGroups = [
      ...meterGroups,
      { id: newId, name: "", meters: [] },
    ];
    setMeterGroups(updatedGroups);
    saveMeterGroupsToStorage(updatedGroups);
    setEditingGroupId(newId);
  };

  const saveMeterGroup = (id: string) => {
    const group = meterGroups.find((g) => g.id === id);
    if (!group) return;

    if (!group.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (group.meters.length === 0) {
      toast.error("Please select at least one meter to sum");
      return;
    }

    const nameExists = meterGroups.some(
      (g) => g.id !== id && g.name.toLowerCase() === group.name.toLowerCase()
    );
    if (nameExists) {
      toast.error("A group with this name already exists. Please use a different name.");
      return;
    }

    // Explicitly save to localStorage
    saveMeterGroupsToStorage(meterGroups);
    setEditingGroupId(null);
    toast.success(`Meter group "${group.name}" saved! You can now select it from the Meter dropdown.`);
  };

  const editMeterGroup = (id: string) => {
    setEditingGroupId(id);
  };

  const cancelEdit = () => {
    const editingGroup = meterGroups.find((g) => g.id === editingGroupId);
    // If it's a new unsaved group (no name or no meters), remove it
    if (editingGroup && !editingGroup.name && editingGroup.meters.length === 0) {
      const updatedGroups = meterGroups.filter((g) => g.id !== editingGroupId);
      setMeterGroups(updatedGroups);
      saveMeterGroupsToStorage(updatedGroups);
    }
    setEditingGroupId(null);
  };

  const removeMeterGroup = (id: string) => {
    if (window.confirm("Are you sure you want to remove this meter group?")) {
      const updatedGroups = meterGroups.filter((group) => group.id !== id);
      setMeterGroups(updatedGroups);
      saveMeterGroupsToStorage(updatedGroups);
      if (editingGroupId === id) {
        setEditingGroupId(null);
      }
      toast.success("Meter group removed");
    }
  };

  const updateMeterGroup = (
    id: string,
    updates: { name?: string; meters?: string[] }
  ) => {
    const updatedGroups = meterGroups.map((group) =>
      group.id === id ? { ...group, ...updates } : group
    );
    setMeterGroups(updatedGroups);
    saveMeterGroupsToStorage(updatedGroups);
  };

  const updateMeterGroupName = (id: string, name: string) => {
    updateMeterGroup(id, { name });
  };

  const updateMeterGroupMeters = (id: string, meters: string[]) => {
    updateMeterGroup(id, { meters });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-[#003DA5] mb-4">Parameters</h2>
      <div className="mb-4">
      <p className="text-sm text-gray-500 mb-2">
                Minimum start date: {meterList?.time_range?.start || ""}
              </p>
      <p className="text-sm text-gray-500 mb-2">
                Maximum end date: {meterList?.time_range?.end || ""}
      </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shouldShowField("start_date") && (
            <div>
             
        
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {/* .toLocaleString('en-US', {
  dateStyle: 'long',
  timeStyle: 'short'
}); */}
                Start Date: { meterList?.time_range?.start ? new Date(meterList?.time_range?.start).toLocaleString('en-US', {
  dateStyle: 'long',
  timeStyle: 'short'
}) : ""}
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                min={meterList?.time_range?.start ? new Date(meterList?.time_range?.start).toISOString().split("T")[0] : ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
                required
              />
            </div>
          )}

          {shouldShowField("end_date") && (
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                  End Date: {meterList?.time_range?.end ? new Date(meterList?.time_range?.end).toLocaleString('en-US', {
  dateStyle: 'long',
  timeStyle: 'short'
}) : ""}
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                min={meterList?.time_range?.end ? meterList?.time_range?.end.slice(0, 16) : ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
                required
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shouldShowField("meter") && (
            <div>
              <label
                htmlFor="meter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meter
              </label>
              <select
                id="meter"
                value={meter}
                onChange={(e) => setMeter(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
              >
                <option value="">Select a meter</option>
                {allMeters.map((meterOption) => (
                  <option key={meterOption} value={meterOption}>
                    {meterOption}
                    {meterGroups.some((g) => g.name === meterOption)
                      ? " (Summed Group)"
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {shouldShowField("smoothing_method") && (
            <div>
              <label
                htmlFor="smoothingMethod"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Smoothing Method
              </label>
              <select
                id="smoothingMethod"
                value={smoothingMethod}
                onChange={(e) =>
                  setSmoothingMethod(e.target.value as "ma" | "hp")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
              >
                <option value="">Select a smoothing method</option>
                <option value="ma">Moving Average (MA)</option>
                <option value="hp">Hodrick-Prescott (HP)</option>
              </select>
            </div>
          )}

          {shouldShowField("smoothing_window") && (
            <div>
              <label
                htmlFor="smoothingWindow"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Smoothing Window
              </label>
              <input
                type="number"
                id="smoothingWindow"
                value={smoothingWindow}
                onChange={(e) =>
                  setSmoothingWindow(parseInt(e.target.value) || 7)
                }
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
              />
            </div>
          )}
          {shouldShowField("cleaning_method") && (
            <div>
              <label
                htmlFor="cleaningMethod"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cleaning Method
              </label>
              <select
                id="cleaningMethod"
                value={cleaningMethod}
                onChange={(e) =>
                  setCleaningMethod(
                    e.target.value as
                      | "Prophet"
                      | "Hampel"
                      | "Polynomial"
                      | "None"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
              >
                <option value="">Select a cleaning method</option>
                <option value="None">None</option>
                <option value="Prophet">Prophet (Facebook Prophet)</option>
                <option value="Hampel">Hampel</option>
                <option value="Polynomial">
                  Polynomial (Polynomial Regression)
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Add Meters Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Add Meters (Sum Multiple Meters)
            </h3>
            <button
              type="button"
              onClick={addMeterGroup}
              className="px-4 py-2 text-sm bg-[#003DA5] text-white rounded-md hover:bg-[#002d7a] transition-colors"
            >
              + Add Meter Group
            </button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              How Meter Groups Work:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>
                Create a group by giving it a name and selecting multiple meters
                to sum together
              </li>
              <li>
                Once saved, the group name will appear in the "Meter" dropdown
                above
              </li>
              <li>
                When you select a group name, the backend will sum the energy
                consumption values from all selected meters at each time point
              </li>
              <li>
                This creates a new virtual meter that represents the combined
                consumption
              </li>
              <li>
                Meter groups are saved to your browser and will persist across
                page refreshes
              </li>
            </ul>
          </div>
          {meterGroups.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Click "Add Meter Group" to create your first group. For example,
              you can sum "FOUNDATIONAL_SCIENCE-FBPM7" and
              "FOUNDATIONAL_SCIENCE-FBPM17" into a group named
              "totalfoundation".
            </p>
          )}
          <div className="space-y-4">
            {/* Display saved groups as cards */}
            {meterGroups
              .filter((group) => group.name && group.meters.length > 0 && editingGroupId !== group.id)
              .map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {group.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {group.meters.length} meter{group.meters.length !== 1 ? "s" : ""} selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.meters.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => editMeterGroup(group.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMeterGroup(group.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Show form for editing/creating groups */}
            {meterGroups
              .filter((group) => editingGroupId === group.id)
              .map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {group.name ? `Editing: ${group.name}` : "New Meter Group"}
                    </h4>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-4">
                      <label
                        htmlFor={`group-name-${group.id}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Group Name (e.g., "totalfoundation")
                      </label>
                      <input
                        type="text"
                        id={`group-name-${group.id}`}
                        value={group.name}
                        onChange={(e) =>
                          updateMeterGroupName(group.id, e.target.value)
                        }
                        placeholder="Enter group name (e.g., totalfoundation)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent"
                      />
                      {group.name &&
                        group.meters.length > 0 &&
                        !meterGroups.some(
                          (g) =>
                            g.id !== group.id &&
                            g.name.toLowerCase() === group.name.toLowerCase()
                        ) && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Ready to save
                          </p>
                        )}
                      {meterGroups.some(
                        (g) =>
                          g.id !== group.id &&
                          g.name.toLowerCase() === group.name.toLowerCase()
                      ) && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠ Group name already exists
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`group-meters-${group.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Meters to Sum
                    </label>
                    <select
                      id={`group-meters-${group.id}`}
                      multiple
                      value={group.meters}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        updateMeterGroupMeters(group.id, selected);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ball-state-blue focus:border-transparent min-h-[100px]"
                      size={6}
                    >
                      {(meterList?.meters || []).map((m) => (
                        <option key={m} value={m} className="text-sm text-gray-700">
                          {m}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl (Cmd on Mac) to select multiple meters
                    </p>
                    {group.meters.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Selected ({group.meters.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.meters.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => saveMeterGroup(group.id)}
                      disabled={
                        !group.name.trim() ||
                        group.meters.length === 0 ||
                        meterGroups.some(
                          (g) =>
                            g.id !== group.id &&
                            g.name.toLowerCase() === group.name.toLowerCase()
                        )
                      }
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Group
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {shouldShowField("breaks_weather") && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Data Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={breaksWeather[0]}
                  onChange={(e) =>
                    handleBreaksWeatherChange(0, e.target.checked)
                  }
                  className="h-4 w-4 text-ball-state-blue focus:ring-ball-state-blue border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Holiday Indicators
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={breaksWeather[1]}
                  onChange={(e) =>
                    handleBreaksWeatherChange(1, e.target.checked)
                  }
                  className="h-4 w-4 text-ball-state-blue focus:ring-ball-state-blue border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Summer Break Indicator
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={breaksWeather[2]}
                  onChange={(e) =>
                    handleBreaksWeatherChange(2, e.target.checked)
                  }
                  className="h-4 w-4 text-ball-state-blue focus:ring-ball-state-blue border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">In-Session Status</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={breaksWeather[3]}
                  onChange={(e) =>
                    handleBreaksWeatherChange(3, e.target.checked)
                  }
                  className="h-4 w-4 text-ball-state-blue focus:ring-ball-state-blue border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Weather Data</span>
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          // disabled={isLoading}
          className="w-full cursor-pointer bg-[#ba0c2f] text-white py-2 px-4 rounded-md hover:bg-white hover:text-[#ba0c2f] hover:border-[#ba0c2f] border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-ball-state-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? "Generating Predictions..."
            : "Generate Energy Predictions"}
        </button>
      </form>
    </div>
  );
}
