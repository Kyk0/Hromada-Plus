import { useEffect, useState } from "react"
import { getAllInitiatives } from "../api/initiative"
import InitiativeMiniCard from "../components/InitiativeMiniCard"
import { getCurrentUser } from "../api/user"

const SearchPage = () => {
    const [initiatives, setInitiatives] = useState([])
    const [filtered, setFiltered] = useState([])
    const [keywords, setKeywords] = useState("")
    const [type, setType] = useState("")
    const [onlyMine, setOnlyMine] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        getAllInitiatives().then(setInitiatives)
        getCurrentUser().then(setUser)
    }, [])

    useEffect(() => {
        const kw = keywords.toLowerCase().trim()
        const results = initiatives.filter(i => {
            const matchesKeywords = !kw || i.keywords?.toLowerCase().includes(kw) || i.title.toLowerCase().includes(kw)
            const matchesType = !type || i.size === type
            const matchesHromada = !onlyMine || (user && i.hromada_id === user.hromada_id)
            return matchesKeywords && matchesType && matchesHromada
        })
        setFiltered(results)
    }, [keywords, type, onlyMine, initiatives, user])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-28 pb-10 px-4">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 text-center">Пошук ініціатив</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <input
                        type="text"
                        placeholder="Ключові слова"
                        className="border rounded px-3 py-2 w-full"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />

                    <select
                        className="border rounded px-3 py-2 w-full"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Усі типи</option>
                        <option value="локальна">Локальна</option>
                        <option value="амбіційна">Амбіційна</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={onlyMine}
                            onChange={(e) => setOnlyMine(e.target.checked)}
                        />
                        Лише з моєї громади
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((i) => (
                        <InitiativeMiniCard
                            key={i.id}
                            id={i.id}
                            title={i.title}
                            size={i.size}
                            description={i.description || ""}
                            image={i.image_urls?.[0]}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchPage