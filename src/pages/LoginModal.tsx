// LoginModal.tsx
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useSignIn } from 'react-auth-kit';
import API_URL from '../config/config';
import { Helmet } from 'react-helmet';
import {toast} from 'react-toastify';

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  
  const signIn = useSignIn();

  const loginAPI = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        username: username,
        password: password,
      });      
      return response.data;
    } catch (error) {
      console.log('Login Error:', error);
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
          tokenType: 'Bearer',
          authState: { username: username, customer_id: customer_id },
        });
        if (auth) {
          toast.success('Login Exitoso');
          handleClose();
        } else {
          setError('Login fallido');
        }
      }
    } catch (error) {
      setError('Credenciales inválidas');
      console.error('Login Error:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-login-title"
      aria-describedby="modal-login-description"
    >        
      <Box sx={modalStyle}>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Typography variant="h4" align="center" id="modal-login-title">
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
      </Box>
    </Modal>
  );
};

export default LoginModal;
