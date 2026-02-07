import { getDoc } from "firebase/firestore";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const productsRef = collection(db, "products");

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
