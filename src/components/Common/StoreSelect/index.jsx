/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CheckIcon, Select } from '@mantine/core';
import { useGlobal } from '../../../context/GlobalContext/provider';

const StoreSelect = ({ form, error, disabledField = false }) => {
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const { storesOptions, allStores, fetchStores } = useGlobal();

  useEffect(() => {
    if (allStores.length === 0 && fetchAttempts < 3) {
      const timer = setTimeout(() => {
        fetchStores();
        setFetchAttempts((prev) => prev + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [allStores.length, fetchAttempts, fetchStores]);

  return (
    <Select
      data={storesOptions}
      placeholder="Select store"
      label="Store"
      id="store"
      required
      withAsterisk
      key={form?.key('storeId')}
      icon={<CheckIcon />}
      styles={{
        input: { borderColor: error ? '#e74c3c' : '#2980b9' },
        label: { fontSize: 18 },
      }}
      style={{ marginBottom: 20 }}
      {...form?.getInputProps('storeId')}
      readOnly={disabledField}
    />
  );
};

export default StoreSelect;
