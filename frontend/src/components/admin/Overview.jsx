import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  Camera,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Bell,
  Activity,
  BarChart3,
  Calendar,
  Target,
  Globe,
  Recycle,
  Award,
  Settings
} from 'lucide-react';

const AdminOverview = () => {
  const [timeRange, setTimeRange] = useState('today');

  const liveStats = {
    newSubmissions: {
      count: 47,
      change: '+12%',
      trend: 'up'
    },
    verificationBacklog: {
      count: 23,
      change: '-8%',
      trend: 'down'
    },
    avgSLA: {
      time: '2.3 hrs',
      change: '-15%',
      trend: 'down'
    },
    activeRagpickers: {
      count: 89,
      change: '+5%',
      trend: 'up'
    },
    compostStock: {
      amount: '450 kg',
      change: '+20%',
      trend: 'up'
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'report_submitted',
      user: 'Priya Sharma',
      location: 'MG Road, Bangalore',
      time: '2 mins ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'task_completed',
      user: 'Raj Kumar (Ragpicker)',
      location: 'Indiranagar Park',
      time: '5 mins ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'report_verified',
      user: 'Admin',
      location: 'Brigade Road',
      time: '8 mins ago',
      status: 'verified'
    },
    {
      id: 4,
      type: 'user_registered',
      user: 'Maya Chen',
      location: 'HSR Layout',
      time: '12 mins ago',
      status: 'new'
    },
    {
      id: 5,
      type: 'reward_redeemed',
      user: 'Arjun Singh',
      location: 'Whitefield',
      time: '15 mins ago',
      status: 'processed'
    }
  ];

  const topPerformers = [
    { name: 'Priya Sharma', reports: 156, points: 2840, role: 'citizen' },
    { name: 'Raj Kumar', tasks: 89, earnings: 4200, role: 'ragpicker' },
    { name: 'Green Earth NGO', cleanups: 23, impact: '2.3T', role: 'institution' },
    { name: 'Maya Chen', reports: 134, points: 2650, role: 'citizen' }
  ];

  const alerts = [
    {
      id: 1,
      type: 'high_priority',
      message: 'High priority report needs immediate attention in Electronic City',
      time: '5 mins ago',
      status: 'urgent'
    },
    {
      id: 2,
      type: 'sla_breach',
      message: 'SLA breach warning: 3 reports pending for >24 hours',
      time: '20 mins ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'system',
      message: 'Scheduled maintenance in 2 hours - backup completed',
      time: '1 hour ago',
      status: 'info'
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      report_submitted: Camera,
      task_completed: CheckCircle,
      report_verified: Award,
      user_registered: Users,
      reward_redeemed: Gift
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      report_submitted: 'text-blue-500',
      task_completed: 'text-green-500',
      report_verified: 'text-purple-500',
      user_registered: 'text-cyan-500',
      reward_redeemed: 'text-yellow-500'
    };
    return colors[type] || 'text-gray-500';
  };

  const getAlertColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Overview</h1>
          <p className="text-gray-600">Monitor system performance and manage operations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-lg">
            {['today', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                } ${range === 'today' ? 'rounded-l-md' : range === '30d' ? 'rounded-r-md' : ''}`}
              >
                {range === 'today' ? 'Today' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              alert('Refreshing live dashboard data...\n\nUpdating:\n• Real-time statistics\n• Active ragpicker locations\n• Recent activity feed\n• System performance metrics');
              // Simulate refresh
              setTimeout(() => alert('Dashboard data refreshed successfully!'), 1500);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Exporting admin overview data...\n\nGenerating comprehensive report including:\n• System statistics\n• Performance metrics\n• User activity summary\n• Regional breakdowns\n\nReport will be downloaded as PDF/CSV.')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(liveStats).map(([key, stat], index) => {
          const isPositiveTrend = stat.trend === 'up';
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {typeof stat.count !== 'undefined' ? stat.count : stat.time || stat.amount}
                    </div>
                    <div className={`flex items-center text-sm ${
                      isPositiveTrend ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${!isPositiveTrend ? 'rotate-180' : ''}`} />
                      {stat.change}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  
                  {key === 'newSubmissions' && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last hour: +8 reports
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => window.location.href = '/admin/moderation'}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Open Moderation</div>
                <div className="text-xs text-gray-500">{liveStats.verificationBacklog.count} pending</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => window.location.href = '/admin/assignment'}
            >
              <MapPin className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">Assignment Console</div>
                <div className="text-xs text-gray-500">Assign to ragpickers</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">Analytics</div>
                <div className="text-xs text-gray-500">View detailed reports</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => alert('Exporting platform data...\n\nGenerating comprehensive export including:\n• User reports and submissions\n• Ragpicker performance data\n• Institution partnerships\n• Financial transactions\n• System logs\n\nData will be available in CSV and PDF formats.')}
            >
              <Download className="h-5 w-5 text-orange-500" />
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-xs text-gray-500">CSV & PDF reports</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-2 rounded-full bg-white ${getActivityColor(activity.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {activity.user}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {activity.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {performer.name}
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {performer.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {performer.reports && `${performer.reports} reports`}
                      {performer.tasks && `${performer.tasks} tasks`}
                      {performer.cleanups && `${performer.cleanups} cleanups`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {performer.points && `${performer.points} points`}
                      {performer.earnings && `₹${performer.earnings}`}
                      {performer.impact && `${performer.impact} waste`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            System Alerts
            <Badge variant="destructive" className="ml-2">
              {alerts.filter(a => a.status === 'urgent').length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getAlertColor(alert.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-75 mt-1">{alert.time}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {alert.status === 'urgent' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => alert(`URGENT: ${alert.message}\n\nImmediate action required!\n\nThis will redirect to the appropriate management console for resolution.`)}
                      >
                        Action Required
                      </Button>
                    )}
                    {alert.status === 'warning' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert(`WARNING: ${alert.message}\n\nReview needed.\n\nClick to view details and recommended actions.`)}
                      >
                        Review
                      </Button>
                    )}
                    {alert.status === 'info' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => alert(`Dismissing alert: ${alert.message}\n\nThis notification will be marked as read and removed from the alerts panel.`)}
                      >
                        Dismiss
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Server Load</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Database Performance</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>API Response Time</span>
                  <span>145ms</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Images</span>
                  <span>2.3 GB</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Database</span>
                  <span>890 MB</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Backups</span>
                  <span>1.8 GB</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold">1,247</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reports Today</span>
                <span className="font-semibold">89</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response</span>
                <span className="font-semibold">2.1 hrs</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
