import { useState } from "react"
import { changePassword } from "../api/user"

const ChangePasswordModal = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setMessage("")
        setSuccess(false)

        try {
            const res = await changePassword(currentPassword, newPassword)
            setMessage(res.message)
            setSuccess(true)
            setCurrentPassword("")
            setNewPassword("")
        } catch (err) {
            setMessage(err.message)
            setSuccess(false)
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">
                    ×
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Змінити пароль</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Поточний пароль</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Новий пароль</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-60"
                    >
                        {loading ? "Збереження..." : "Зберегти пароль"}
                    </button>
                    {message && (
                        <div className={`text-sm mt-2 ${success ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordModal