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
import { Container } from '../../components/Container/Container';
import { useLocation } from '../../context/Locations/provider';

const Form = () => {
  const [error, setError] = useState(null);
  const { addRecord, updateRecord, loading, getRecordById } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
    },
  });

  const fetchRecord = async () => {
    const res = await getRecordById(id);

    if (res) {
      form.setValues({
        name: res?.name ?? null,
        status: res?.deleted ? 'Inactive' : 'Active',
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecord();
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
          return navigate('/location');
        }
        setError(res.message);
      } else {
        const res = await addRecord(values);

        if (res.success) {
          // notifications.show({ message: res.message });
          return navigate('/location');
        }
        setError(res.message);
      }
    } catch (error) {
      console.error('Error adding location', error);
      // notifications.show({ message: 'Something went wrong!' });
    }
  };

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
              {id ? 'Update' : 'Add'} Location
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

            {id && (
              <Select
                key={form.key('status')}
                required
                withAsterisk
                label="Status"
                placeholder="Select status"
                data={['Active', 'Inactive']}
                {...form.getInputProps('status')}
                styles={{
                  input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                  label: { fontSize: 18 },
                }}
              />
            )}

            <>
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
                {id ? 'Update' : 'Add'} Location
              </Button>
              <Space h={20} />
            </>

            <Button
              fullWidth
              onClick={() => navigate('/location')}
              variant="light"
              disabled={loading}
            >
              Cancel
            </Button>

            {error && (
              <Alert
                name="Error"
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
