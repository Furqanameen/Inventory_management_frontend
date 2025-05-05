import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DEFAULT_DELAY } from '../constants';
import { AuthContext } from '../context/Auth/AuthContext';
import api from '../utils/api';

const url = '/api/v1/stocks';

export const useStock = () => {
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
  const { id } = useParams();

  const { selectedProfile } = useContext(AuthContext);

  // Fetch records on component mount
  useEffect(() => {
    if (selectedProfile) {
      fetchRecords();
    }
  }, [selectedProfile, page, perPage, debouncedValue, sortBy, reverseSortDirection]);

  useEffect(() => {
    setPage(1);
    setTotal(0);
    setReverseSortDirection(false);
    setSortBy(null);
  }, [searchQuery]);

  // Fetch records from the API
  const fetchRecords = async () => {
    setFetchLoading(true);
    let apiUrl = `${url}/${id}?page=${page}&perPage=${perPage}`;

    if (searchQuery.trim().length > 0) {
      apiUrl += `&search=${searchQuery}`;
    }

    if (sortBy) {
      apiUrl += `&sortBy=${sortBy}&order=${reverseSortDirection ? 'desc' : 'asc'}`;
    }

    try {
      const response = await api(apiUrl);

      const { records, metadata } = response.data.data.stocks;

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

    try {
      const res = await api(`${url}`, {
        method: 'POST',
        body,
        data: body,
      });

      await fetchRecords();
      notifications.show({
        color: 'green',
        message: res.data.message || 'Stock added successfully',
      });
      return res.data;
    } catch ({ response }) {
      console.error('Error adding stock', response.data);
      notifications.show({
        message: response.data.message || 'Error adding stock',
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getRecordById = async (_id) => {
    try {
      const response = await api(`${url}/${_id}`);
      return response.data.data.stock;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || 'Error in fetching stock',
        color: 'red',
      });
      console.error('Error in fetching stock', response);
      return null;
    }
  };

  // Sorting function
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  return {
    data,
    loading,
    addRecord,
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
  };
};
