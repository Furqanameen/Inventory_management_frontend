import { useEffect } from 'react';

function useSyncLogout() {
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        // Clear your authentication tokens or any session data
        // Redirect to the login page or reset the state
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', syncLogout);

    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, []);
}

export default useSyncLogout;
