import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { userService } from '@/lib/localDatabase.js';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  ShieldCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

const AdminUsers = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load all users from database
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter users based on search and filter criteria
  useEffect(() => {
    let filtered = users;

    // Apply role filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => user.role === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.includes(query) ||
        user.city?.toLowerCase().includes(query) ||
        user.zone?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [users, selectedFilter, searchQuery]);

  // Real-time updates
  useEffect(() => {
    loadUsers();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(loadUsers, 30000);
    
    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes('Users')) {
        loadUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUsers]);

  const getUserStats = (user) => {
    return {
      totalReports: user.total_reports || 0,
      completedTasks: user.completed_tasks || 0,
      totalEarnings: user.total_earnings || 0,
      totalPoints: user.total_points || 0,
      averageRating: user.average_rating || 0,
      joinDate: new Date(user.created_at).toLocaleDateString()
    };
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'ragpicker': return 'bg-green-100 text-green-800 border-green-200';
      case 'citizen': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'institution': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (user) => {
    const lastActive = user.last_active || user.updated_at;
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const hoursSinceActive = (now - lastActiveDate) / (1000 * 60 * 60);

    if (hoursSinceActive <= 1) return 'bg-green-100 text-green-800';
    if (hoursSinceActive <= 24) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (user) => {
    const lastActive = user.last_active || user.updated_at;
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const hoursSinceActive = (now - lastActiveDate) / (1000 * 60 * 60);

    if (hoursSinceActive <= 1) return 'Active';
    if (hoursSinceActive <= 24) return 'Recently Active';
    return 'Inactive';
  };

  const filterOptions = [
    { id: 'all', label: 'All Users', count: filteredUsers.length },
    { id: 'citizen', label: 'Citizens', count: users.filter(u => u.role === 'citizen').length },
    { id: 'ragpicker', label: 'Ragpickers', count: users.filter(u => u.role === 'ragpicker').length },
    { id: 'institution', label: 'Institutions', count: users.filter(u => u.role === 'institution').length },
    { id: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-lg font-semibold">Loading Users...</div>
          <p className="text-gray-500 text-sm">Syncing real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all platform users ({users.length} total)
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, phone, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => {
              const stats = getUserStats(user);
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profileImage} alt={user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900">{user.full_name}</h4>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user)}>
                            {getStatusText(user)}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Member
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{user.city}, {user.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Joined {stats.joinDate}
                          </div>
                        </div>

                        {/* Role-specific stats */}
                        <div className="mt-3 flex gap-4 text-sm">
                          {user.role === 'citizen' && (
                            <>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-blue-500" />
                                <span>{stats.totalPoints} points</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-green-500" />
                                <span>{stats.totalReports} reports</span>
                              </div>
                            </>
                          )}
                          
                          {user.role === 'ragpicker' && (
                            <>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{stats.completedTasks} tasks</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-purple-500" />
                                <span>₹{stats.totalEarnings} earned</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>⭐ {stats.averageRating}/5</span>
                              </div>
                            </>
                          )}

                          {user.role === 'institution' && (
                            <>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-purple-500" />
                                <span>{user.member_count || 0} members</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No users have been registered yet'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
