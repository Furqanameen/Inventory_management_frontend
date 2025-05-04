import { Suspense, useContext } from 'react';
import { Route, Routes, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
// import { Router } from './Router';
import { Loading } from './components/Loading/Loading';
import ProtectedRoute from './components/ProtectedRoute';

import '@mantine/core/styles.css';

import { useEffect } from 'react';
import { AppRoutes } from './AppRoute';
import ScrollToTop from './components/ScrollToTop';
import { AuthContext } from './context/Auth/AuthContext';
import useSyncLogout from './hooks/useSyncLogout';
import LoginPage from './pages/login';
import ProfilePage from './pages/Profile';

export default function App() {
  useSyncLogout();
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && pathname === '/login') {
      // Redirect to the home page if the user is already logged in
      navigate('/');
    }
  }, [pathname, user]);

  if (!user && pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <AppShell
      // logo={<Logo size={24} />}
      pathname={location.pathname}
      // searchParams={searchParams}
      // menus={userConfigToMenu(config, userPolicy, profile)}
    >
      <ScrollRestoration getKey={(location) => location.pathname} />
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ProfilePage />} />
            <Route path="*" element={<AppRoutes />} />
          </Route>
        </Routes>
      </Suspense>
    </AppShell>
  );
}
