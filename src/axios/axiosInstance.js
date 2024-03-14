import axios from 'axios'

// .env variable importing
const apiUrl = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    // headers: {
    //     'Content-Type': "application/json"
    // },
    
})

export default axiosInstance