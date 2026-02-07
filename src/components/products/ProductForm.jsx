import { useState } from "react";

export default function ProductForm({ onSubmit, initialData, onCancel }) {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {["name", "sku", "category"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.toUpperCase()}
          value={form[field]}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      ))}

      {["price", "quantity", "reorderLevel"].map((field) => (
        <input
          key={field}
          name={field}
          type="number"
          placeholder={field.toUpperCase()}
          value={form[field]}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      ))}

      <div className="flex gap-2">
        <button className="bg-gray-900 text-white px-4 py-2 rounded cursor-pointer">
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
