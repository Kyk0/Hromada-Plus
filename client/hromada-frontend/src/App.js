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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />

                <Route element={<MainLayout />}>
                    <Route
                        path="/search"
                        element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/initiatives/:id"
                        element={isAuthenticated ? <InitiativePage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/create-initiative"
                        element={isAuthenticated ? <CreateInitiativePage /> : <Navigate to="/login" replace />}
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App