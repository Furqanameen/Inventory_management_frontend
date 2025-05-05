import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  Pagination,
  TextInput,
  Title,
} from '@mantine/core';
import Unauthorized from '../../components/Common/Unauthorized';
import { Container } from '../../components/Container/Container';
import { useAuth } from '../../context/Auth/AuthProvider';
import { useStore } from '../../context/Store/provider';
import StoresTable from './table';
import classes from '../../../src/components/Home/HomePage.module.css';

const StoreTable = () => {
  const { setSearchQuery, loading, page, setPage, perPage, total, fetchLoading } = useStore();
  const { permissions } = useAuth();

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRedirect = () => {
    return navigate('/store/add');
  };

  if (!permissions.stores) {
    return <Unauthorized />;
  }

  return (
    <Container py="xl" className={classes.container} size="xl">
      <Box pos="relative">
        <LoadingOverlay
          visible={fetchLoading}
          zIndex={1000}
          overlayProps={{
            radius: 'sm',
            //  blur: 1
          }}
        />
        <Card shadow="lg" radius="lg" className={classes.card} padding="xl">
          <Grid align="center" justify="space-between">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group>
                <Title
                  fz="xl"
                  fw={600}
                  className={classes.cardTitle}
                  color="blue"
                  style={{ fontFamily: 'Lexend, sans-serif' }}
                >
                  All Stores
                </Title>
                <Button
                  color="blue"
                  radius="md"
                  size="md"
                  className={classes.filterButton}
                  style={{ fontFamily: 'Lexend, sans-serif' }}
                  onClick={handleRedirect}
                >
                  {/* <IconPlus size="1rem" /> */}
                  Add Store
                </Button>
              </Group>
            </Grid.Col>
            {/* <Grid.Col span={{ base: 12, md: 2 }} ta="start">
            
          </Grid.Col> */}

            {/* Search Input */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                placeholder="Search store..."
                icon={<IconSearch size="1.2rem" color="gray" />}
                size="md"
                radius="md"
                className={classes.searchInput}
                disabled={loading}
                onChange={handleSearchChange}
              />
            </Grid.Col>
          </Grid>

          <StoresTable />

          <Group mt="md" w="100%" justify="center">
            <Pagination
              // w="100%"
              total={Math.ceil(total / perPage)}
              // total={count / perPage} // Calculate total pages
              value={page}
              onChange={setPage}
              // size="md"
              // radius="md"
              // boundaries={count / perPage}
              // withControls
              // // withEdges
              // withPages
              // siblings={1}
            />
          </Group>
        </Card>
      </Box>
    </Container>
  );
};

export default StoreTable;
