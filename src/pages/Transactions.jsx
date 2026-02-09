import { useEffect, useState } from "react";
import { getRecentTransactions } from "../firebase/firestoreServices";
import TransactionsTable from "../components/transactions/TransactionsTable";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getRecentTransactions(50);
      setTransactions(data);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-gray-600 mt-2">Latest stock movements</p>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="mt-4 text-gray-600">No transactions yet.</p>
      ) : (
        // Lazy import to avoid circular: keep simple
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
