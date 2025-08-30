import { createContext, useContext, useState, ReactNode } from 'react';

interface Device {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeen: string;
}

interface User {
  username: string;
  devices: Device[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data
const SAMPLE_USER: User = {
  username: 'sample',
  devices: [
    {
      id: 'SIH_PROJECT_COBRA',
      name: 'My iPhone 15',
      location: {
        lat: 19.2183,
        lng: 73.0898,
        address: 'Dombivli, Maharashtra, India'
      },
      lastSeen: '5 minutes ago'
    },
    {
      id: 'DEV_SAMSUNG_S24',
      name: 'Samsung Galaxy S24',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra, India'
      },
      lastSeen: '1 hour ago'
    }
  ]
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Static credentials: username: "sample", password: "sample"
    if (username === 'sample' && password === 'sample') {
      setUser(SAMPLE_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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