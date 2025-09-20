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
  profile?: {
    name: string;
    contact: string;
    address: string;
    aadharNumber: string;
  };
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
    },
    {
      id: 'SIH_TEAM_SAPPHIRE001',
      name: 'Lost MacBook Pro',
      location: {
        lat: 19.0176,
        lng: 72.8562,
        address: 'Bandra, Mumbai, Maharashtra, India'
      },
      lastSeen: '2 hours ago'
    }
  ]
};

const USER1: User = {
  username: 'user1',
  devices: [
    {
      id: 'DEVICE_USER1_001',
      name: 'iPhone 14 Pro',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra, India'
      },
      lastSeen: '10 minutes ago'
    }
  ]
};

const USER2: User = {
  username: 'user2',
  devices: []
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Static credentials
    if (username === 'sample' && password === 'sample') {
      setUser(SAMPLE_USER);
      return true;
    }
    if (username === 'user1' && password === 'user1') {
      setUser(USER1);
      return true;
    }
    if (username === 'user2' && password === 'user2') {
      setUser(USER2);
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