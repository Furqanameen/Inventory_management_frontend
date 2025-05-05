import { Box, Card, Grid, Group, LoadingOverlay, Pagination, Title } from '@mantine/core';
import Unauthorized from '../../../components/Common/Unauthorized';
import { Container } from '../../../components/Container/Container';
import { useAuth } from '../../../context/Auth/AuthProvider';
import { useStock } from '../../../hooks/useStock';
// import { useProduct } from '../../../context/Product/provider';
import AddStock from './AddStock';
import ProductStocksTable from './table';
import classes from '../../../../src/components/Home/HomePage.module.css';

const StockTable = () => {
  const {
    page,
    setPage,
    perPage,
    total,
    fetchLoading,
    data,
    sortBy,
    setSorting,
    reverseSortDirection,
    loading,
    addRecord,
    getRecordById,
  } = useStock();
  const { permissions } = useAuth();

  //   const navigate = useNavigate();

  //   const handleSearchChange = (e) => {
  //     setSearchQuery(e.target.value);
  //   };

  //   const handleRedirect = () => {
  //     return navigate('/product/add');
  //   };

  if (!permissions.stocks) {
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
                  Stock Management
                </Title>
                {/* <Button
                  color="blue"
                  radius="md"
                  size="md"
                  className={classes.filterButton}
                  style={{ fontFamily: 'Lexend, sans-serif' }}
                  onClick={handleRedirect}
                >
                  Add Product
                </Button> */}
              </Group>
            </Grid.Col>

            {/* Search Input */}
            {/* <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                placeholder="Search product..."
                icon={<IconSearch size="1.2rem" color="gray" />}
                size="md"
                radius="md"
                className={classes.searchInput}
                disabled={loading}
                onChange={handleSearchChange}
              />
            </Grid.Col> */}
          </Grid>

          <AddStock loading={loading} addRecord={addRecord} getRecordById={getRecordById} />

          <Title
            fz="xl"
            fw={600}
            className={classes.cardTitle}
            color="blue"
            style={{ fontFamily: 'Lexend, sans-serif' }}
          >
            Stocks List
          </Title>

          <ProductStocksTable
            data={data}
            sortBy={sortBy}
            setSorting={setSorting}
            reverseSortDirection={reverseSortDirection}
          />

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

export default StockTable;
