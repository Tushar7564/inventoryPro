import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
    query,
    orderBy,
    runTransaction,
    getDoc,
    limit,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

const productsRef = collection(db, "products");
const transactionsRef = collection(db, "transactions");

export async function getAllProducts() {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(product) {
    const now = Timestamp.now();
    await addDoc(productsRef, {
        ...product,
        createdAt: now,
        updatedAt: now,
    });
}

export async function updateProduct(id, updates) {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteProduct(id) {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
}

export async function getRecentTransactions(max = 200) {
    const q = query(transactionsRef, orderBy("createdAt", "desc"), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Atomic stock movement:
 * - Updates product quantity
 * - Writes a transaction log
 */
export async function createStockTransaction({
    productId,
    type, // "IN" | "OUT"
    quantity,
    reason,
    note = "",
    createdBy,
}) {
    if (!productId) throw new Error("productId is required");
    if (!["IN", "OUT"].includes(type)) throw new Error("Invalid transaction type");
    if (!Number.isFinite(quantity) || quantity <= 0)
        throw new Error("Quantity must be a positive number");
    if (!reason) throw new Error("Reason is required");

    const productRef = doc(db, "products", productId);

    await runTransaction(db, async (tx) => {
        const productSnap = await tx.get(productRef);
        if (!productSnap.exists()) throw new Error("Product not found");

        const product = productSnap.data();
        const currentQty = Number(product.quantity || 0);

        const newQty = type === "IN" ? currentQty + quantity : currentQty - quantity;

        if (newQty < 0) {
            throw new Error("Not enough stock for Stock OUT");
        }

        // Update product quantity
        tx.update(productRef, {
            quantity: newQty,
            updatedAt: Timestamp.now(),
        });

        // Write transaction record
        const txnDocRef = doc(transactionsRef); // auto id
        tx.set(txnDocRef, {
            productId,
            productName: product.name || "",
            sku: product.sku || "",
            type,
            quantity,
            reason,
            note,
            createdBy: createdBy || null,
            createdAt: Timestamp.now(),
        });
    });
}
