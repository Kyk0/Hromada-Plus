import { useEffect, useState } from "react"
import { getCommentsByTarget, createComment, deleteComment } from "../api/comment"
import { getCurrentUser } from "../api/user"

const CommentsSection = ({ targetType, targetId }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState(null)
    const [commentToDelete, setCommentToDelete] = useState(null)

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
            fetchComments()
        } catch (err) {
            setError(err.response?.data?.error || "Помилка при додаванні коментаря")
        }
    }

    const handleDelete = async () => {
        try {
            await deleteComment(commentToDelete)
            setComments(prev => prev.filter(c => c.id !== commentToDelete))
        } catch (err) {
            console.error("Помилка при видаленні коментаря", err)
        } finally {
            setCommentToDelete(null)
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
                        <div key={comment.id} className="bg-gray-100 rounded p-3 relative">
                            {user?.id === comment.user_id && (
                                <button
                                    onClick={() => setCommentToDelete(comment.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                                    title="Видалити"
                                >
                                    ✖
                                </button>
                            )}

                            <div className="text-xs text-gray-500 absolute top-2 left-3">
                                {new Date(comment.created_at).toLocaleString("uk-UA", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </div>

                            <div className="text-sm text-gray-700 whitespace-pre-line mt-4">
                                {comment.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {commentToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded shadow-md w-72 space-y-4">
                        <p className="text-gray-800 text-sm">Ви впевнені, що хочете видалити цей коментар?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setCommentToDelete(null)} className="text-gray-600">Скасувати</button>
                            <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Видалити</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommentsSection