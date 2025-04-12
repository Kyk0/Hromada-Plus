import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/users";

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        return res.data.token;
    } catch (err) {
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        } else {
            throw new Error("Помилка підключення до сервера");
        }
    }
};

export const registerUser = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/register`, data);
        return res.data;
    } catch (err) {
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        } else {
            throw new Error("Помилка підключення до сервера");
        }
    }
};


export const updateUserProfile = async (data) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/users/me`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
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

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/users/change-password`,
            { currentPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
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

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return res.data
}


