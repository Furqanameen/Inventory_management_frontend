import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CheckIcon,
  Paper,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import LocationSelect from '../../components/Common/LocationSelect';
import Unauthorized from '../../components/Common/Unauthorized';
import { Container } from '../../components/Container/Container';
import { useAuth } from '../../context/Auth/AuthProvider';
import { useStore } from '../../context/Store/provider';

const Form = () => {
  const [error, setError] = useState(null);

  const { addRecord, updateRecord, loading, getRecordById } = useStore();
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      locationId: '',
    },
  });

  const fetchStores = async () => {
    if (!permissions.stores) {
      console.warn('User does not have permission to fetch stores');
      return;
    }
    const res = await getRecordById(id);

    if (res) {
      form.setFieldValue('name', res.name);
      form.setFieldValue('locationId', res.location._id);
      form.setFieldValue('status', res.deleted ? 'Inactive' : 'Active');
    }
  };

  useEffect(() => {
    if (id) {
      fetchStores();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    const { name, locationId } = values;

    try {
      if (id) {
        const res = await updateRecord({
          _id: id,
          name,
          locationId,
          deleted: values.status === 'Inactive',
        });
        if (res.success) {
          return navigate('/store');
        }
        setError(res.message);
      } else {
        const res = await addRecord({
          name,
          locationId,
        });

        if (res.success) {
          // notifications.show({ message: res.message });
          return navigate('/store');
        }
        setError(res.message);
      }
    } catch (error) {
      console.error('Error adding store', error);
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

  if (!permissions.stores) {
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
              {id ? 'Update' : 'Add'} Store
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

            <LocationSelect error={error} form={form} />

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
              {id ? 'Update' : 'Add'} Store
            </Button>

            <Space h={20} />

            <Button fullWidth onClick={() => navigate('/store')} variant="light" disabled={loading}>
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
