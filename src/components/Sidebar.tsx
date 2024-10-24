import React from 'react';
import { useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../assets/styles/Sidebar.css';

interface DrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function Sidebar({ open, handleDrawerClose }: DrawerProps) {
  const theme = useTheme();

  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      classes={{
        paper: open ? 'drawer-open' : 'drawer-close',
      }}
    >
      <div className="drawer-header">
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {SidebarData.map((item, index) => (
          <ListItem key={index} component={Link} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  );
}
