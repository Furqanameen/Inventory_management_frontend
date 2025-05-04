/* eslint-disable react/prop-types */
import { AppShell as MantineAppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from '../Navbar';

export function AppShell(props) {
  // const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineAppShell
      padding="md"
      header={{ height: 0 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        // collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      {/* <MantineAppShell.Header>
        <Burger onClick={toggleDesktop} visibleFrom="sm"></Burger>
        <Burger onClick={toggleMobile} hiddenFrom="sm"></Burger>
      </MantineAppShell.Header> */}
      <MantineAppShell.Navbar>
        <Navbar toggle={toggleDesktop} opened={desktopOpened} />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{props?.children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
