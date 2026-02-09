export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onStockIn,
  onStockOut,
}) {
  return (
    <table className="w-full border mt-4 text-sm">
      <thead className="bg-gray-100">
        <tr>
          {["Name", "SKU", "Qty", "Price", "Actions"].map((h) => (
            <th key={h} className="border px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td className="border px-3 py-2">{p.name}</td>
            <td className="border px-3 py-2">{p.sku}</td>
            <td className="border px-3 py-2">{p.quantity}</td>
            <td className="border px-3 py-2">₹{p.price}</td>
            <td className="border px-3 py-2 space-x-2">
              <button onClick={() => onEdit(p)} className="text-blue-600">
                Edit
              </button>
              <button onClick={() => onDelete(p.id)} className="text-red-600">
                Delete
              </button>
              <button onClick={() => onStockIn(p)} className="text-green-700">
                Stock In
              </button>
              <button onClick={() => onStockOut(p)} className="text-orange-700">
                Stock Out
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
