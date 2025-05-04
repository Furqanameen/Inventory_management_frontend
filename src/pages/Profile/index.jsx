import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CheckIcon,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import LocationSelect from '../../components/Common/LocationSelect';
import StoreSelect from '../../components/Common/StoreSelect';
import { Container } from '../../components/Container/Container';
import { useAuth } from '../../context/Auth/AuthProvider';
import { useGlobal } from '../../context/GlobalContext/provider';
import classes from '../../../src/components/Home/HomePage.module.css';

const ProfilePage = () => {
  const [error] = useState(null);

  const { selectedProfile, fetchLoading } = useAuth();
  const { locationsOptions, storesOptions } = useGlobal();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      role: '',
      status: '',
      storeId: '',
      locationId: '',
    },
  });

  useEffect(() => {
    if (selectedProfile) {
      form.setValues({
        name: selectedProfile?.name,
        email: selectedProfile?.email,
        role: selectedProfile?.role,
        status: selectedProfile?.deleted ? 'inactive' : 'active',
        storeId: selectedProfile?.store?._id,
        locationId: selectedProfile?.store?.location?._id,
      });
    }
  }, [selectedProfile, locationsOptions, storesOptions]);

  return (
    <Container py="xl" className={classes.container} size="xl">
      <form style={{ width: '100%' }}>
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
                    //   className={classes.cardTitle}
                    //   color="blue"
                    style={{ fontFamily: 'Lexend, sans-serif' }}
                  >
                    Profile Details
                  </Title>
                </Group>
              </Grid.Col>
            </Grid>

            <Divider my="md" />

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Name"
                  placeholder="Enter name"
                  readOnly
                  withAsterisk
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
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="Enter email"
                  key={form.key('name')}
                  readOnly
                  withAsterisk
                  required
                  icon={<CheckIcon />}
                  styles={{
                    input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                    label: { fontSize: 18 },
                  }}
                  style={{ marginBottom: 20 }}
                  {...form.getInputProps('email')}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Role"
                  placeholder="Select role"
                  data={[
                    { value: 'superadmin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'staff', label: 'Staff' },
                  ]}
                  readOnly
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
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Select status"
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  key={form.key('status')}
                  required
                  readOnly
                  icon={<CheckIcon />}
                  styles={{
                    input: { borderColor: error ? '#e74c3c' : '#2980b9' },
                    label: { fontSize: 18 },
                  }}
                  {...form.getInputProps('status')}
                  style={{ marginBottom: 20 }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <StoreSelect form={form} error={error} disabledField={true} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <LocationSelect form={form} error={error} disabledField={true} />
              </Grid.Col>
            </Grid>
          </Card>
        </Box>
      </form>
    </Container>
  );
};

export default ProfilePage;
