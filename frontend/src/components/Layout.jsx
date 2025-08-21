import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ProfilePicture from '@/components/ui/ProfilePicture';
import ChatBot from '@/components/ui/ChatBot';
import logoImage from '@/assets/Logo.png';
import {
  Home,
  Camera,
  MapPin,
  Trophy,
  Gift,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Search,
  Recycle
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = {
      citizen: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'report', label: 'Report', icon: Camera, path: '/report' },
        { id: 'map', label: 'Map', icon: MapPin, path: '/map' },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
        { id: 'rewards', label: 'Rewards', icon: Gift, path: '/rewards' },
        { id: 'community', label: 'Community', icon: Users, path: '/community' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
      ],
      ragpicker: [
        { id: 'r-tasks', label: 'Collection Tasks', icon: Camera, path: '/r/tasks' },
        { id: 'r-map', label: 'Area Map', icon: MapPin, path: '/r/map' },
        { id: 'r-earnings', label: 'Earnings', icon: Gift, path: '/r/earnings' },
        { id: 'r-profile', label: 'Kiosk Profile', icon: User, path: '/r/profile' },
      ],
      institution: [
        { id: 'org-dashboard', label: 'Dashboard', icon: Home, path: '/org/dashboard' },
        { id: 'org-reports', label: 'Reports', icon: Camera, path: '/org/reports' },
        { id: 'org-members', label: 'Members', icon: Users, path: '/org/members' },
        { id: 'org-analytics', label: 'Analytics', icon: Trophy, path: '/org/analytics' },
        { id: 'org-settings', label: 'Settings', icon: Settings, path: '/org/settings' },
      ],
      admin: [
        { id: 'admin-overview', label: 'Overview', icon: Home, path: '/admin/overview' },
        { id: 'admin-moderation', label: 'Moderation', icon: Camera, path: '/admin/moderation' },
        { id: 'admin-assignment', label: 'Assignment', icon: MapPin, path: '/admin/assign' },
        { id: 'admin-heatmap', label: 'Heatmap', icon: Trophy, path: '/admin/heatmap' },
        { id: 'admin-users', label: 'Users', icon: Users, path: '/admin/users' },
        { id: 'admin-partners', label: 'Partners', icon: Users, path: '/admin/partners' },
        { id: 'admin-settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
      ]
    };
    
    return baseItems[userRole] || baseItems.citizen;
  };

  const navigationItems = getNavigationItems();

  // Show public layout for landing pages and auth pages
  if (location.pathname === '/' || location.pathname === '/impact' || location.pathname === '/help' || location.pathname === '/login' || location.pathname === '/register') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Public Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoImage} alt="CleanSight" className="w-44 h-10 object-contain" />
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">
                  Home
                </Link>
                <Link to="/impact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Impact
                </Link>
                <Link to="/help" className="text-gray-600 hover:text-green-600 transition-colors">
                  Help
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="eco" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main>{children}</main>
        
        {/* ChatBot - Available on all pages */}
        <ChatBot />
      </div>
    );
  }

  // Authenticated layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <Link to="/dashboard" className="flex items-center gap-2">
                <img src={logoImage} alt="CleanSight" className="w-10 h-10 object-contain" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Points (for citizen role) */}
              {userRole === 'citizen' && user?.points && (
                <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">{user.points} pts</span>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <ProfilePicture 
                  src={user?.profileImage} 
                  alt={user?.full_name || 'User'} 
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-white shadow-sm border-r transition-transform duration-300 ease-in-out z-40 md:z-0`}>
          
          <div className="flex items-center justify-between p-4 md:hidden border-b">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Sign Out */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - only for citizen role */}
      {userRole === 'citizen' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex items-center justify-around py-2">
            {/* Show key navigation items for mobile */}
            {[
              navigationItems[0], // Dashboard
              navigationItems[1], // Report
              navigationItems[2], // Map
              navigationItems[5], // Community
              navigationItems[6]  // Settings
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                    isActive ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* ChatBot - Available on all authenticated pages */}
      <ChatBot />
    </div>
  );
};

export default Layout;
