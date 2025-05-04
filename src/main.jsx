import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import App from './App.jsx';
import { AuthProvider } from './context/Auth/AuthProvider.jsx';
import { GlobalProvider } from './context/GlobalContext/provider.jsx';
import { LocationProvider } from './context/Locations/provider.jsx';
import { ProductProvider } from './context/Product/provider.jsx';
import { StoreProvider } from './context/Store/provider.jsx';

import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import './index.css';

import ScrollToTop from './components/ScrollToTop/index.jsx';
import { UserProvider } from './context/User/provider.jsx';
import { theme } from './theme.js';

const router = createBrowserRouter([{ path: '*', element: <App /> }]);

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <AuthProvider>
          <GlobalProvider>
            <StoreProvider>
              <ProductProvider>
                <LocationProvider>
                  <UserProvider>
                    <Notifications position="bottom-right" />
                    <RouterProvider router={router}>
                      <ScrollToTop />
                    </RouterProvider>
                  </UserProvider>
                </LocationProvider>
              </ProductProvider>
            </StoreProvider>
          </GlobalProvider>
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);
