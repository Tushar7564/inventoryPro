export default function TransactionsTable({ transactions }) {
  return (
    <table className="w-full border mt-4 text-sm">
      <thead className="bg-gray-100">
        <tr>
          {["Date", "Product", "Type", "Qty", "Reason", "Note"].map((h) => (
            <th key={h} className="border px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td className="border px-3 py-2">
              {t.createdAt?.toDate
                ? t.createdAt.toDate().toLocaleString()
                : "-"}
            </td>
            <td className="border px-3 py-2">
              <div className="font-medium">{t.productName}</div>
              <div className="text-xs text-gray-600">{t.sku}</div>
            </td>
            <td className="border px-3 py-2">
              <span
                className={
                  t.type === "IN"
                    ? "text-green-700 font-medium"
                    : "text-red-700 font-medium"
                }
              >
                {t.type}
              </span>
            </td>
            <td className="border px-3 py-2">{t.quantity}</td>
            <td className="border px-3 py-2">{t.reason}</td>
            <td className="border px-3 py-2">{t.note || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
