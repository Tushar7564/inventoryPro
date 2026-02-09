import { useEffect, useState, useMemo } from "react";
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
import ProductsToolbar from "../components/products/ProductsToolbar";
import Pagination from "../components/common/Pagination";
import {
  matchesSearch,
  uniqueCategories,
  normalize,
} from "../utils/productHelpers";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [movement, setMovement] = useState(null);
  // movement = { product, type }
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("updated_desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  const categories = useMemo(() => uniqueCategories(products), [products]);

  const existingSkus = useMemo(
    () => products.map((p) => normalize(p.sku)),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => matchesSearch(p, search));

    if (category) {
      list = list.filter((p) => (p.category || "").trim() === category);
    }

    if (sort === "name_asc") {
      list = [...list].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      );
    } else if (sort === "qty_asc") {
      list = [...list].sort(
        (a, b) => Number(a.quantity || 0) - Number(b.quantity || 0),
      );
    } else if (sort === "qty_desc") {
      list = [...list].sort(
        (a, b) => Number(b.quantity || 0) - Number(a.quantity || 0),
      );
    } else {
      // updated_desc: fallback
      list = [...list].sort((a, b) => {
        const ta = a.updatedAt?.seconds || 0;
        const tb = b.updatedAt?.seconds || 0;
        return tb - ta;
      });
    }

    return list;
  }, [products, search, category, sort]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1); // reset page when filters change
  }, [search, category, sort]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ProductsToolbar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        categories={categories}
        sort={sort}
        onSort={setSort}
      />

      <ProductForm
        onSubmit={editing ? handleUpdate : handleAdd}
        initialData={editing}
        onCancel={() => setEditing(null)}
        existingSkus={existingSkus}
      />

      {loading ? (
        <p className="mt-4 text-gray-600">Loading products...</p>
      ) : (
        <>
          <ProductTable
            products={paged}
            onEdit={setEditing}
            onDelete={handleDelete}
            onStockIn={openStockIn}
            onStockOut={openStockOut}
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
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
