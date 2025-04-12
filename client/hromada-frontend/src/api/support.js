import axios from "axios"

export const getMySupportedInitiatives = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/initiative-supports/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
}