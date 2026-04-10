import { useNavigate } from "react-router-dom";

const Header = ({ showFavourites = false, favourites = [],setShowLogoutModal }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div className="bg-(--color-accent-light)/90 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-(--color-primary-dark)">
                    Welcome, {user?.name}
                </h1>
                <p className="text-sm text-(--color-primary)">Role: {user?.role}</p>
            </div>

            <div className="flex gap-4 items-center">
                {
                    !showFavourites ?
                        <button
                            onClick={() => navigate("/favourites")}
                            className="relative bg-(--color-primary-dark) text-white px-5 py-2 rounded-lg hover:bg-(--color-primary) transition shadow-md"
                        >
                            My Favourites ❤️

                            {favourites.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {favourites.length}
                                </span>
                            )}
                        </button>
                        :
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="relative bg-(--color-primary-dark) text-white px-5 py-2 rounded-lg hover:bg-(--color-primary) transition shadow-md"
                        >
                            My Dashboard
                        </button>
                        
                        }

                {/* Logout */}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Header
