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
    where,
    limit,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

const productsRef = collection(db, "products");
const transactionsRef = collection(db, "transactions");

export async function getAllProducts(uid) {
    if (!uid) throw new Error("uid is required");
    const q = query(productsRef, where("ownerId", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(uid, product) {
    if (!uid) throw new Error("uid is required");
    const now = Timestamp.now();
    await addDoc(productsRef, {
        ownerId: uid,
        ...product,
        createdAt: now,
        updatedAt: now,
    });
}

export async function updateProduct(uid, id, updates) {
    if (!uid) throw new Error("uid is required");
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, {
        ...updates,
        ownerId: uid, // keep ownerId stable (rules enforce immutability)
        updatedAt: Timestamp.now(),
    });
}

export async function deleteProduct(uid, id) {
    if (!uid) throw new Error("uid is required");
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
}

export async function getRecentTransactions(uid, max = 200) {
    if (!uid) throw new Error("uid is required");
    const q = query(
        transactionsRef,
        where("ownerId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(max)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Atomic stock movement:
 * - Updates product quantity
 * - Writes a transaction log
 */
export async function createStockTransaction({
    uid,
    productId,
    type,
    quantity,
    reason,
    note = "",
}) {
    if (!uid) throw new Error("uid is required");
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

        // Ownership check inside transaction (extra safety)
        if (product.ownerId !== uid) throw new Error("Not authorized");

        const currentQty = Number(product.quantity || 0);
        const newQty = type === "IN" ? currentQty + quantity : currentQty - quantity;
        if (newQty < 0) throw new Error("Not enough stock for Stock OUT");

        tx.update(productRef, {
            quantity: newQty,
            ownerId: uid,
            updatedAt: Timestamp.now(),
        });

        const txnDocRef = doc(transactionsRef);
        tx.set(txnDocRef, {
            ownerId: uid,
            productId,
            productName: product.name || "",
            sku: product.sku || "",
            type,
            quantity,
            reason,
            note,
            createdAt: Timestamp.now(),
            createdBy: uid,
        });
    });
}
