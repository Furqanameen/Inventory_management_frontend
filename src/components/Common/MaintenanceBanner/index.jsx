import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, Flex, Text } from '@mantine/core';

function MaintenanceBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Flex
      w="100%"
      justify="center"
      align="center"
      bg="white"
      py="sm"
      style={{
        padding: '8px 0',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <Alert
        icon={<IconAlertTriangle size="2rem" />}
        title="Website is currently in maintenance"
        color="yellow"
        withCloseButton
        radius="md"
        px="xl"
        onClose={() => {
          setVisible(false);
        }}
      >
        <Text c="black">Some features may not work. 👷‍♂️</Text>
      </Alert>
    </Flex>
  );
}

export default MaintenanceBanner;
