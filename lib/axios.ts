import Axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

const axios = Axios.create({
    baseURL: backendUrl,
})

export default axios