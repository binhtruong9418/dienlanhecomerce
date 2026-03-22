import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi, { LoginCredentials, LoginResponse } from '../api/adminApi';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...', { token: token ? 'exists' : 'none' });
      
      if (token) {
        try {
          const userData = await adminApi.getCurrentUser();
          console.log('User data loaded:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    console.log('Logging in with:', credentials.email);
    
    try {
      const response = await adminApi.login(credentials);
      console.log('Login response:', response);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};