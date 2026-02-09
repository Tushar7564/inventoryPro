export default function LowStockList({ items }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Low Stock Alerts</h3>
        <span className="text-sm text-gray-600">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600">No low stock items ✅</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded border px-3 py-2"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-600">{p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-700">
                  {p.quantity} left
                </p>
                <p className="text-xs text-gray-600">
                  Reorder at {p.reorderLevel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
