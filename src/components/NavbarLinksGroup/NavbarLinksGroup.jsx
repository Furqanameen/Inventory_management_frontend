/* eslint-disable react/prop-types */
import { useState } from 'react';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';

export function LinksGroup({ icon: Icon, label, initiallyOpened, link = null, links }) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const { pathname } = useLocation();

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  const isProfilePage = pathname === '/';

  const itemSelected = (link) => {
    if (isProfilePage) {
      return pathname === link;
    }
    if (link === '/') {
      return pathname === '/';
    }
    return pathname.includes(link);
  };

  const itemStyle = {
    backgroundColor: itemSelected(link) ? 'var(--mantine-color-blue-1)' : 'transparent',
  };

if (link) {
    return (
      <Link
        key={link}
        to={link}
        style={{
          textDecoration: 'none',
          color: 'black',
        }}
      >
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={classes.control}
          style={itemStyle}
        >
          <Group justify="space-between" gap={0}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          </Group>
        </UnstyledButton>
      </Link>
    );
  }

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  links: [
    { label: 'Upcoming releases', link: '/' },
    { label: 'Previous releases', link: '/' },
    { label: 'Releases schedule', link: '/' },
  ],
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
}
