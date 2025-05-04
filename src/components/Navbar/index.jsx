import {
  IconBrandProducthunt,
  IconBuildingStore,
  IconLocation,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Group, Image, ScrollArea } from '@mantine/core';
import { AppLogo } from '../../assets';
import { useAuth } from '../../context/Auth/AuthProvider';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import ProfileSwitcher from '../ProfileSwitcher';
import { UserButton } from '../UserButton/UserButton';
import classes from './Navbar.module.css';

const getNavItems = ({ user, selectedProfile }) => {
  const isAdmin = selectedProfile?.role === 'admin';
  const isSuperAdmin = user?.admin || selectedProfile?.role === 'superadmin';
  // const isStaff = selectedProfile?.role === 'staff';

  return [
    {
      label: 'Profile',
      link: '/',
      icon: IconUserCircle,
      hasPermission: !!selectedProfile,
    },
    {
      label: 'Locations',
      link: '/location',
      icon: IconLocation,
      hasPermission: isSuperAdmin,
    },
    {
      label: 'Stores',
      link: '/store',
      icon: IconBuildingStore,
      hasPermission: isSuperAdmin,
    },
    {
      label: 'Products',
      link: '/product',
      icon: IconBrandProducthunt,
      hasPermission: !!selectedProfile,
    },
    {
      label: 'Users',
      link: '/user',
      icon: IconUsers,
      hasPermission: !!selectedProfile && (isAdmin || isSuperAdmin),
    },
  ];
};

export function Navbar() {
  // { toggle, opened }

  const { user, selectedProfile } = useAuth();

  if (!user) return null;

  const links = getNavItems({ user, selectedProfile })
    .filter((nav) => nav.hasPermission)
    .map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group h="100%" px="md">
          {/* <Burger opened={opened} onClick={toggle} size="sm" /> */}
          {/* <Logo size={30} /> */}
          <Link to="/">
            <Image src={AppLogo} alt="Logo" h={50} />
          </Link>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <ProfileSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
