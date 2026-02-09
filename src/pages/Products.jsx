import { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../firebase/firestoreServices";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import StockMovementForm from "../components/transactions/StockMovementForm";
import { createStockTransaction } from "../firebase/firestoreServices";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [movement, setMovement] = useState(null);
  // movement = { product, type }

  async function loadProducts() {
    setError("");
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products:", e);
      setError(e?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleAdd(product) {
    await addProduct(product);
    await loadProducts();
  }

  async function handleUpdate(product) {
    await updateProduct(editing.id, product);
    setEditing(null);
    await loadProducts();
  }

  async function handleDelete(id) {
    if (confirm("Delete this product?")) {
      await deleteProduct(id);
      await loadProducts();
    }
  }

  function openStockIn(product) {
    setMovement({ product, type: "IN" });
  }
  function openStockOut(product) {
    setMovement({ product, type: "OUT" });
  }

  async function handleMovementSubmit({ quantity, reason, note }) {
    try {
      setError("");
      await createStockTransaction({
        productId: movement.product.id,
        type: movement.type,
        quantity,
        reason,
        note,
        createdBy: user?.uid,
      });

      setMovement(null);
      await loadProducts();
    } catch (e) {
      setError(e?.message || "Stock update failed");
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ProductForm
        onSubmit={editing ? handleUpdate : handleAdd}
        initialData={editing}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p className="mt-4 text-gray-600">Loading products...</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={setEditing}
          onDelete={handleDelete}
          onStockIn={openStockIn}
          onStockOut={openStockOut}
        />
      )}
      {movement && (
        <StockMovementForm
          product={movement.product}
          type={movement.type}
          onSubmit={handleMovementSubmit}
          onCancel={() => setMovement(null)}
        />
      )}
    </div>
  );
}
