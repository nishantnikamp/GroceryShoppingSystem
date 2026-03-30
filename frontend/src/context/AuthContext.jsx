import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.data);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      toast.success('Successfully logged in!');
      return data.data.role;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      setUser(data.data);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      toast.success('Successfully registered!');
      return data.data.role;
    } catch (error) {
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
