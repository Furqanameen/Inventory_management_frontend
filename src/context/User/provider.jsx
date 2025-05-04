import { useContext, useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DEFAULT_DELAY } from '../../constants';
// import useDebouncedValue from '../../hooks/useDebounce';
import api from '../../utils/api';
import { AuthContext } from '../Auth/AuthContext';
// import { useGlobal } from '../GlobalContext/provider';
import { UserContext } from './context';

const url = '/api/v1/profiles';

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
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

  // const { fetchLocations } = useGlobal();
  const { selectedProfile } = useContext(AuthContext);

  // Fetch records on component mount
  useEffect(() => {
    if (selectedProfile) {
      fetchRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedProfile,
    page,
    perPage,
    debouncedValue,
    sortBy,
    reverseSortDirection,
    // pathname,
  ]);

  useEffect(() => {
    setPage(1);
    setTotal(0);
    setReverseSortDirection(false);
    setSortBy(null);
  }, [searchQuery]);

  // Fetch records from the API
  const fetchRecords = async () => {
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

      const { records, metadata } = response.data.data.profiles;
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
    setLoading(true);

    console.log('body', body)

    try {
      const res = await api(`${url}`, {
        method: 'POST',
        body,
        data: body,
      });

      await fetchRecords();
      notifications.show({
        message: res.data.message || `User added successfully`,
      });
      return res.data;
    } catch ({ response }) {
      console.error(`Error adding User`, response.data);
      notifications.show({
        message: response.data.message || `Error adding User`,
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Update an record
  const updateRecord = async (updatedOrg) => {
    setLoading(true);
    try {
      const response = await api(`${url}/${updatedOrg._id}`, {
        method: 'PUT',
        data: updatedOrg,
      });
      await fetchRecords();
      notifications.show({
        message: response.data.message || `User updated successfully`,
      });
      return response.data;
    } catch ({ response }) {
      console.error(`Error updating User`, response.data);
      notifications.show({
        message: response.data.message || `Error updating User`,
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Delete an record
  const deleteRecord = async (_id) => {
    setLoading(true);
    try {
      const response = await api(`${url}/${_id}`, {
        method: 'DELETE',
      });

      notifications.show({
        message: response.data.message || `User deleted successfully`,
      });
      await fetchRecords();
      return response.data;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || `Error deleting User`,
        color: 'red',
      });
      console.error(`Error deleting User`, response);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getRecordById = async (_id) => {
    try {
      const response = await api(`${url}/${_id}`);
      return response.data.data.profile;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || `Error in fetching User`,
        color: 'red',
      });
      console.error(`Error in fetching User`, response);
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
    <UserContext.Provider
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use context
export const useUser = () => useContext(UserContext);
