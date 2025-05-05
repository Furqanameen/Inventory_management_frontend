import { useContext, useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DEFAULT_DELAY } from '../../constants';
// import useDebouncedValue from '../../hooks/useDebounce';
import api from '../../utils/api';
import { AuthContext } from '../Auth/AuthContext';
import { StoreContext } from './context';

const url = '/api/v1/stores';

// eslint-disable-next-line react/prop-types
export const StoreProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [debouncedValue] = useDebouncedValue(searchQuery, DEFAULT_DELAY);
  const { selectedProfile, permissions, fetchUserData } = useContext(AuthContext);

  // Fetch records on component mount
  useEffect(() => {
    if (selectedProfile) {
      fetchStores();
    }
  }, [selectedProfile, page, perPage, debouncedValue, sortBy, reverseSortDirection]);

  useEffect(() => {
    setPage(1);
    setTotal(0);
    setReverseSortDirection(false);
    setSortBy(null);
  }, [searchQuery]);

  // Fetch records from the API
  const fetchStores = async () => {
    if (!permissions.stores) {
      console.warn('User does not have permission to fetch stores');
      return;
    }

    setFetchLoading(true);
    let apiUrl = `${url}?page=${page}&perPage=${perPage}`;

    if (searchQuery.trim().length > 0) {
      apiUrl += `&search=${searchQuery}`;
    }

    if (sortBy) {
      apiUrl += `&sortBy=${sortBy}&order=${reverseSortDirection ? 'desc' : 'asc'}`;
    }

    try {
      const response = await api(apiUrl);

      const { records, metadata } = response.data.data.stores;

      setData(records);
      setTotal(metadata.count);
    } catch (error) {
      console.error('Error fetching records', error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Add a new record
  const addRecord = async (body) => {
    if (!permissions.stores) {
      console.warn('User does not have permission to add stores');
      return;
    }

    setLoading(true);

    try {
      const res = await api(`${url}`, {
        method: 'POST',
        body,
        data: body,
      });

      await fetchStores();
      notifications.show({ message: res.data.message || 'Store added successfully' });
      await fetchUserData();
      return res.data;
    } catch ({ response }) {
      console.error('Error adding store', response.data);
      notifications.show({
        message: response.data.message || 'Error adding store',
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Update an record
  const updateRecord = async (updatedOrg) => {
    if (!permissions.stores) {
      console.warn('User does not have permission to update stores');
      return;
    }
    setLoading(true);
    try {
      const response = await api(`${url}/${updatedOrg._id}`, {
        method: 'PUT',
        data: updatedOrg,
      });
      await fetchStores();
      notifications.show({ message: response.data.message || 'Store updated successfully' });
      await fetchUserData();
      return response.data;
    } catch ({ response }) {
      console.error('Error updating store', response.data);
      notifications.show({
        message: response.data.message || 'Error updating store',
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Delete an record
  const deleteRecord = async (_id) => {
    if (!permissions.stores) {
      console.warn('User does not have permission to delete stores');
      return;
    }
    setLoading(true);
    try {
      const response = await api(`${url}/${_id}`, {
        method: 'DELETE',
      });

      notifications.show({ message: response.data.message || 'Store deleted successfully' });
      await fetchStores();
      return response.data;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || 'Error deleting store',
        color: 'red',
      });
      console.error('Error deleting store', response);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getRecordById = async (_id) => {
    if (!permissions.stores) {
      console.warn('User does not have permission to fetch stores');
      return;
    }
    try {
      const response = await api(`${url}/${_id}`);
      return response.data.data.store;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || 'Error in fetching store',
        color: 'red',
      });
      console.error('Error in fetching store', response);
      return null;
    }
  };

  // Sorting function
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  return (
    <StoreContext.Provider
      value={{
        data,
        loading,
        addRecord,
        updateRecord,
        deleteRecord,
        searchQuery,
        setSearchQuery,
        getRecordById,
        page,
        setPage,
        perPage,
        setPerPage,
        total,
        fetchLoading,
        sortBy,
        setSorting,
        reverseSortDirection,
        fetchStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
