export function normalize(str) {
    return (str || "").trim().toLowerCase();
}

export function uniqueReasons(transactions) {
    const set = new Set();
    transactions.forEach((t) => {
        const r = (t.reason || "").trim();
        if (r) set.add(r);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function matchesTransactionSearch(t, term) {
    const q = normalize(term);
    if (!q) return true;

    const hay = [
        t.productName,
        t.sku,
        t.reason,
        t.note,
        t.type,
    ]
        .map(normalize)
        .join(" ");

    return hay.includes(q);
}

export function withinDateRange(t, startDate, endDate) {
    if (!startDate && !endDate) return true;

    const d = t.createdAt?.toDate ? t.createdAt.toDate() : null;
    if (!d) return false;

    // startDate/endDate are strings "YYYY-MM-DD"
    if (startDate) {
        const s = new Date(startDate + "T00:00:00");
        if (d < s) return false;
    }

    if (endDate) {
        const e = new Date(endDate + "T23:59:59");
        if (d > e) return false;
    }

    return true;
}
