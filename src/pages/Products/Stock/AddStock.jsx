/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CheckIcon,
  Grid,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../../../context/Auth/AuthProvider';
import { useProduct } from '../../../context/Product/provider';

const AddStock = ({ loading, addRecord, getRecordById }) => {
  const [error, setError] = useState(null);
  const productProvider = useProduct();
  const { id } = useParams();
  const { permissions } = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      quantity: null,
      stockType: 'IN',
      comment: '',
    },
  });

  const fetchProductStock = async () => {
    if (!permissions.products) {
      console.warn('User does not have permission to fetch product stock');
      return;
    }

    await productProvider.getRecordById(id);

    await getRecordById(id);

    // if (res) {
    //   form.setFieldValue('quantity', res.quantity);
    //   form.setFieldValue('stockType', res.stockType);
    //   form.setFieldValue('comment', res?.comment || '');
    // }
  };

  useEffect(() => {
    if (id) {
      fetchProductStock();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (!values.stockType) {
      setError('Stock type is required');
      return;
    }

    if (!values.quantity) {
      setError('Quantity is required');
      return;
    }

    if (values.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    setError(null);
    try {
      const res = await addRecord({ ...values, productId: id });

      if (res.success) {
        // return navigate(`/products/${id}/stock`);
        form.reset();
        setError(null);
        await fetchProductStock();
        return;
      }
      setError(res.message || 'Something went wrong');
    } catch (error) {
      console.error('Error adding product', error);
      // notifications.show({ message: 'Something went wrong!' });
    }
  };

  return (
    <Stack align="center" justify="center" my={20}>
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
        <Paper shadow="lg" p="lg" withBorder>
          <Title
            order={2}
            align="center"
            my="sm"
            // style={{ marginBottom: 20, color: '#2c3e50' }}
          >
            Add Stock
          </Title>

          <Grid gutter="md" columns={12}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                withAsterisk
                label="Quantity"
                placeholder="Enter quantity"
                key={form.key('quantity')}
                min={0}
                required
                icon={<CheckIcon />}
                styles={{
                  input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                  label: { fontSize: 18 },
                }}
                {...form.getInputProps('quantity')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                key={form.key('stockType')}
                required
                withAsterisk
                label="Stock Type"
                placeholder="Select stock type"
                data={['IN', 'OUT']}
                styles={{
                  input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                  label: { fontSize: 18 },
                }}
                {...form.getInputProps('stockType')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Comment"
                placeholder="Enter comment"
                key={form.key('comment')}
                icon={<CheckIcon />}
                styles={{
                  input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                  label: { fontSize: 18 },
                }}
                style={{ marginBottom: 20 }}
                {...form.getInputProps('comment')}
              />
            </Grid.Col>
            <Grid.Col xs={6} sm={6}>
              <Button
                fullWidth
                color="blue"
                radius="md"
                size="md"
                // onClick={handleSubmit}
                loading={loading}
                disabled={loading}
                type="submit"
              >
                Add Stock
              </Button>
            </Grid.Col>
          </Grid>

          {error && (
            <Alert
              title="Error"
              color="red"
              style={{ marginTop: 20 }}
              onClose={() => setError(null)}
              closeLabel="Close"
            >
              {error}
            </Alert>
          )}
        </Paper>
      </form>
    </Stack>
  );
};

export default AddStock;
