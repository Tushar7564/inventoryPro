import { useEffect, useState } from "react";

const REASONS = ["Purchase", "Sale", "Damage", "Return", "Adjustment"];

export default function StockMovementForm({
  product,
  type, // "IN" | "OUT"
  onSubmit,
  onCancel,
}) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(type === "IN" ? "Purchase" : "Sale");
  const [note, setNote] = useState("");

  useEffect(() => {
    setQuantity("");
    setNote("");
    setReason(type === "IN" ? "Purchase" : "Sale");
  }, [type, product?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      quantity: Number(quantity),
      reason,
      note: note.trim(),
    });
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Stock {type} — {product?.name} ({product?.sku})
        </h3>
        <button onClick={onCancel} className="text-sm text-gray-600">
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div>
          <label className="text-sm text-gray-700">Quantity</label>
          <input
            type="number"
            min="1"
            className="mt-1 w-full border rounded px-3 py-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Reason</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-700">Note (optional)</label>
          <input
            type="text"
            className="mt-1 w-full border rounded px-3 py-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="eg. Supplier invoice #, customer name, etc."
          />
        </div>

        <div className="flex gap-2">
          <button className="bg-gray-900 text-white px-4 py-2 rounded">
            Confirm Stock {type}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
