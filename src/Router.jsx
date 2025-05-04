import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
// import Patient from './pages/patient/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  // {
  //   path: '/Patient',
  //   element: <Patient />,
  // },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
