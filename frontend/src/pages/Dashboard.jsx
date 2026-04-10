import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import Header from "../components/Header";
import LogoutModal from "../components/LogoutModal";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProperties(true);

        const propRes = await api.get("/properties");
        setProperties(propRes.data.properties);

        const favRes = await api.get("/favourites");
        setFavourites(favRes.data.favourites);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchData();
  }, []);

  // Check if property is already favourite
  const isFavourite = (id) => {
    return favourites.some((fav) => fav.id === id);
  };

  // Add to favourite
  const toggleFavourite = async (propertyId) => {
    try {
      setLoadingFav(true);
      await api.post(`/favourites/${propertyId}`);
      toast.success("Added to favourites!");

      // Refresh favourites
      const favRes = await api.get("/favourites");
      setFavourites(favRes.data.favourites);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load data");
      }
    } finally {
      setLoadingFav(false);
    }
  };

  // Logout
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
        <Header showFavourites={false} favourites={favourites} setShowLogoutModal={setShowLogoutModal} />

        {/* Properties */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            All Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loadingProperties ? (
              // Skeleton Loader
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-(--color-accent-light) p-5 rounded-2xl shadow-lg animate-pulse"
                >
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded-lg"></div>
                </div>
              ))
            ) : properties.length > 0 ? (
              properties.map((p) => (
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

                  {/* Favourite Button */}
                  <button
                    onClick={() => toggleFavourite(p.id)}
                    disabled={isFavourite(p.id) || loadingFav}
                    className={`mt-4 w-full py-2 rounded-lg text-white transition ${isFavourite(p.id)
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-(--color-primary-dark) hover:bg-(--color-primary)"
                      }`}
                  >
                    {isFavourite(p.id)
                      ? "Added ❤️"
                      : "Add to Favourites 🤍"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-white/80 mt-10 col-span-full">
                No properties found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}