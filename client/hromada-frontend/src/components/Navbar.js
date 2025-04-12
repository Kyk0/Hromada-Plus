import { useLocation, useNavigate } from "react-router-dom"

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const handleProfileClick = () => {
        if (location.pathname !== "/profile") {
            navigate("/profile")
        }
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm px-4 sm:px-10 h-20 flex items-center justify-between font-rubik">
            <div
                onClick={() => navigate("/")}
                className="text-black text-lg sm:text-xl font-normal tracking-wide cursor-pointer"
            >
                Громада+
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/create-initiative")}
                    className="text-gray-800 hover:text-blue-600 text-sm sm:text-base font-medium"
                >
                    Створити ініціативу
                </button>
                <button
                    onClick={() => navigate("/search")}
                    className="text-gray-800 hover:text-blue-600 text-sm sm:text-base font-medium"
                >
                    Пошук
                </button>
                <button
                    onClick={handleProfileClick}
                    className="text-gray-800 hover:text-blue-600 text-sm sm:text-base font-medium"
                >
                    Профіль
                </button>
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                    👤
                </div>
            </div>
        </nav>
    )
}

export default Navbar