import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../components/LogoutModal";

export default function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loadingFav, setLoadingFav] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                setLoadingData(true);
                const res = await api.get("/favourites");
                setFavourites(res.data.favourites);
            } catch (err) {
                console.error(err);
                if (err.response?.status !== 401) {
                    toast.error("Failed to load favourites");
                }
            } finally {
                setLoadingData(false);
            }
        };
        fetchFavourites();
    }, []);

    const toggleFavourite = async (propertyId) => {
        try {
            setLoadingFav(true);
            await api.delete(`/favourites/${propertyId}`);
            toast.info("Removed from favourites!");
            const res = await api.get("/favourites");
            setFavourites(res.data.favourites);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoadingFav(false);
        }
    };

    // Skeleton Card
    const SkeletonCard = () => (
        <div className="bg-(--color-accent-light) p-5 rounded-2xl shadow-lg animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded-lg"></div>
        </div>
    );

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
                <Header showFavourites={true} favourites={favourites} setShowLogoutModal={setShowLogoutModal} />

                {/* Skeleton while loading */}
                {loadingData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <SkeletonCard key={idx} />
                        ))}
                    </div>
                ) : favourites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {favourites.map((fav) => (
                            <div
                                key={fav.id}
                                className="bg-(--color-accent-light) p-5 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold text-(--color-primary-dark)">
                                    {fav.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{fav.location}</p>
                                <p className="text-(--color-primary) font-semibold mt-2">
                                    Rs. {fav.price}
                                </p>

                                <button
                                    onClick={() => toggleFavourite(fav.id)}
                                    disabled={loadingFav}
                                    className="mt-4 w-full py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                                >
                                    {loadingFav ? "Processing..." : "Remove Favourite"}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-10 text-white">
                        <p className="mb-4">
                            You haven't added any favourites yet.
                        </p>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="relative bg-(--color-primary-dark) text-white px-5 py-2 rounded-lg hover:bg-(--color-primary) transition shadow-md"
                        >
                            Explore Properties
                        </button>
                    </div>
                )}
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