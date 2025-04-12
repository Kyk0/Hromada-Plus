import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { getCurrentUser } from "../api/user"
import { getMySupportedInitiatives, supportInitiative, unsupportInitiative } from "../api/support"

const InitiativePage = () => {
    const { id } = useParams()
    const [initiative, setInitiative] = useState(null)
    const [user, setUser] = useState(null)
    const [hromadas, setHromadas] = useState([])
    const [supported, setSupported] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [initiativeRes, userRes, hromadasRes, supportedRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/initiatives/${id}`),
                    getCurrentUser(),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/hromadas`),
                    getMySupportedInitiatives()
                ])

                setInitiative(initiativeRes.data)
                setUser(userRes)
                setHromadas(hromadasRes.data)

                const alreadySupported = supportedRes.some((item) => item.id === parseInt(id))
                setSupported(alreadySupported)
            } catch {
                // nothing
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleSupportToggle = async () => {
        if (!user || !initiative) return

        try {
            if (supported) {
                await unsupportInitiative(id)
            } else {
                await supportInitiative(id)
            }
            window.location.reload()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-gray-600 text-lg">Завантаження...</div>
            </div>
        )
    }

    if (!initiative) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-red-600 text-lg">Ініціативу не знайдено</div>
            </div>
        )
    }

    const canSupport = user && user.hromada_id === initiative.hromada_id
    const hromadaName = hromadas.find(h => h.id === initiative.hromada_id)?.name || "Невідома громада"

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 px-4 pb-16 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-xl p-8 space-y-6 shadow">
                <h1 className="text-2xl font-bold text-center text-blue-800">{initiative.title}</h1>

                {initiative.image_urls?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {initiative.image_urls.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt="initiative"
                                className="w-full h-48 object-cover rounded border"
                            />
                        ))}
                    </div>
                )}

                <div className="space-y-2 text-gray-700">
                    <p><strong>Тип:</strong> {initiative.size === 'локальна' ? 'Локальна' : 'Амбіційна'}</p>
                    <p><strong>Опис:</strong> {initiative.description}</p>
                    <p><strong>Адреса:</strong> {initiative.address || "—"}</p>
                    <p><strong>Громада:</strong> {hromadaName}</p>
                    <p><strong>Підтримали:</strong> {initiative.support_count}</p>
                </div>

                {canSupport && (
                    <div className="text-center">
                        <button
                            onClick={handleSupportToggle}
                            className={`mt-4 px-6 py-2 text-white rounded-lg shadow transition ${supported ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {supported ? 'Відмінити підтримку' : 'Підтримати'}
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Коментарі</h2>
                    {initiative.comments?.length > 0 ? (
                        <ul className="space-y-2">
                            {initiative.comments.map((comment) => (
                                <li key={comment.id} className="bg-gray-100 p-2 rounded">
                                    {comment.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Коментарів ще немає</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InitiativePage