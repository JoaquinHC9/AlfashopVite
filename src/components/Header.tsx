// Header.tsx
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { useSignOut, useAuthUser } from 'react-auth-kit';
import LoginModal from '../pages/LoginModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de react-toastify
import '../assets/styles/AppBar.css'; // Importar el archivo CSS

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>();

interface CustomAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const Header: React.FC<CustomAppBarProps> = ({ open, handleDrawerOpen }) => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const signOut = useSignOut();  
  const auth = useAuthUser(); // Hook para verificar la autenticación

  const openLoginModal = () => {
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
  };

  const logout = () => {
    signOut();
    toast.success('Logout Exitoso');
  };

  return (
    <AppBar position="fixed" open={open} className={open ? 'dashboard-appbar open' : 'dashboard-appbar'}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Compuya
        </Typography>
        {auth() ? (
          <Button color="inherit" onClick={logout}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={openLoginModal}>Login</Button>
        )}
      </Toolbar>
      <LoginModal open={isLoginOpen} handleClose={closeLoginModal} />
    </AppBar>
  );
};

export default Header;
