import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

const productsRef = collection(db, "products");
const transactionsRef = collection(db, "transactions");

export async function fetchDashboardData(uid) {
  if (!uid) throw new Error("uid is required");

  const productsQ = query(productsRef, where("ownerId", "==", uid));
  const productsSnap = await getDocs(productsQ);
  const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const txQ = query(
    transactionsRef,
    where("ownerId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const txSnap = await getDocs(txQ);
  const recentTransactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return { products, recentTransactions };
}
