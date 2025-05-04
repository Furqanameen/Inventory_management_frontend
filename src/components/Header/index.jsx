import { useContext, useEffect, useState } from 'react';
import cx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Image,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppLogo } from '../../assets';
import { AuthContext } from '../../context/Auth/AuthContext';
import ProfileSwitcher from '../ProfileSwitcher';
import { getMenus } from './utils';
import classes from './Header.module.css';

const links = [
  { link: '#', label: 'Overview' },
  { link: '#', label: 'Patients' },
  { link: '#', label: 'Appointments' },
  { link: '#', label: 'Doctors' },
  { link: '#', label: 'Departments' },
  { link: '#', label: 'Employee' },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [active, setActive] = useState(links[0].label);
  const [menus, setMenus] = useState([]);

  const { user, logout, selectedProfile } = useContext(AuthContext);

  // const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const menusOptions = getMenus();
    setMenus(menusOptions);
  }, []); // selectedProfile

  const Items = () => {
    return (
      // <Group
      //   gap="xl"
      //   style={{ flexGrow: 1, justifyContent: 'center', paddingLeft: '30px', paddingRight: '30px' }}
      // >
      menus?.map((menuItem, index) => {
        if (menuItem?.label) {
          return (
            <Menu key={index} width={200} shadow="md">
              <Link
                key={menuItem.label}
                to={menuItem.href}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                <Menu.Item color="white">{menuItem.label}</Menu.Item>
              </Link>
            </Menu>
          );
        }

        return (
          <Menu key={index} width={200} shadow="md">
            <Menu.Target>
              <Button
                variant="subtle"
                color="white"
                // rightSection={<IconChevronDown size={16} />}
                style={{ fontWeight: 400, paddingLeft: '10px', paddingRight: '10px' }}
                className={cx(classes.link, active === menuItem.label && classes.active)}
              >
                {menuItem.title}
              </Button>
            </Menu.Target>
            <Menu.Dropdown withinPortal style={{ zIndex: 11111111 }}>
              {menuItem.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.href}
                  style={{
                    textDecoration: 'none',
                    color: 'gray',
                  }}
                >
                  <Menu.Item>{link.label}</Menu.Item>
                </Link>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      })
      // </Group>
    );
  };

  if (!user) return;

  const title = selectedProfile?.role?.title;

  return (
    <>
      <Box
        className={classes.header}
        // bg={pathname === '/'  ? 'transparent' : '#1B3C74'}
        bg="#1B3C74"
      >
        <Container className={classes.mainSection} size="xxl">
          <Group justify="space-between">
            <Link to="/">
              <Image src={AppLogo} alt="Logo" h={50} />
            </Link>

            <Group visibleFrom="md" style={{ fontFamily: 'Lexend, sans-serif' }}>
              <Items />
            </Group>

            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" c="white" />
              {/* <ActionIcon variant="subtle" color="white">
                <IconSearch size={24} />
              </ActionIcon> */}

              {/* <Menu
                width={200}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
              >
                <Menu.Target>
                  <ActionIcon variant="subtle" color="white">
                    <IconBell size={24} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Notifications</Menu.Label>
                  <Menu.Item>No new notifications</Menu.Item>
                </Menu.Dropdown>
              </Menu> */}

              <Menu
                width={300}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal={false}
                closeOnClickOutside
                closeOnItemClick={false}
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                  >
                    {/* <Group display={'block'}> */}
                    {/* <Avatar src={user.image} alt={user.name} radius="xl" size={20} /> */}
                    <Text
                      fw={500}
                      size="sm"
                      c="white"
                      lh={2}
                      mr={5}
                      className={classes.userNameOption}
                    >
                      {user.name}
                      {/* <br /> */}
                    </Text>
                    <Text>
                      {selectedProfile?.store?.displayName}{' '}
                      {title !== 'None' && title ? `| ${title}` : ''}
                    </Text>
                    {/* </Group> */}
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {/* <Menu.Item>Liked posts</Menu.Item>
                  <Menu.Item>Saved posts</Menu.Item>
                  <Menu.Item>Your comments</Menu.Item>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item>Account settings</Menu.Item>
                  <Menu.Item>Change account</Menu.Item> */}
                  <Menu.Item onClick={(e) => e.stopPropagation()}>
                    <ProfileSwitcher />
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    Logout
                  </Menu.Item>
                  {/* <Menu.Divider />
                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item>Pause subscription</Menu.Item>
                  <Menu.Item color="red">Delete account</Menu.Item> */}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Drawer for Mobile */}
      <Drawer
        opened={opened}
        onClose={toggle}
        position="left"
        size="sm"
        title="Menu"
        hiddenFrom="xs"
        classNames={{ content: opened ? classes.drawerOpen : '' }}
      >
        <Stack gap="sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.link}
              className={cx(classes.link, { [classes.active]: active === link.link })}
              data-active={active === link.link || undefined}
              onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                toggle();
              }}
            >
              {link.label}
            </a>
          ))}
        </Stack>
      </Drawer>
    </>
  );
}
