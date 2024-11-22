import axios from 'axios';
import { useAuthUser } from 'react-auth-kit';

const BASE_URL = 'http://localhost:8080/v1/';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  (request) => {
    const auth = useAuthUser();
    const token = auth()?.token;  // Obtener el token del estado de react-auth-kit

    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

export default instance;
