import axios from "axios"

export const getMySupportedInitiatives = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/initiative-supports/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
}

const API_URL = `${process.env.REACT_APP_API_URL}/api/initiative-supports`;

export const supportInitiative = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const unsupportInitiative = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
