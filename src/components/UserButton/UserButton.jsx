import { useContext } from 'react';
import { Box, Button, Group, Text, UnstyledButton } from '@mantine/core';
import { AuthContext } from '../../context/Auth/AuthContext';
import classes from './UserButton.module.css';

export function UserButton() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <UnstyledButton className={classes.user}>
      <Group justify="space-between" align="center" style={{ width: '100%' }} pb="xs">
        <Group wrap="nowrap">
          {/* <Avatar radius="xl">{user?.name?.charAt(0).toUpperCase()}</Avatar> */}

          <Box pl="md">
            <Text size="sm" fw={500}>
              {user.name}
            </Text>
            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </Box>
        </Group>

        <Button size="xs" variant="light" color="red" onClick={logout} mr="xs">
          Logout
        </Button>
      </Group>
    </UnstyledButton>
  );
}

// import { useContext } from 'react';
// import { IconChevronRight } from '@tabler/icons-react';
// import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
// import { AuthContext } from '../../context/Auth/AuthContext';
// import classes from './UserButton.module.css';

// export function UserButton() {
//   const { user, logout, selectedProfile } = useContext(AuthContext);

//   if (!user) return null;

//   return (
//     <UnstyledButton className={classes.user}>
//       <Group>
//         <Avatar radius="xl">{user?.name?.charAt(0).toUpperCase()}</Avatar>

//         <div style={{ flex: 1 }}>
//           <Text size="sm" fw={500}>
//             {user.name}
//           </Text>

//           <Text c="dimmed" size="xs">
//             {user.email}
//           </Text>
//         </div>

//         <IconChevronRight size={14} stroke={1.5} />
//       </Group>
//     </UnstyledButton>
//   );
// }
