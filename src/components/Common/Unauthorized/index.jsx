import { useContext } from 'react';
import { Box, Card, Center, Grid, Loader, Title } from '@mantine/core';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { Container } from '../../Container/Container';
import classes from '../../Header/Header.module.css';

const Unauthorized = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Center w="100%" h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container py="xl" className={classes.container} size="xl">
      <Box pos="relative">
        <Card shadow="lg" radius="lg" className={classes.card} padding="xl">
          <Grid align="center" justify="space-between">
            <Grid.Col>
              {/* <Group> */}
              <Title
                fz="xl"
                fw={700}
                className={classes.cardTitle}
                c="red"
                style={{ fontFamily: 'Lexend, sans-serif' }}
              >
                Unauthorized
              </Title>
              <br />
              <Title
                fz="xl"
                fw={600}
                className={classes.cardTitle}
                color="blue"
                style={{ fontFamily: 'Lexend, sans-serif' }}
              >
                You do not have permission to view this page
              </Title>
              {/* </Group> */}
            </Grid.Col>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default Unauthorized;
