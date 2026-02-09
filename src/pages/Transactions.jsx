import { useEffect, useMemo, useState } from "react";
import { getRecentTransactions } from "../firebase/firestoreServices";
import TransactionsTable from "../components/transactions/TransactionsTable";
import TransactionsToolbar from "../components/transactions/TransactionsToolbar";
import Pagination from "../components/common/Pagination";
import {
  matchesTransactionSearch,
  uniqueReasons,
  withinDateRange,
} from "../utils/transactionHelpers";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getRecentTransactions(200);
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

  const reasons = useMemo(() => uniqueReasons(transactions), [transactions]);

  const filtered = useMemo(() => {
    let list = transactions;

    if (type) list = list.filter((t) => t.type === type);
    if (reason) list = list.filter((t) => t.reason === reason);

    list = list.filter((t) => matchesTransactionSearch(t, search));
    list = list.filter((t) => withinDateRange(t, startDate, endDate));

    return list;
  }, [transactions, type, reason, search, startDate, endDate]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [type, reason, search, startDate, endDate]);

  function clearFilters() {
    setSearch("");
    setType("");
    setReason("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Search and filter stock movements
          </p>
        </div>

        <button
          onClick={load}
          className="border rounded px-3 py-2 text-sm bg-white"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <TransactionsToolbar
        search={search}
        onSearch={setSearch}
        type={type}
        onType={setType}
        reason={reason}
        onReason={setReason}
        reasons={reasons}
        startDate={startDate}
        onStartDate={setStartDate}
        endDate={endDate}
        onEndDate={setEndDate}
        onClear={clearFilters}
      />

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-gray-600">No matching transactions.</p>
      ) : (
        <>
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-medium">{filtered.length}</span>{" "}
            results
          </div>

          <TransactionsTable transactions={paged} />

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
