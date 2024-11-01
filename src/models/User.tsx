//user.tsx
export type UserProfileToken = {
    userName: string;
    email: string;
    token: string;
  };
  
  export type UserRegister = {
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
    telefono: string;
    fechaNacimiento: Date;
  };  