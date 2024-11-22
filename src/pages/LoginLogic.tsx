import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';
import API_URL from '../config/config';

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}
// Lógica de login compartida
export const handleLogin = async (
  email: string,
  password: string,
  signIn: any,
  onSuccess: () => void,
  onFailure: (error: string) => void
) => {
  try {
    // Realizamos la petición para obtener el token
    const response = await axios.post(`${API_URL}/v1/auth/login`, {
      email: email,
      contrasena: password,
    });

    const token = response.data;
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const customerId = decodedToken.userId;

    // Usamos react-auth-kit para guardar el token en el estado global
    const auth = signIn({
      token: token,
      expiresIn: 3600,
      tokenType: "Bearer",
      authState: { username: email, customerId: customerId },
    });

    // Verificamos si el inicio de sesión fue exitoso
    if (auth) {
      onSuccess(); // Callback de éxito
    } else {
      onFailure('Login fallido'); // Callback de fallo
    }
  } catch (error) {
    onFailure('Credenciales inválidas');
    console.error('Login Error:', error);
  }
};
