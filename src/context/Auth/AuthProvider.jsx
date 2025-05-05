import { useContext, useEffect, useState } from 'react';
import api, { setAuthHeaders } from '../../utils/api';
import { AuthContext } from './AuthContext';

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Check if the token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, fetch user data (e.g., from your API)
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData();
    }, 180000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!selectedProfile) return;
    localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
  }, [selectedProfile]);

  useEffect(() => {
    if (!user) return;

    const profiles = user.profiles || [];

    const selectedProfile = JSON.parse(localStorage.getItem('selectedProfile'));
    if (selectedProfile) {
      const profile = profiles.find((p) => p._id === selectedProfile._id);
      if (profile) {
        setSelectedProfile(profile);
        setAuthHeaders(profile._id);
      } else if (profiles.length > 0) {
        setSelectedProfile(profiles[0]); // Default to first profile
        setAuthHeaders(profiles[0]._id);
      }
    } else if (profiles.length > 0) {
      setSelectedProfile(profiles[0]); // Default to first profile
      setAuthHeaders(profiles[0]._id);
    }
  }, [user]);

  // Function to fetch user data based on the token (adjust as needed)
  const fetchUserData = async (token) => {
    if (!token) {
      token = localStorage.getItem('token');
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api('/api/v1/auth/info', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.data.user;
      setUser(user); // Set user data after successful fetch
    } catch ({ response }) {
      console.error('Error fetching user data:', response);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData); // Set user data after successful login
  };

  // Logout function
  const logout = () => {
    setSelectedProfile(null); // Clear selected profile on logout
    setUser(null); // Clear user data on logout
    localStorage.removeItem('token');
    // Broadcast the logout event
    localStorage.setItem('logout', Date.now());
    // window.location.href = '/login'; // Redirect to login page
  };

  const switchProfile = (profileId) => {
    if (!profileId) return;

    const profile = user.profiles.find((p) => p._id === profileId);
    if (!profile) return;
    setSelectedProfile(profile);
    setAuthHeaders(profileId);
  };

  const isSuperAdmin = user?.admin || selectedProfile?.role === 'superadmin';

  const permissions = {
    profile: !!selectedProfile,
    locations: isSuperAdmin,
    stores: isSuperAdmin,
    products: !!selectedProfile,
    users: !!selectedProfile && (selectedProfile?.role === 'admin' || isSuperAdmin),
    stocks: !!selectedProfile,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchProfile,
        selectedProfile,
        fetchUserData,
        permissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
