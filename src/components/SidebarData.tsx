import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
export interface SidebarItem {
  title: string;
  icon: JSX.Element;
  link: string;
}

export const SidebarData: SidebarItem[] = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    link: '/',
  },
  {
    title: 'Carrito',
    icon: <ShoppingCartIcon />,
    link: '/Cart',
  },
  {
    title: 'Categorias',
    icon: <CategoryIcon />,
    link: '/categories',
  },
  {
    title: 'Perfil',
    icon: <PeopleIcon />,
    link: '/customerinfo',
  },
  {
    title: 'Pagos',
    icon: <PaymentsIcon />,
    link: '/paymentinfo',
  },
];
