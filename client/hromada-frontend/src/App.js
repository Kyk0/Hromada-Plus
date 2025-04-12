import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import CreateInitiativePage from "./pages/CreateInitiativePage"
import InitiativePage from "./pages/InitiativePage"
import SearchPage from "./pages/SearchPage"

import MainLayout from "./components/MainLayout"

function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Router>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Приватные маршруты внутри MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/initiatives/:id" element={<InitiativePage />} />

                    {/* Защищённые */}
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/create-initiative"
                        element={isAuthenticated ? <CreateInitiativePage /> : <Navigate to="/login" replace />}
                    />
                </Route>

                {/* Редирект всех неизвестных путей */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App