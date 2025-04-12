import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const InitiativePage = () => {
    const { id } = useParams()
    const [initiative, setInitiative] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInitiative = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/initiatives/${id}`)
                setInitiative(res.data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
            }
        }

        fetchInitiative()
    }, [id])

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

    return (
        <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{initiative.title}</h1>
            <p className="text-gray-700 mb-2">Тип: {initiative.size}</p>
            <p className="text-gray-700 mb-2">Опис: {initiative.description}</p>
            <p className="text-gray-700 mb-2">Адреса: {initiative.address || "—"}</p>
            <p className="text-gray-700 mb-2">Підтримали: {initiative.support_count}</p>

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
    )
}

export default InitiativePage