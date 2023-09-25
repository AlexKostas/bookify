import axios from 'axios';

const BASE_API_URL = '/api';

export default axios.create({
    baseURL: BASE_API_URL,
    headers: {'Content-Type': 'application/json'}
});

export const axiosPrivate = axios.create({
    baseURL: BASE_API_URL,
    headers: {'Content-Type': 'application/json'},
})