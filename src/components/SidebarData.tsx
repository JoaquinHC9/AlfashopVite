import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';

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
    title: 'Shopping Cart',
    icon: <ShoppingCartIcon />,
    link: '/Cart',
  },
  {
    title: 'Categories',
    icon: <CategoryIcon />,
    link: '/categories',
  },
  {
    title: 'Customer Info',
    icon: <PeopleIcon />,
    link: '/customerinfo',
  },
];
