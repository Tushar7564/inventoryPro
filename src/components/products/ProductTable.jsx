export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onStockIn,
  onStockOut,
}) {
  return (
    <table className="w-full border mt-4 text-sm bg-white">
      <thead className="bg-gray-100">
        <tr>
          {[
            "Name",
            "SKU",
            "Category",
            "Qty",
            "Reorder",
            "Price",
            "Actions",
          ].map((h) => (
            <th key={h} className="border px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          const lowStock =
            Number(p.quantity || 0) <= Number(p.reorderLevel || 0);

          return (
            <tr key={p.id}>
              <td className="border px-3 py-2">
                <div className="font-medium">{p.name}</div>
                {lowStock && (
                  <span className="mt-1 inline-block text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-0.5">
                    Low stock
                  </span>
                )}
              </td>
              <td className="border px-3 py-2">{p.sku}</td>
              <td className="border px-3 py-2">{p.category || "-"}</td>
              <td className="border px-3 py-2">{p.quantity}</td>
              <td className="border px-3 py-2">{p.reorderLevel}</td>
              <td className="border px-3 py-2">
                ₹{Number(p.price || 0).toLocaleString("en-IN")}
              </td>
              <td className="border px-3 py-2 space-x-3">
                <button onClick={() => onStockIn(p)} className="text-green-700">
                  Stock In
                </button>
                <button
                  onClick={() => onStockOut(p)}
                  className="text-orange-700"
                >
                  Stock Out
                </button>
                <button onClick={() => onEdit(p)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => onDelete(p.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
