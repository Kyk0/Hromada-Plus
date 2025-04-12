import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API_URL}/api/comments`

export const createComment = async ({ target_type, target_id, text }) => {
    const token = localStorage.getItem("token")
    const res = await axios.post(
        `${API_URL}/create`,
        { target_type, target_id, text },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}

export const deleteComment = async (id) => {
    const token = localStorage.getItem("token")
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getMyComments = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${API_URL}/mine`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getCommentsByTarget = async (target_type, target_id) => {
    const res = await axios.get(`${API_URL}/${target_type}/${target_id}`)
    return res.data
}
