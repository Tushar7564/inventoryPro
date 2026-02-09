import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { fetchDashboardData } from "../firebase/dashboardServices";
import StatsCard from "../components/dashboard/StatsCard";
import LowStockList from "../components/dashboard/LowStockList";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, authLoading } = useAuth();

  async function load() {
    if (!user?.uid) return;

    setError("");
    setLoading(true);
    try {
      const { products, recentTransactions } = await fetchDashboardData(
        user.uid,
      );
      setProducts(products);
      setRecentTransactions(recentTransactions);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalUnits = products.reduce(
      (sum, p) => sum + Number(p.quantity || 0),
      0,
    );

    const inventoryValue = products.reduce((sum, p) => {
      const qty = Number(p.quantity || 0);
      const price = Number(p.price || 0);
      return sum + qty * price;
    }, 0);

    const lowStock = products.filter((p) => {
      const qty = Number(p.quantity || 0);
      const reorder = Number(p.reorderLevel || 0);
      return qty <= reorder;
    });

    const outOfStock = products.filter((p) => Number(p.quantity || 0) === 0);

    return {
      totalProducts,
      totalUnits,
      inventoryValue,
      lowStock,
      outOfStockCount: outOfStock.length,
    };
  }, [products]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Inventory overview and alerts</p>
        </div>

        <button
          onClick={load}
          disabled={authLoading || !user}
          className="border rounded px-3 py-2 text-sm bg-white disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Products" value={stats.totalProducts} />
            <StatsCard label="Total Units in Stock" value={stats.totalUnits} />
            <StatsCard
              label="Inventory Value"
              value={`₹${stats.inventoryValue.toLocaleString("en-IN")}`}
              subtext="Sum of (price × quantity)"
            />
            <StatsCard
              label="Out of Stock"
              value={stats.outOfStockCount}
              subtext="Items with quantity = 0"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LowStockList items={stats.lowStock} />
            <RecentActivity transactions={recentTransactions} />
          </div>
        </>
      )}
    </div>
  );
}
