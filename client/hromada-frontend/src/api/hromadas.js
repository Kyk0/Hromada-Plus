import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/hromadas";

export const fetchHromadas = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};