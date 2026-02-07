import { useState } from "react";

function App() {

  console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold">InventoryPro</h1>
        <p className="text-gray-600 mt-2">
          Firebase & Tailwind setup complete ✅
        </p>
      </div>
    </>
  );
}

export default App;
