import { useEffect, useState } from "react"
import { getCommentsByTarget, createComment } from "../api/comment"
import { getCurrentUser } from "../api/user"

const CommentsSection = ({ targetType, targetId }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState(null)

    const fetchComments = async () => {
        try {
            const data = await getCommentsByTarget(targetType, targetId)
            setComments(data)
        } catch (err) {
            console.error("Помилка при завантаженні коментарів", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
        getCurrentUser().then(setUser).catch(() => {})
    }, [targetType, targetId])

    const handleSubmit = async () => {
        const text = newComment.trim()
        if (text.length < 3) {
            setError("Коментар повинен містити щонайменше 3 символи")
            return
        }

        try {
            await createComment({ target_type: targetType, target_id: targetId, text })
            setNewComment("")
            setError("")
            fetchComments() // ⬅️ Обновляем список после успешной отправки
        } catch (err) {
            setError(err.response?.data?.error || "Помилка при додаванні коментаря")
        }
    }

    return (
        <div className="mt-10 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Коментарі</h2>

            <div className="space-y-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишіть коментар..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Надіслати
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            {loading ? (
                <p className="text-gray-500">Завантаження коментарів...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">Коментарів ще немає</p>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-100 rounded p-3">
                            <div className="text-sm font-semibold text-gray-800">
                                {comment.user_name || "Користувач"}
                            </div>
                            <div className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                                {comment.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentsSection