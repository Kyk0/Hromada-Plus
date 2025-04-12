import axios from "axios"

export const createInitiative = async (data) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/initiatives/create`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    } catch (err) {
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error)
        } else {
            throw new Error("Помилка підключення до сервера")
        }
    }
}

export const getMyInitiatives = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/initiatives/user/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
}

export const getInitiativeById = async (id) => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/initiatives/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
