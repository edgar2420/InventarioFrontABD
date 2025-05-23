import { useState, useEffect } from 'react';

const useAuth = () => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuthState({
      token: null,
      role: null,
      isAuthenticated: false,
    });
  };

  return {
    authState,
    loading,
    logout,
  };
};

export default useAuth;
