import { useEffect, useState } from "react"
import axios from "axios"
import { updateUserProfile } from "../api/user"
import { getMyInitiatives } from "../api/initiative"
import { getMySupportedInitiatives } from "../api/support"
import ChangePasswordModal from "../components/ChangePasswordModal"
import InitiativeMiniCard from "../components/InitiativeMiniCard"

const ProfilePage = () => {
    const [user, setUser] = useState(null)
    const [hromadas, setHromadas] = useState([])
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ name: "", surname: "", email: "" })
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [myInitiatives, setMyInitiatives] = useState([])
    const [supportedInitiatives, setSupportedInitiatives] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")

                const [userRes, hromadasRes, mineRes, supportedRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/hromadas`),
                    getMyInitiatives(),
                    getMySupportedInitiatives()
                ])

                setUser(userRes.data)
                setForm({
                    name: userRes.data.name,
                    surname: userRes.data.surname,
                    email: userRes.data.email,
                })
                setHromadas(hromadasRes.data)
                setMyInitiatives(mineRes)
                setSupportedInitiatives(supportedRes)
                setLoading(false)
            } catch {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSave = async () => {
        setMessage("")
        try {
            await updateUserProfile(form)
            setUser((prev) => ({ ...prev, ...form }))
            setEditing(false)
            setMessage("Профіль успішно оновлено")
        } catch (err) {
            setMessage(err.message)
        }
    }

    const hromadaName = hromadas.find(h => h.id === user?.hromada_id)?.name || "Невідома громада"

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-gray-600 text-lg">Завантаження...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center pt-32 px-4">
            <div className="w-full max-w-4xl bg-white rounded-xl p-8 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="min-w-[96px] min-h-[96px] w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl shrink-0">
                            👤
                        </div>
                        <div className="text-base sm:text-lg text-gray-800 flex-1 space-y-3 w-full">
                            {editing ? (
                                <>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Імʼя</label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Прізвище</label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.surname}
                                            onChange={(e) => setForm({ ...form, surname: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div><strong>Імʼя:</strong> {user.name}</div>
                                    <div><strong>Прізвище:</strong> {user.surname}</div>
                                    <div><strong>Email:</strong> {user.email}</div>
                                </>
                            )}
                            <div><strong>Громада:</strong> {hromadaName}</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:w-52">
                        {editing ? (
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition text-sm sm:text-base"
                            >
                                Зберегти
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm sm:text-base"
                            >
                                Редагувати профіль
                            </button>
                        )}
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm sm:text-base"
                        >
                            Змінити пароль
                        </button>
                        {message && (
                            <div className="text-sm mt-1 text-green-600">{message}</div>
                        )}
                    </div>
                </div>

                <div className="space-y-10">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-center">Мої ініціативи</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            {myInitiatives.length > 0 ? (
                                myInitiatives.map((i) => (
                                    <InitiativeMiniCard
                                        key={i.id}
                                        id={i.id}
                                        title={i.title}
                                        size={i.size}
                                        description={i.description || ""}
                                        image={i.image_urls?.[0]}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Ініціатив немає</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-center">Підтримані ініціативи</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            {supportedInitiatives.length > 0 ? (
                                supportedInitiatives.map((i) => (
                                    <InitiativeMiniCard
                                        key={i.id}
                                        id={i.id}
                                        title={i.title}
                                        size={i.size}
                                        description={i.description || ""}
                                        image={i.image_urls?.[0]}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Немає підтриманих ініціатив</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    )
}

export default ProfilePage
