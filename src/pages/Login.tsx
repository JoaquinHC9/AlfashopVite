import { jwtDecode, JwtPayload } from "jwt-decode";
import { useSignIn } from 'react-auth-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import API_URL from '../config/config';
import { Helmet } from "react-helmet";
// Extiende la interfaz JwtPayload para incluir userId
interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  
  const signIn = useSignIn();

  const loginAPI = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        username: username,
        password: password,
      });      
      return response.data;
    } catch (error) {
      console.log("Login Error:", error);
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      const data = await loginAPI();      
      if (data) {
        const token = data;
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const customer_id = decodedToken.userId;        
        const auth = signIn({
          token: token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { username: username, customer_id: customer_id },
        });

        if (auth) {
          navigate("/");
        } else {
          setError("Login fallido");
        }
      }
    } catch (error) {
      setError("Credenciales inválidas");
      console.error("Login Error:", error);
    }
  };

  return (    
    <Container maxWidth="sm">
      <Helmet>
      <title>Login</title>
      </Helmet>
      <Typography variant="h4" align="center">
        Iniciar sesión
      </Typography>
      <TextField
        label="Usuario"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Contraseña"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Iniciar sesión
      </Button>
    </Container>    
  );
}
