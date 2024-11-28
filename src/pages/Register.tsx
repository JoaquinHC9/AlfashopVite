import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { Person, Email, Lock, Phone, CalendarToday, AddCircle } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import API_URL from "../config/config";
import { UserRegister } from "../models/User";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<UserRegister>({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    telefono: "",
    fechaNacimiento: new Date(),
  });

  const [error, setError] = useState<string | null>(null);
  const signIn = useSignIn(); // Para manejar el inicio de sesión automático
  const navigate = useNavigate(); // Para redirigir a otra ruta

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        fechaNacimiento: date,
      });
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/registrar`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        contrasena: formData.contrasena,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
      });

      // Si el registro devuelve un token, realiza el login automáticamente
      const token = response.data;
      if (token) {
        const loggedIn = signIn({
          token,
          expiresIn: 3600, // Expiración en segundos
          tokenType: "Bearer",
          authState: { email: formData.email },
        });

        if (loggedIn) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "El usuario se ha registrado y ha iniciado sesión automáticamente.",
          });
          navigate("/"); // Redirige a la página principal
        } else {
          throw new Error("Error al iniciar sesión automáticamente.");
        }
      } else {
        throw new Error("El servidor no devolvió un token.");
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      setError("Error al registrar usuario");
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error?.response?.data?.message || "Ocurrió un error inesperado.",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        backgroundColor: "white",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        width: "400px",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
      >
        Registro
      </Typography>
      {/* Campos de entrada */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Person sx={{ mr: 2, color: "primary.main" }} />
        <TextField
          name="nombre"
          label="Nombre"
          variant="outlined"
          fullWidth
          value={formData.nombre}
          onChange={handleInputChange}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Person sx={{ mr: 2, color: "primary.main" }} />
        <TextField
          name="apellido"
          label="Apellido"
          variant="outlined"
          fullWidth
          value={formData.apellido}
          onChange={handleInputChange}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Email sx={{ mr: 2, color: "primary.main" }} />
        <TextField
          name="email"
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleInputChange}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Lock sx={{ mr: 2, color: "primary.main" }} />
        <TextField
          name="contrasena"
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.contrasena}
          onChange={handleInputChange}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Phone sx={{ mr: 2, color: "primary.main" }} />
        <TextField
          name="telefono"
          label="Teléfono"
          variant="outlined"
          fullWidth
          value={formData.telefono}
          onChange={handleInputChange}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CalendarToday sx={{ mr: 2, color: "primary.main" }} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Fecha de Nacimiento"
            format="MM/dd/yyyy"
            value={formData.fechaNacimiento}
            onChange={handleDateChange}
            slots={{ textField: (props) => <TextField {...props} fullWidth /> }}
            slotProps={{ openPickerButton: { 'aria-label': 'Choose new calendar date' } }}
          />
        </LocalizationProvider>
      </Box>
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
        startIcon={<AddCircle />}
        sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
      >
        Registrarse
      </Button>
    </Container>
  );
};

export default Register;
