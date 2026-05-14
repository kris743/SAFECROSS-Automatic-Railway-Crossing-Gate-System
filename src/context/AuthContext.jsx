import { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, ROLES } from '../api/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Persistent user store (simulates a database)
const STORAGE_KEY = 'safecross_users_db';
const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  // Seed with default admin & railway users
  const seed = [...mockUsers];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('safecross_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // LOGIN
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      const userData = { email: found.email, name: found.name, role: found.role };
      setUser(userData);
      localStorage.setItem('safecross_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, role: found.role };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  }, []);

  // REGISTER (only for normal public users)
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const users = getStoredUsers();

    // Check duplicate
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: 'Email already registered' };
    }

    // Create public user
    const newUser = { email, password, name, role: ROLES.USER };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    const userData = { email, name, role: ROLES.USER };
    setUser(userData);
    localStorage.setItem('safecross_user', JSON.stringify(userData));
    setIsLoading(false);
    return { success: true, role: ROLES.USER };
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('safecross_user');
  }, []);

  // Role checks
  const isAdmin = user?.role === ROLES.ADMIN;
  const isRailway = user?.role === ROLES.RAILWAY;
  const isUser = user?.role === ROLES.USER;
  const canControl = isAdmin || isRailway; // Both can access controls
  const canManageESP = isAdmin || isRailway; // Both can manage ESP
  const canManageUsers = isAdmin; // Only admin

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isRailway,
        isUser,
        canControl,
        canManageESP,
        canManageUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
