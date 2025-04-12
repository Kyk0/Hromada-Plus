import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getAllInitiatives } from "../api/initiative"
import { fetchHromadas } from "../api/hromadas"

const HomePage = () => {
    const navigate = useNavigate()
    const [initiatives, setInitiatives] = useState([])
    const [hromadas, setHromadas] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const [allInitiatives, allHromadas] = await Promise.all([
                getAllInitiatives(),
                fetchHromadas()
            ])

            const sorted = [...allInitiatives].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            setInitiatives(sorted.slice(0, 4)) // тільки 4 останні
            setHromadas(allHromadas)
        }

        fetchData()
    }, [])

    const getHromadaName = (id) => {
        return hromadas.find(h => h.id === id)?.name || "Невідома громада"
    }

    return (
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto space-y-14">
            <section className="text-center space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">Громада+</h1>
                <p className="text-gray-700 max-w-xl mx-auto">
                    Онлайн-платформа для участі у житті вашої громади: створюйте ініціативи, голосуйте та змінюйте середовище навколо.
                </p>
                <button
                    onClick={() => navigate("/search")}
                    className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Переглянути всі ініціативи
                </button>
            </section>

            {initiatives.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Останні ініціативи</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {initiatives.map((i) => (
                            <div
                                key={i.id}
                                onClick={() => navigate(`/initiatives/${i.id}`)}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition p-4 space-y-2"
                            >
                                <h3 className="text-lg font-bold text-gray-900 truncate">{i.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{i.description}</p>
                                <div className="text-xs text-gray-500">
                                    {i.size === 'локальна' ? 'Локальна ініціатива' : 'Амбіційна ініціатива'} · {getHromadaName(i.hromada_id)}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(i.created_at).toLocaleDateString("uk-UA")}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="bg-blue-100 rounded-lg px-6 py-10 text-center space-y-3 shadow">
                <h2 className="text-2xl font-semibold text-blue-800">Чому саме Громада+?</h2>
                <p className="max-w-2xl mx-auto text-gray-700">
                    Платформа створена для прозорої та зручної участі мешканців у вирішенні локальних питань. Кожен голос важливий.
                </p>
            </section>

            <section className="text-center">
                <button
                    onClick={() => navigate("/create-initiative")}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Додати ініціативу
                </button>
            </section>

            <section className="text-center text-sm text-gray-500 pt-10">
                &copy; {new Date().getFullYear()} Громада+. Всі права захищені.
            </section>
        </div>
    )
}

export default HomePage