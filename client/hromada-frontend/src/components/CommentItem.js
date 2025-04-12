const CommentItem = ({ comment }) => {
    return (
        <div className="bg-gray-100 p-3 rounded shadow-sm text-sm">
            <div className="font-semibold text-gray-800 mb-1">
                {comment.user_name} {comment.user_surname}
            </div>
            <div className="text-gray-700">{comment.content}</div>
        </div>
    )
}

export default CommentItem