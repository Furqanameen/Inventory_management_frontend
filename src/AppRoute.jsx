import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LocationsForm from './pages/Locations/form';
import LocationsList from './pages/Locations/list';
import ProductForm from './pages/Products/form';
import ProductList from './pages/Products/list';
import StockList from './pages/Products/Stock';
import StoreForm from './pages/Stores/form';
import StoreList from './pages/Stores/list';
import UserForm from './pages/Users/form';
import UserList from './pages/Users/list';

const AppRoutes = () => {
  const [roleId, setRoleId] = useState(null);
  const { pathname } = useLocation();

  const pathParts = pathname.split('/');
  useEffect(() => {
    const role = pathParts[2];

    if (role === roleId) return;

    if (role) setRoleId(role);
  }, [pathname, roleId]);

  return (
    <Routes>
      <Route path="/location" element={<LocationsList />} />
      <Route path="/location/add" element={<LocationsForm />} />
      <Route path="/location/:id" element={<LocationsForm />} />

      <Route path="/store" element={<StoreList />} />
      <Route path="/store/add" element={<StoreForm />} />
      <Route path="/store/:id" element={<StoreForm />} />

      <Route path="/product" element={<ProductList />} />
      <Route path="/product/add" element={<ProductForm />} />
      <Route path="/product/:id" element={<ProductForm />} />
      <Route path="/product/:id/stock" element={<StockList />} />

      <Route path="/user" element={<UserList />} />
      <Route path="/user/add" element={<UserForm />} />
      <Route path="/user/:id" element={<UserForm />} />
    </Routes>
  );
};

export { AppRoutes };
