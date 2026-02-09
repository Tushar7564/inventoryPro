export default function RecentActivity({ transactions }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold">Recent Activity</h3>

      {transactions.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600">No transactions yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {transactions.map((t) => (
            <li key={t.id} className="rounded border px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {t.productName}{" "}
                  <span className="text-xs text-gray-500">({t.sku})</span>
                </p>
                <span
                  className={
                    t.type === "IN"
                      ? "text-green-700 font-semibold"
                      : "text-red-700 font-semibold"
                  }
                >
                  {t.type} {t.quantity}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                <span>{t.reason}</span>
                <span>
                  {t.createdAt?.toDate
                    ? t.createdAt.toDate().toLocaleString()
                    : "-"}
                </span>
              </div>
              {t.note ? (
                <p className="mt-1 text-xs text-gray-500">{t.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
