import { useState } from "react"
import { deleteComment } from "../api/comment"

const CommentItem = ({ comment, currentUserId, onDeleted }) => {
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteComment(comment.id)
            onDeleted(comment.id)
        } catch (err) {
            console.error("Помилка при видаленні коментаря", err)
        }
    }

    return (
        <div className="bg-gray-100 p-3 rounded shadow-sm text-sm relative">
            <div className="font-semibold text-gray-800 mb-1">
                {comment.user_name} {comment.user_surname}
            </div>
            <div className="text-gray-700 whitespace-pre-line">{comment.content}</div>

            {currentUserId === comment.user_id && (
                <>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Видалити"
                    >
                        ✖
                    </button>

                    {showConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded shadow space-y-3 w-64">
                                <p className="text-sm text-gray-800">Ви точно хочете видалити цей коментар?</p>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowConfirm(false)} className="text-gray-600">Скасувати</button>
                                    <button onClick={handleDelete} className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700">Видалити</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default CommentItem