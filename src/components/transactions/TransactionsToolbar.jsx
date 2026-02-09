export default function TransactionsToolbar({
  search,
  onSearch,
  type,
  onType,
  reason,
  onReason,
  reasons,
  startDate,
  onStartDate,
  endDate,
  onEndDate,
  onClear,
}) {
  return (
    <div className="mt-4 mb-1 rounded-lg border bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-700">Search</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="name, sku, reason, note..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Type</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={type}
            onChange={(e) => onType(e.target.value)}
          >
            <option value="">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-700">Reason</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={reason}
            onChange={(e) => onReason(e.target.value)}
          >
            <option value="">All</option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-end">
          <button
            onClick={onClear}
            className="border rounded px-3 py-2 text-sm bg-white w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-700">Start date</label>
          <input
            type="date"
            className="mt-1 w-full border rounded px-3 py-2"
            value={startDate}
            onChange={(e) => onStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">End date</label>
          <input
            type="date"
            className="mt-1 w-full border rounded px-3 py-2"
            value={endDate}
            onChange={(e) => onEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-end text-sm text-gray-600">
          Tip: use date range for “last week/month” checks.
        </div>
      </div>
    </div>
  );
}
