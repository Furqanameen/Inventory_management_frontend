import { useContext, useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DEFAULT_DELAY } from '../../constants';
// import useDebouncedValue from '../../hooks/useDebounce';
import api from '../../utils/api';
import { AuthContext } from '../Auth/AuthContext';
import { ProductContext } from './context';

const url = '/api/v1/products';

// eslint-disable-next-line react/prop-types
export const ProductProvider = ({ children }) => {
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
  const { selectedProfile, permissions } = useContext(AuthContext);

  // Fetch records on component mount
  useEffect(() => {
    fetchProducts();
  }, [selectedProfile, page, perPage, debouncedValue, sortBy, reverseSortDirection]);

  useEffect(() => {
    setPage(1);
    setTotal(0);
    setReverseSortDirection(false);
    setSortBy(null);
  }, [searchQuery]);

  // Fetch records from the API
  const fetchProducts = async () => {
    if (!permissions.profile) {
      console.warn('User does not have permission to fetch products');
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

      const { records, metadata } = response.data.data.products;

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
    if (!permissions.profile) {
      console.warn('User does not have permission to add products');
      return;
    }
    setLoading(true);

    try {
      const res = await api(`${url}`, {
        method: 'POST',
        body,
        data: body,
      });

      await fetchProducts();
      notifications.show({ message: res.data.message || 'Product added successfully' });
      return res.data;
    } catch ({ response }) {
      console.error('Error adding product', response.data);
      notifications.show({
        message: response.data.message || 'Error adding product',
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Update an record
  const updateRecord = async (updatedOrg) => {
    if (!permissions.profile) {
      console.warn('User does not have permission to update products');
      return;
    }
    setLoading(true);
    try {
      const response = await api(`${url}/${updatedOrg._id}`, {
        method: 'PUT',
        data: updatedOrg,
      });
      await fetchProducts();
      notifications.show({ message: response.data.message || 'Product updated successfully' });
      return response.data;
    } catch ({ response }) {
      console.error('Error updating product', response.data);
      notifications.show({
        message: response.data.message || 'Error updating product',
        color: 'red',
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Delete an record
  const deleteRecord = async (_id) => {
    if (!permissions.profile) {
      console.warn('User does not have permission to delete products');
      return;
    }
    setLoading(true);
    try {
      const response = await api(`${url}/${_id}`, {
        method: 'DELETE',
      });

      notifications.show({ message: response.data.message || 'Product deleted successfully' });
      await fetchProducts();
      return response.data;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || 'Error deleting product',
        color: 'red',
      });
      console.error('Error deleting product', response);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getRecordById = async (_id) => {
    if (!permissions.profile) {
      console.warn('User does not have permission to fetch products');
      return;
    }
    try {
      const response = await api(`${url}/${_id}`);
      return response.data.data.product;
    } catch ({ response }) {
      notifications.show({
        message: response.data.message || 'Error in fetching product',
        color: 'red',
      });
      console.error('Error in fetching product', response);
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
    <ProductContext.Provider
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
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
