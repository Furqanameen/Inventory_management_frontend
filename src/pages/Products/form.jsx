import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CheckIcon,
  NumberInput,
  Paper,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Unauthorized from '../../components/Common/Unauthorized';
import { Container } from '../../components/Container/Container';
import { useAuth } from '../../context/Auth/AuthProvider';
import { useProduct } from '../../context/Product/provider';

const Form = () => {
  const [error, setError] = useState(null);

  const { addRecord, updateRecord, loading, getRecordById } = useProduct();
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      sku: '',
      barcode: '',
      purchasePrice: 0,
      salePrice: 0,
    },
  });

  const fetchProducts = async () => {
    if (!permissions.products) {
      console.warn('User does not have permission to fetch products');
      return;
    }
    const res = await getRecordById(id);

    if (res) {
      form.setFieldValue('name', res.name);
      form.setFieldValue('sku', res.sku);
      form.setFieldValue('barcode', res.barcode);
      form.setFieldValue('purchasePrice', res.purchasePrice);
      form.setFieldValue('salePrice', res.salePrice);
      form.setFieldValue('status', res.deleted ? 'Inactive' : 'Active');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      if (id) {
        const res = await updateRecord({
          _id: id,
          ...values,
          deleted: values.status === 'Inactive',
        });
        if (res.success) {
          return navigate('/product');
        }
        setError(res.message);
      } else {
        const res = await addRecord(values);

        if (res.success) {
          // notifications.show({ message: res.message });
          return navigate('/product');
        }
        setError(res.message);
      }
    } catch (error) {
      console.error('Error adding product', error);
      // notifications.show({ message: 'Something went wrong!' });
    }
  };

  // const handleCheckboxChange = (role, permission) => {
  //   const roleKey = `${role.code}::${permission.code}`;
  //   const isChecked = selectedPermissions[roleKey];

  //   setSelectedPermissions((prev) => ({
  //     ...prev,
  //     [roleKey]: !isChecked,
  //   }));

  //   setPermissionUpdates((prevUpdates) => {
  //     const action = isChecked ? 'remove' : 'add';
  //     const updated = [...prevUpdates.filter((p) => p.code !== roleKey)];

  //     if (action === 'add') {
  //       updated.push({ action, code: roleKey });
  //     }
  //     return updated;
  //   });
  // };

  if (!permissions.products) {
    return <Unauthorized />;
  }

  return (
    <Container size="xl">
      <Stack align="center" justify="center" my={50}>
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Paper shadow="lg" p="lg" withBorder>
            <Title
              order={2}
              align="center"
              my="sm"
              // style={{ marginBottom: 20, color: '#2c3e50' }}
            >
              {id ? 'Update' : 'Add'} Product
            </Title>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Enter name"
              key={form.key('name')}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('name')}
            />

            <TextInput
              withAsterisk
              label="Sku"
              placeholder="Enter sku"
              key={form.key('sku')}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('sku')}
            />

            <TextInput
              withAsterisk
              label="Barcode"
              placeholder="Enter barcode"
              key={form.key('barcode')}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('barcode')}
            />

            <NumberInput
              withAsterisk
              label="Purchase Price"
              placeholder="Enter purchase price"
              key={form.key('purchasePrice')}
              min={0}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('purchasePrice')}
            />

            <NumberInput
              withAsterisk
              label="Sale Price"
              placeholder="Enter sale price"
              key={form.key('salePrice')}
              min={0}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('salePrice')}
            />

            {id && (
              <Select
                key={form.key('status')}
                required
                withAsterisk
                label="Status"
                placeholder="Select status"
                data={['Active', 'Inactive']}
                styles={{
                  input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                  label: { fontSize: 18 },
                }}
                {...form.getInputProps('status')}
              />
            )}

            <Button
              fullWidth
              color="blue"
              radius="md"
              size="md"
              // onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              mt={20}
              type="submit"
            >
              {id ? 'Update' : 'Add'} Product
            </Button>

            <Space h={20} />

            <Button
              fullWidth
              onClick={() => navigate('/product')}
              variant="light"
              disabled={loading}
            >
              Cancel
            </Button>

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
    </Container>
  );
};

export default Form;
