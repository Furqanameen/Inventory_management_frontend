import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CheckIcon,
  Paper,
  PasswordInput,
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
import { useUser } from '../../context/User/provider';

const Form = () => {
  const [error, setError] = useState(null);
  // const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { addRecord, updateRecord, loading, getRecordById } = useUser();
  const { permissions } = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      role: '',
      password: null,
    },
  });

  const fetchRecord = async () => {
    if (!permissions.users) {
      console.warn('User does not have permission to fetch users');
      return;
    }
    const res = await getRecordById(id);

    if (res) {
      // setFile(res.image);
      form.setValues({
        name: res?.name ?? null,
        email: res?.email ?? null,
        role: res?.role ?? null,
        password: null,
        status: res.deleted ? 'Inactive' : 'Active',
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    const data = { ...values };

    try {
      if (id) {
        data._id = id;

        if (!values?.password?.trim()) {
          delete data.password;
        }

        const res = await updateRecord(data);
        if (res.success) {
          return navigate(`/user`);
        }
        setError(res.message);
      } else {
        delete values.status;
        const res = await addRecord({ ...values });

        if (res.success) {
          // notifications.show({ message: res.message });
          return navigate(`/user`);
        }
        setError(res.message);
      }
    } catch (error) {
      console.error(`Error adding $user`, error);
      // notifications.show({ message: 'Something went wrong!' });
    }
  };

  if (!permissions.users) {
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
              {id ? 'Update' : 'Add'} user
            </Title>

            <TextInput
              withAsterisk
              label="Title"
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
              label="Email"
              placeholder="Enter email"
              key={form.key('email')}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter password"
              key={form.key('password')}
              required={!id}
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('password')}
            />

            <Select
              label="Role"
              placeholder="Select Role"
              data={[
                {
                  value: 'admin',
                  label: 'Admin',
                },
                { value: 'staff', label: 'Staff' },
              ]}
              withAsterisk
              key={form.key('role')}
              required
              icon={<CheckIcon />}
              styles={{
                input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                label: { fontSize: 18 },
              }}
              style={{ marginBottom: 20 }}
              {...form.getInputProps('role')}
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
              gender="md"
              size="md"
              // onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              mt={20}
              type="submit"
            >
              {id ? 'Update' : 'Add'} user
            </Button>
            <Space h={20} />

            <Button fullWidth onClick={() => navigate(`/user`)} variant="light" disabled={loading}>
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
