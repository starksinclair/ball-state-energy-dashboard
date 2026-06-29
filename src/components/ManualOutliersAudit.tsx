import type {
  ManualOutlierApplied,
  ManualOutlierSkipped,
} from "../types/api";

interface ManualOutliersAuditProps {
  applied?: ManualOutlierApplied[];
  skipped?: ManualOutlierSkipped[];
}

export default function ManualOutliersAudit({
  applied,
  skipped,
}: ManualOutliersAuditProps) {
  const hasApplied = applied && applied.length > 0;
  const hasSkipped = skipped && skipped.length > 0;
  if (!hasApplied && !hasSkipped) return null;

  return (
    <div className="space-y-4">
      {hasApplied && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Manual outliers applied ({applied.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                  <th className="py-2 pr-4 font-medium">Meter</th>
                  <th className="py-2 pr-4 font-medium">Datetime</th>
                  <th className="py-2 pr-4 font-medium">Before</th>
                  <th className="py-2 font-medium">After</th>
                </tr>
              </thead>
              <tbody>
                {applied.map((row) => (
                  <tr
                    key={`${row.meter}-${row.datetime}`}
                    className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <td className="py-2 pr-4">{row.meter}</td>
                    <td className="py-2 pr-4">{row.datetime}</td>
                    <td className="py-2 pr-4">{row.value_before.toLocaleString()}</td>
                    <td className="py-2">{row.value_after.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasSkipped && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
            Manual outliers skipped ({skipped.length})
          </h4>
          <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
            {skipped.map((row) => (
              <li key={`${row.meter}-${row.datetime}`}>
                <span className="font-medium">{row.datetime}</span>
                {row.meter && ` (${row.meter})`}: {row.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
