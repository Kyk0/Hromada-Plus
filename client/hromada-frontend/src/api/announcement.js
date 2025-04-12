import axios from "axios"

const API_URL = `${process.env.REACT_APP_API_URL}/api/announcements`

export const getAllAnnouncements = async () => {
    const res = await axios.get(API_URL)
    return res.data
}