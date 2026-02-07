import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // hide navbar when logged out

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          InventoryPro
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-700 hover:text-black">
            Dashboard
          </Link>
          <Link
            to="/products"
            className="text-sm text-gray-700 hover:text-black"
          >
            Products
          </Link>
          <Link
            to="/transactions"
            className="text-sm text-gray-700 hover:text-black"
          >
            Transactions
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-900 text-white px-3 py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
