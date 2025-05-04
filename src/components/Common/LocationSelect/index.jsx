/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CheckIcon, Select } from '@mantine/core';
import { useGlobal } from '../../../context/GlobalContext/provider';

const LocationSelect = ({ form, error, disabledField = false }) => {
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const { locationsOptions, allLocations, fetchLocations } = useGlobal();

  useEffect(() => {
    if (allLocations.length === 0 && fetchAttempts < 3) {
      const timer = setTimeout(() => {
        fetchLocations();
        setFetchAttempts((prev) => prev + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [allLocations.length, fetchAttempts, fetchLocations]);

  return (
    <Select
      data={locationsOptions}
      placeholder="Select location"
      label="Location"
      id="location"
      required
      withAsterisk
      key={form.key('locationId')}
      icon={<CheckIcon />}
      styles={{
        input: { borderColor: error ? '#e74c3c' : '#2980b9' },
        label: { fontSize: 18 },
      }}
      style={{ marginBottom: 20 }}
      {...form.getInputProps('locationId')}
      readOnly={disabledField}
    />
  );
};

export default LocationSelect;
