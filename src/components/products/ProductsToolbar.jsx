export default function ProductsToolbar({
  search,
  onSearch,
  category,
  onCategory,
  categories,
  sort,
  onSort,
}) {
  return (
    <div className="mt-4 mb-1 rounded-lg border bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-700">Search (Name / SKU)</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="eg. window, win-0001"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Category</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => onCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-700">Sort</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={sort}
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="updated_desc">Recently updated</option>
            <option value="name_asc">Name A → Z</option>
            <option value="qty_asc">Qty low → high</option>
            <option value="qty_desc">Qty high → low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
