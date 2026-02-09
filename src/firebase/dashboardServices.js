import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebaseConfig";

const productsRef = collection(db, "products");
const transactionsRef = collection(db, "transactions");

export async function fetchDashboardData() {
    // Products
    const productsSnap = await getDocs(productsRef);
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Recent transactions
    const txQ = query(transactionsRef, orderBy("createdAt", "desc"), limit(10));
    const txSnap = await getDocs(txQ);
    const recentTransactions = txSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    return { products, recentTransactions };
}
