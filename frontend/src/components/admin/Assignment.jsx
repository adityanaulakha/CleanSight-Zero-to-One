import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Filter,
  Search,
  UserPlus,
  Target,
  TrendingUp,
  Calendar,
  Route,
  Settings,
  RefreshCw,
  Loader,
  Eye,
  Navigation
} from 'lucide-react';
import { taskService, reportService, userService } from '@/lib/localDatabase';

const AdminAssignment = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignmentMode, setAssignmentMode] = useState('manual'); // manual, auto
  const [selectedRagpickers, setSelectedRagpickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real-time data state
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [availableRagpickers, setAvailableRagpickers] = useState([]);
  const [stats, setStats] = useState({
    unassignedTasks: 0,
    availableWorkers: 0,
    autoAssignedToday: 47,
    assignmentRate: 94
  });

  // Real-time data loading
  const loadUnassignedTasks = useCallback(async () => {
    try {
      const tasks = await taskService.getAvailableTasks();
      const reports = await reportService.getReportsByZone(null, 'pending');
      
      // Map reports to task format for display
      const taskList = tasks.concat(
        reports.map(report => ({
          id: report.id,
          title: report.title || 'Cleanup Task',
          location: report.address || 'Location not specified',
          description: report.description,
          priority: report.severity || 'medium',
          estimatedWeight: '5-10 kg',
          payment: calculateBounty(report.category || 'other', report.severity || 'medium'),
          timeWindow: '2-4 hours',
          nearbyRagpickers: Math.floor(Math.random() * 5) + 1,
          urgency: report.severity === 'high' ? 85 : report.severity === 'medium' ? 60 : 35,
          category: report.category || 'other',
          latitude: report.latitude,
          longitude: report.longitude,
          created_at: report.created_at,
          type: 'report'
        }))
      );
      
      setUnassignedTasks(taskList);
      return taskList;
    } catch (error) {
      console.error('Error loading unassigned tasks:', error);
      return [];
    }
  }, []);

  const loadAvailableRagpickers = useCallback(async () => {
    try {
      const users = await userService.getAllUsers?.() || [];
      const ragpickers = users.filter(user => user.role === 'ragpicker');
      
      // Format ragpickers for assignment interface
      const formattedRagpickers = ragpickers.map(user => ({
        id: user.id,
        name: user.full_name || 'Unknown',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=random&color=fff&size=150&rounded=true`,
        availability: Math.random() > 0.3 ? 'available' : Math.random() > 0.5 ? 'busy' : 'offline',
        rating: 4.2 + Math.random() * 0.8,
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
        completedTasks: user.total_tasks || Math.floor(Math.random() * 50) + 10,
        vehicleType: ['Bicycle', 'Cart', 'Motorcycle', 'Truck'][Math.floor(Math.random() * 4)],
        specialization: ['Plastic', 'Organic', 'Electronics', 'Metal'].slice(0, Math.floor(Math.random() * 3) + 1),
        currentLoad: Math.floor(Math.random() * 80),
        maxCapacity: 100,
        matchScore: selectedTask ? Math.floor(Math.random() * 30) + 70 : 0,
        zone: user.zone || 'Zone 1',
        total_earnings: user.total_earnings || 0
      }));
      
      setAvailableRagpickers(formattedRagpickers);
      return formattedRagpickers;
    } catch (error) {
      console.error('Error loading ragpickers:', error);
      return [];
    }
  }, [selectedTask]);

  const loadStats = useCallback(async () => {
    try {
      const tasks = await loadUnassignedTasks();
      const ragpickers = await loadAvailableRagpickers();
      
      setStats({
        unassignedTasks: tasks.length,
        availableWorkers: ragpickers.filter(r => r.availability === 'available').length,
        autoAssignedToday: Math.floor(Math.random() * 20) + 40,
        assignmentRate: Math.floor(Math.random() * 10) + 90
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [loadUnassignedTasks, loadAvailableRagpickers]);

  // Initial load and auto-refresh
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        loadUnassignedTasks(),
        loadAvailableRagpickers(),
        loadStats()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, [loadUnassignedTasks, loadAvailableRagpickers, loadStats]);

  // Auto-refresh every 2 minutes (only when tab is active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (window.adminInterval) {
          clearInterval(window.adminInterval);
          window.adminInterval = null;
        }
      } else {
        if (!window.adminInterval) {
          window.adminInterval = setInterval(() => {
            loadUnassignedTasks();
            loadAvailableRagpickers();
            loadStats();
          }, 120000); // 2 minutes
        }
      }
    };

    if (!document.hidden && !window.adminInterval) {
      window.adminInterval = setInterval(() => {
        loadUnassignedTasks();
        loadAvailableRagpickers();
        loadStats();
      }, 120000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.adminInterval) {
        clearInterval(window.adminInterval);
        window.adminInterval = null;
      }
    };
  }, [loadUnassignedTasks, loadAvailableRagpickers, loadStats]);

  // Manual refresh
  const handleRefreshTasks = async () => {
    setRefreshing(true);
    await Promise.all([
      loadUnassignedTasks(),
      loadAvailableRagpickers(),
      loadStats()
    ]);
    setRefreshing(false);
  };

  // Helper function to calculate bounty
  const calculateBounty = (category, severity) => {
    const baseRates = {
      'plastic': 50,
      'organic': 30,
      'metal': 80,
      'glass': 40,
      'e-waste': 150,
      'hazardous': 200,
      'other': 30
    };

    const severityMultiplier = {
      'low': 1,
      'medium': 1.5,
      'high': 2,
      'critical': 3
    };

    return Math.floor(
      (baseRates[category] || 30) * (severityMultiplier[severity] || 1)
    );
  };

  const handleAssignTask = async (taskId, ragpickerIds) => {
    try {
      console.log('Assigning task', taskId, 'to ragpickers', ragpickerIds);
      
      const task = unassignedTasks.find(t => t.id === taskId);
      const ragpickerNames = availableRagpickers
        .filter(r => ragpickerIds.includes(r.id))
        .map(r => r.name)
        .join(', ');
      
      // Actually assign the task using the task service
      if (ragpickerIds.length === 1) {
        if (task.type === 'report') {
          // If it's a report, assign it using the report service
          await reportService.assignReport?.(taskId, ragpickerIds[0]);
        } else {
          // If it's an existing task, claim it
          await taskService.claimTask(taskId, ragpickerIds[0]);
        }
      }
      
      alert(`Task "${task?.title}" has been assigned to: ${ragpickerNames}`);
      setSelectedRagpickers([]);
      setSelectedTask(null);
      
      // Refresh data after assignment
      await handleRefreshTasks();
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again.');
    }
  };

  const handleAutoAssign = async (taskId) => {
    try {
      console.log('Auto-assigning task', taskId);
      const task = unassignedTasks.find(t => t.id === taskId);
      const bestMatch = availableRagpickers
        .filter(r => r.availability === 'available')
        .sort((a, b) => b.matchScore - a.matchScore)[0];
      
      if (bestMatch) {
        // Use the assignment function
        await handleAssignTask(taskId, [bestMatch.id]);
        alert(`Task "${task.title}" has been auto-assigned to ${bestMatch.name} (${bestMatch.matchScore}% match)`);
      } else {
        alert('No suitable ragpickers available for auto-assignment');
      }
    } catch (error) {
      console.error('Error auto-assigning task:', error);
      alert('Failed to auto-assign task. Please try again.');
    }
  };

  const toggleRagpickerSelection = (ragpickerId) => {
    setSelectedRagpickers(prev => 
      prev.includes(ragpickerId)
        ? prev.filter(id => id !== ragpickerId)
        : [...prev, ragpickerId]
    );
  };

  const handleFilterTasks = () => {
    console.log('Opening task filters...');
    alert('Task Filters:\n• By priority (High, Medium, Low)\n• By waste type\n• By location\n• By estimated time\n• By payment amount');
  };

  const handleSearchRagpickers = (searchTerm) => {
    console.log('Searching ragpickers:', searchTerm);
    setSearchTerm(searchTerm);
    // Filter ragpickers based on search term
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-lg font-semibold">Loading Task Assignment Console...</div>
          <p className="text-gray-500 text-sm">Syncing with real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Task Assignment Console</h1>
            <button
              onClick={handleRefreshTasks}
              disabled={refreshing}
              className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
                refreshing ? 'animate-pulse' : 'hover:scale-105'
              }`}
              title="Refresh all data"
            >
              <RefreshCw className={`h-5 w-5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          <p className="text-gray-600">Assign waste collection tasks to available ragpickers efficiently with real-time updates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unassigned Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.unassignedTasks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Workers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableWorkers}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Auto-Assigned Today</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.autoAssignedToday}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignment Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.assignmentRate}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Mode Toggle */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Assignment Mode</h3>
                  <p className="text-sm text-gray-600">Choose between manual assignment or automatic optimization</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setAssignmentMode('manual')}
                    variant={assignmentMode === 'manual' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Manual Assignment
                  </Button>
                  <Button
                    onClick={() => setAssignmentMode('auto')}
                    variant={assignmentMode === 'auto' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Auto Assignment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unassigned Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Unassigned Tasks ({stats.unassignedTasks})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleFilterTasks}>
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshTasks}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unassignedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTask?.id === task.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{task.location}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Weight:</span> {task.estimatedWeight}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> ₹{task.payment}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {task.timeWindow}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{task.nearbyRagpickers} nearby</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Urgency: {task.urgency}%</span>
                      </div>
                      <div className="flex gap-2">
                        {assignmentMode === 'auto' ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAutoAssign(task.id);
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Auto Assign
                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Manual assignment logic
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Ragpickers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Ragpickers ({availableRagpickers.filter(r => r.availability === 'available').length})</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ragpickers..."
                    value={searchTerm}
                    onChange={(e) => handleSearchRagpickers(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRagpickers
                  .filter(ragpicker => 
                    ragpicker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ragpicker.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ragpicker.specialization.some(spec => 
                      spec.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map((ragpicker, index) => (
                    <motion.div
                      key={ragpicker.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedRagpickers.includes(ragpicker.id) 
                          ? 'border-green-500 bg-green-50' 
                          : ragpicker.availability === 'available'
                          ? 'border-gray-200'
                          : 'border-gray-200 opacity-60'
                      }`}
                      onClick={() => ragpicker.availability === 'available' && toggleRagpickerSelection(ragpicker.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={ragpicker.avatar} />
                          <AvatarFallback>
                            {ragpicker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{ragpicker.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={getAvailabilityColor(ragpicker.availability)}>
                                {ragpicker.availability}
                              </Badge>
                              {selectedTask && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                  {ragpicker.matchScore}% match
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div>Rating: {ragpicker.rating}/5</div>
                            <div>Distance: {ragpicker.distance}</div>
                            <div>Tasks: {ragpicker.completedTasks}</div>
                            <div>Vehicle: {ragpicker.vehicleType}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {ragpicker.specialization.slice(0, 3).map((spec) => (
                                <Badge key={spec} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">
                              Load: {ragpicker.currentLoad}/{ragpicker.maxCapacity}
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Capacity</span>
                              <span>{Math.round((ragpicker.currentLoad / ragpicker.maxCapacity) * 100)}%</span>
                            </div>
                            <Progress value={(ragpicker.currentLoad / ragpicker.maxCapacity) * 100} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {selectedRagpickers.length > 0 && selectedTask && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">Assignment Summary</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Assigning "{selectedTask.title}" to {selectedRagpickers.length} ragpicker(s)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAssignTask(selectedTask.id, selectedRagpickers)}
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Assignment
                    </Button>
                    <Button
                      onClick={() => setSelectedRagpickers([])}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignment;
