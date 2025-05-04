import { Center, Loader } from '@mantine/core';

export function Loading() {
  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <Loader />
    </Center>
  );
}
