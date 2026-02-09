export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function prev() {
    onPageChange(Math.max(1, page - 1));
  }
  function next() {
    onPageChange(Math.min(totalPages, page + 1));
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          onClick={prev}
          disabled={page === 1}
          className="border rounded px-3 py-1.5 text-sm bg-white disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={next}
          disabled={page === totalPages}
          className="border rounded px-3 py-1.5 text-sm bg-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
