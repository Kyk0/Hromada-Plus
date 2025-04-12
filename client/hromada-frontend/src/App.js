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

    const protect = (Component) => (
        isAuthenticated ? <Component /> : <Navigate to="/login" replace />
    )

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Навбар + контент внутри */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={protect(SearchPage)} />
                    <Route path="/initiatives/:id" element={protect(InitiativePage)} />
                    <Route path="/profile" element={protect(ProfilePage)} />
                    <Route path="/create-initiative" element={protect(CreateInitiativePage)} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App