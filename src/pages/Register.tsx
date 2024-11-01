import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";  // Import axios if not already imported
import { UserRegister } from "../models/User";
import Swal from "sweetalert2";
import API_URL from '../config/config';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<UserRegister>({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    telefono:"",
    fechaNacimiento: new Date()
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/registrar`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento
      });
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario se ha registrado correctamente.',
      });
      console.log(response);
    } catch (error) {
      console.error("Register Error:", error);
      setError("Error al registrar usuario");
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'El correo ya se encuentra registrado en el sistema',
      });
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Registro
      </Typography>
      <TextField
        name="nombre"
        label="Nombre"
        variant="outlined"
        fullWidth
        value={formData.nombre}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        name="apellido"
        label="Apellido"
        variant="outlined"
        fullWidth
        value={formData.apellido}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        name="email"
        label="Correo electrónico"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        name="contra"
        label="Contraseña"
        type="password"
        variant="outlined"
        fullWidth
        value={formData.contrasena}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        name="telefono"
        label="Telefono"
        variant="outlined"
        fullWidth
        value={formData.telefono}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        name="fechaNacimiento"
        label="Fecha Nacimiento"
        type="date"
        variant="outlined"
        fullWidth
        value={formData.fechaNacimiento.toISOString().substring(0, 10)}
        onChange={handleInputChange}
        margin="normal"
      />      
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
      >
        Registrarse
      </Button>
    </Container>
  );
};

export default Register;
