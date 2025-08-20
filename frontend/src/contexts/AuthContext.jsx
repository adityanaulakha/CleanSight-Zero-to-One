import { createContext, useContext, useState, useEffect } from 'react';
import { userService, initializeSampleData } from '../lib/localDatabase.js';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    
    // Check for existing user in localStorage
    const initializeAuth = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for localStorage changes (for cross-tab sync)
    const handleStorageChange = (event) => {
      if (event.key === 'cleansight_auth_user' && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue);
          console.log('AuthContext: User updated from storage change', updatedUser);
          setUser(updatedUser);
        } catch (error) {
          console.error('Error parsing updated user from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const data = await userService.signIn(email, password);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
      
      // Return success and let the Login component handle navigation
      return { 
        user: currentUser, 
        redirectTo: getDashboardRoute(currentUser.role)
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await userService.signOut();
      setUser(null);
      setSession(null);
      // Use window.location.replace to prevent going back to authenticated pages
      window.location.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      const data = await userService.signUp(email, password, userData);
      setUser(data.user);
      setLoading(false);
      
      // Return success and let the Register component handle navigation
      return { 
        user: data.user, 
        redirectTo: getDashboardRoute(userData.role)
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'citizen': 'Citizen',
      'ragpicker': 'Kiosk Operator',
      'institution': 'Institution',
      'admin': 'Administrator'
    };
    return roleNames[role] || 'User';
  };

  const getDashboardRoute = (role) => {
    const routes = {
      'citizen': '/dashboard',
      'ragpicker': '/r/tasks',
      'institution': '/org/dashboard',
      'admin': '/admin/overview'
    };
    return routes[role] || '/dashboard';
  };

  const updateUser = (updatedUserData) => {
    console.log('AuthContext: Updating user data', updatedUserData);
    
    // Get current user data and merge with updates
    const currentUser = user || {};
    const mergedUserData = { ...currentUser, ...updatedUserData };
    
    console.log('AuthContext: Merged user data', mergedUserData);
    
    // Update the user state immediately to trigger re-renders
    setUser(mergedUserData);
    
    // Also update localStorage to keep it in sync
    localStorage.setItem('cleansight_auth_user', JSON.stringify(mergedUserData));
    
    console.log('AuthContext: User data updated successfully');
    
    // Return the updated user data
    return mergedUserData;
  };

  const value = {
    user,
    session: null, // localStorage doesn't use sessions
    userRole: user?.role || null,
    loading,
    signIn,
    signOut,
    signUp,
    updateUser,
    getRoleDisplayName,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
