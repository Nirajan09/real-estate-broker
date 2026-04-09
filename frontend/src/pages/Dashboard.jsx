import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await api.get("/properties");
        setProperties(propRes.data.properties);

        const favRes = await api.get("/favourites");
        setFavourites(favRes.data.favourites);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const isFavourite = (propertyId) => {
    return favourites.some((fav) => fav.id === propertyId);
  };

  const toggleFavourite = async (propertyId) => {
    try {
      setLoadingFav(true);

      if (isFavourite(propertyId)) {
        await api.delete(`/favourites/${propertyId}`);
        toast.info("Removed from favourites!");
      } else {
        await api.post(`/favourites/${propertyId}`);
        toast.success("Added to favourites!");
      }

      const res = await api.get("/favourites");
      setFavourites(res.data.favourites);
    } catch (err) {
      console.error("Error updating favourite", err);
      toast.error("Something went wrong!");
    } finally {
      setLoadingFav(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-(--color-primary-dark) to-(--color-primary) p-6">
      <ToastContainer position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-(--color-accent-light)/90 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-(--color-primary-dark)">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-(--color-primary)">Role: {user?.role}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/favourites")}
              className="px-5 py-2 rounded-lg bg-(--color-primary-dark) text-white hover:bg-(--color-primary) transition shadow-md"
            >
              View My Favourites ❤️
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Properties */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            All Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-(--color-accent-light) p-5 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-(--color-primary-dark)">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{p.location}</p>
                <p className="text-(--color-primary) font-semibold mt-2">
                  Rs. {p.price}
                </p>

                <button
                  onClick={() => toggleFavourite(p.id)}
                  disabled={loadingFav}
                  className={`mt-4 w-full py-2 rounded-lg text-white transition ${
                    isFavourite(p.id)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-(--color-primary-dark) hover:bg-(--color-primary)"
                  }`}
                >
                  {isFavourite(p.id)
                    ? "Remove Favourite"
                    : "Add to Favourite"}
                </button>
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <p className="text-center text-white/80 mt-10">
              No properties found
            </p>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-(--color-accent-light) rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-(--color-primary-dark) mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}