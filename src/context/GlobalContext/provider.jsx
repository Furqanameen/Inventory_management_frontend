import { useContext, useEffect, useState } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../Auth/AuthContext';
import { useAuth } from '../Auth/AuthProvider';
import { GlobalContext } from './context';

// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
  const [allLocations, setAllLocations] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const { selectedProfile } = useContext(AuthContext);

  const { user } = useAuth();

  const fetchLocations = async () => {
    try {
      const response = await api('/api/v1/locations?page=1&perPage=10000');
      setAllLocations(response.data.data.locations.records);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await api('/api/v1/stores?page=1&perPage=10000');
      setAllStores(response.data.data.stores.records);
    } catch (error) {
      console.error('Error fetching stores', error);
    }
  };

  useEffect(() => {
    if (selectedProfile?._id && user) {
      fetchLocations();
      fetchStores();
      // Polling every 3 minutes
      const interval = setInterval(() => {
        fetchLocations();
        fetchStores();
      }, 180000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [selectedProfile, user]);

  const locationsOptions = allLocations.map((location) => ({
    value: location._id,
    label: location?.name || '',
    data: location,
  }));

  const storesOptions = allStores.map((store) => ({
    value: store._id,
    label: store?.name || '',
    data: store,
  }));

  return (
    <GlobalContext.Provider
      value={{
        allLocations,
        locationsOptions,
        allStores,
        storesOptions,
        fetchStores,
        fetchLocations,
        setAllLocations,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
