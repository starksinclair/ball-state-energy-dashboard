export function ParameterFormHeader() {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-[#ba0c2f] to-[#9a0a26]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Analysis Parameters
          </h2>
          <p className="text-sm text-red-100 mt-1">
            Configure your data analysis settings
          </p>
        </div>
      </div>
    </div>
  );
}
