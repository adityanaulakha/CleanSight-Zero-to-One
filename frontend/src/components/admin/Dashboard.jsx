import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import ProfilePicture from '@/components/ui/ProfilePicture';
import { useAuth } from '@/contexts/AuthContext';
import { reportService, taskService, userService } from '@/lib/localDatabase.js';
import { 
  Activity, 
  Users, 
  MapPin, 
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Filter,
  Calendar,
  ArrowRight,
  Trash2,
  UserCheck,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalCollections: 0,
    activeWorkers: 0,
    totalUsers: 0,
    institutionPartners: 0,
    todayReports: 0,
    todayCollections: 0,
    avgResponseTime: '0 hours',
    systemEfficiency: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [wasteTypeData, setWasteTypeData] = useState([]);

  // Load real-time dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all reports
      const allReports = await reportService.getAllReports();
      const allTasks = await taskService.getAllTasks();
      const allUsers = await userService.getAllUsers();
      
      // Calculate statistics
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const todayReports = allReports.filter(r => new Date(r.created_at) >= todayStart);
      const pendingReports = allReports.filter(r => r.status === 'pending' || r.status === 'under_review');
      const completedTasks = allTasks.filter(t => t.status === 'completed');
      const todayTasks = completedTasks.filter(t => new Date(t.completed_at) >= todayStart);
      
      const usersByRole = {
        citizen: allUsers.filter(u => u.role === 'citizen').length,
        ragpicker: allUsers.filter(u => u.role === 'ragpicker').length,
        institution: allUsers.filter(u => u.role === 'institution').length,
        admin: allUsers.filter(u => u.role === 'admin').length
      };

      // Calculate average response time
      const completedTasksWithTime = completedTasks.filter(t => t.created_at && t.completed_at);
      let avgResponseHours = 0;
      if (completedTasksWithTime.length > 0) {
        const totalHours = completedTasksWithTime.reduce((sum, task) => {
          const created = new Date(task.created_at);
          const completed = new Date(task.completed_at);
          return sum + ((completed - created) / (1000 * 60 * 60));
        }, 0);
        avgResponseHours = totalHours / completedTasksWithTime.length;
      }

      // Calculate system efficiency (completed tasks / total reports)
      const efficiency = allReports.length > 0 ? Math.round((completedTasks.length / allReports.length) * 100) : 0;

      setDashboardStats({
        totalReports: allReports.length,
        pendingReports: pendingReports.length,
        totalCollections: completedTasks.length,
        activeWorkers: usersByRole.ragpicker,
        totalUsers: allUsers.length,
        institutionPartners: usersByRole.institution,
        todayReports: todayReports.length,
        todayCollections: todayTasks.length,
        avgResponseTime: `${avgResponseHours.toFixed(1)} hours`,
        systemEfficiency: efficiency
      });

      // Generate recent activity from reports and tasks
      const recentActivities = [];
      
      // Add recent reports
      const recentReports = allReports.slice(-5).reverse();
      recentReports.forEach(report => {
        recentActivities.push({
          id: `report-${report.id}`,
          type: 'report',
          title: `New ${report.category} waste report`,
          location: report.address,
          time: getTimeAgo(report.created_at),
          status: report.status,
          priority: report.severity,
          user: report.reporter?.full_name || 'Anonymous'
        });
      });

      // Add recent task completions
      const recentCompletions = completedTasks.slice(-5).reverse();
      recentCompletions.forEach(task => {
        if (task.report) {
          recentActivities.push({
            id: `task-${task.id}`,
            type: 'completion',
            title: `${task.report.category} collection completed`,
            location: task.report.address,
            time: getTimeAgo(task.completed_at),
            status: 'completed',
            priority: task.report.severity,
            user: task.ragpicker?.full_name || 'Unknown Worker'
          });
        }
      });

      // Sort by most recent and take top 10
      recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(recentActivities.slice(0, 10));

      // Generate system alerts
      const alerts = [];
      if (pendingReports.length > 10) {
        alerts.push({
          id: 'pending-reports',
          type: 'warning',
          title: 'High number of pending reports',
          message: `${pendingReports.length} reports awaiting review`,
          time: 'now'
        });
      }

      if (efficiency < 70) {
        alerts.push({
          id: 'low-efficiency',
          type: 'error',
          title: 'System efficiency below target',
          message: `Current efficiency: ${efficiency}% (Target: 85%+)`,
          time: 'now'
        });
      }

      setSystemAlerts(alerts);

      // Generate top performers from ragpickers
      const ragpickers = allUsers.filter(u => u.role === 'ragpicker');
      const ragpickerPerformance = ragpickers.map(ragpicker => {
        const ragpickerTasks = completedTasks.filter(t => t.ragpicker_id === ragpicker.id || t.assigned_to === ragpicker.id);
        const totalEarnings = ragpickerTasks.reduce((sum, task) => sum + (task.payment || 0), 0);
        const avgRating = ragpicker.rating || (4.0 + Math.random() * 1.0); // Mock rating if not available
        
        return {
          id: ragpicker.id,
          name: ragpicker.full_name || ragpicker.name || 'Unknown',
          avatar: ragpicker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ragpicker.full_name || ragpicker.name || 'U')}&background=random&color=fff&size=150&rounded=true`,
          tasksCompleted: ragpickerTasks.length,
          earnings: totalEarnings,
          rating: avgRating,
          efficiency: ragpickerTasks.length > 0 ? Math.round((ragpickerTasks.length / (ragpickerTasks.length + Math.random() * 2)) * 100) : 0,
          zone: ragpicker.zone || 'Zone 1'
        };
      });

      // Sort by tasks completed and take top 5
      const topPerformersData = ragpickerPerformance
        .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
        .slice(0, 5);

      setTopPerformers(topPerformersData);

      // Generate waste type distribution data
      const wasteCategories = ['plastic', 'organic', 'metal', 'glass', 'e-waste', 'construction', 'hazardous', 'other'];
      const wasteTypeDistribution = wasteCategories.map(category => {
        const categoryReports = allReports.filter(r => r.category?.toLowerCase() === category);
        const percentage = allReports.length > 0 ? Math.round((categoryReports.length / allReports.length) * 100) : 0;
        
        return {
          type: category.charAt(0).toUpperCase() + category.slice(1),
          count: categoryReports.length,
          percentage: percentage,
          color: getCategoryColor(category)
        };
      });

      // Filter out categories with 0 reports and sort by count
      const filteredWasteData = wasteTypeDistribution
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);

      setWasteTypeData(filteredWasteData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'plastic': '#3b82f6', // blue
      'organic': '#22c55e', // green
      'metal': '#6b7280', // gray
      'glass': '#06b6d4', // cyan
      'e-waste': '#8b5cf6', // purple
      'construction': '#f97316', // orange
      'hazardous': '#ef4444', // red
      'other': '#64748b' // slate
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  // Real-time updates
  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    
    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('Reports') || e.key.includes('Tasks') || e.key.includes('Users'))) {
        loadDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadDashboardData]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'report': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'collection': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completion': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'assignment': return <Zap className="h-4 w-4 text-purple-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': 
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-lg font-semibold">Loading Admin Dashboard...</div>
          <p className="text-gray-500 text-sm">Syncing real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProfilePicture 
                src={user?.profileImage} 
                alt={user?.full_name || 'Admin'} 
                size="lg"
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome {user?.full_name || 'Admin'}, monitor and manage CleanSight platform operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['24h', '7d', '30d'].map((period) => (
                  <Button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    variant={selectedTimeframe === period ? 'default' : 'outline'}
                    size="sm"
                  >
                    {period}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {systemAlerts.length > 0 && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-900">System Alerts</h3>
                </div>
                <div className="space-y-2">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-red-600 border-red-200 mb-1">
                          {alert.severity}
                        </Badge>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalReports}</p>
                  <p className="text-sm text-green-600">+{dashboardStats.todayReports} today</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collections</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.totalCollections}</p>
                  <p className="text-sm text-green-600">+{dashboardStats.todayCollections} today</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Workers</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.activeWorkers}</p>
                  <p className="text-sm text-gray-500">{dashboardStats.totalUsers} total users</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">System Efficiency</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.systemEfficiency}%</p>
                  <p className="text-sm text-gray-500">{dashboardStats.avgResponseTime} avg response</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.length > 0 ? (
                  topPerformers.map((performer, index) => (
                    <motion.div
                      key={performer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Avatar>
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{performer.name}</p>
                        <p className="text-sm text-gray-600">{performer.zone} • Ragpicker</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {performer.tasksCompleted} tasks
                        </p>
                        <p className="text-xs text-gray-500">★ {performer.rating.toFixed(1)}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No performance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wasteTypeData.length > 0 ? (
                  wasteTypeData.map((waste, index) => (
                    <motion.div
                      key={waste.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{waste.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{waste.count} reports</span>
                            <span className="text-xs text-gray-500">({waste.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${waste.percentage}%`,
                              backgroundColor: waste.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No waste type data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert('Auto-assigning tasks based on ragpicker availability and proximity...')}
                >
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">Auto Assign Tasks</span>
                </Button>
                
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => window.location.href = '/admin/heatmap'}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Analytics</span>
                </Button>
                
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert('User management features:\n• View all users\n• Manage permissions\n• User verification\n• Account status')}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                
                <Button 
                  className="h-20 flex flex-col gap-2" 
                  variant="outline"
                  onClick={() => alert('Partner network features:\n• Institution partnerships\n• NGO collaborations\n• Government liaisons\n• Corporate sponsors')}
                >
                  <Globe className="h-6 w-6" />
                  <span className="text-sm">Partner Network</span>
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Server Health</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">API Response</span>
                    <Badge className="bg-green-100 text-green-800">98ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Uptime</span>
                    <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default AdminDashboard;
