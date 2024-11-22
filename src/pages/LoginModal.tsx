// LoginModal.tsx
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useSignIn } from 'react-auth-kit';
import { handleLogin } from './LoginLogic';
import { toast } from 'react-toastify';

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
  const [email, setEmail] = useState('');
  const [contra, setContra] = useState('');
  const [error, setError] = useState('');
  const signIn = useSignIn();

  const onSuccess = () => {
    toast.success('Login Exitoso');
    handleClose();
  };

  const onFailure = (error: string) => {
    setError(error);
  };

  const handleLoginClick = () => {
    handleLogin(email, contra, signIn, onSuccess, onFailure);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h4" align="center">Iniciar sesión</Typography>
        <TextField
          label="Usuario"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={contra}
          onChange={(e) => setContra(e.target.value)}
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleLoginClick}>Iniciar sesión</Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
