export function normalize(str) {
    return (str || "").trim().toLowerCase();
}

export function matchesSearch(product, term) {
    const q = normalize(term);
    if (!q) return true;

    const name = normalize(product.name);
    const sku = normalize(product.sku);
    return name.includes(q) || sku.includes(q);
}

export function uniqueCategories(products) {
    const set = new Set();
    products.forEach((p) => {
        const c = (p.category || "").trim();
        if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}
