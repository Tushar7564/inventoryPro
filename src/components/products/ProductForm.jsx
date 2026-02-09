import { useMemo, useState } from "react";

export default function ProductForm({
  onSubmit,
  initialData,
  onCancel,
  existingSkus = [],
}) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState(
    initialData || {
      name: "",
      sku: "",
      category: "",
      price: "",
      quantity: "",
      reorderLevel: "",
    },
  );

  const [error, setError] = useState("");

  const skuConflict = useMemo(() => {
    const sku = (form.sku || "").trim().toLowerCase();
    if (!sku) return false;

    // Allow same SKU while editing same product
    if (isEdit && initialData?.sku?.trim().toLowerCase() === sku) return false;

    return existingSkus.includes(sku);
  }, [existingSkus, form.sku, isEdit, initialData]);

  function handleChange(e) {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate(payload) {
    if (!payload.name.trim()) return "Name is required.";
    if (!payload.sku.trim()) return "SKU is required.";
    if (skuConflict) return "SKU already exists. Use a unique SKU.";

    if (!Number.isFinite(payload.price) || payload.price < 0)
      return "Price must be 0 or greater.";
    if (!Number.isFinite(payload.quantity) || payload.quantity < 0)
      return "Quantity must be 0 or greater.";
    if (!Number.isFinite(payload.reorderLevel) || payload.reorderLevel < 0)
      return "Reorder level must be 0 or greater.";

    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
    };

    const msg = validate(payload);
    if (msg) {
      setError(msg);
      return;
    }

    onSubmit(payload);
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h2 className="font-semibold">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
            {skuConflict && (
              <p className="mt-1 text-xs text-red-700">SKU already exists.</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-700">Price</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Quantity</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Reorder Level</label>
            <input
              name="reorderLevel"
              type="number"
              min="0"
              value={form.reorderLevel}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-gray-900 text-white px-4 py-2 rounded">
            {isEdit ? "Update" : "Save"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
