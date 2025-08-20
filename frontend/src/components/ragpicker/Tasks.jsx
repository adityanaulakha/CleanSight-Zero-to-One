import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProfilePicture from '@/components/ui/ProfilePicture';
import {
  MapPin,
  Clock,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Star,
  Filter,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Camera,
  Upload,
  X,
  Loader,
  Eye,
  Recycle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { taskService, reportService, userService, workerService } from '@/lib/localDatabase.js';

const RagpickerTasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [availableReports, setAvailableReports] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [ragpickers, setRagpickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    tasksCompleted: 0,
    averageRating: 4.5,
    activeHours: 32
  });
  
  // Task completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionTask, setCompletionTask] = useState(null);
  const [completionData, setCompletionData] = useState({
    weight: '',
    notes: ''
  });
  const [cleanupImage, setCleanupImage] = useState(null);
  const [cleanupImageFile, setCleanupImageFile] = useState(null);
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  // Real-time data loading with enhanced sync
  const loadTasks = useCallback(async () => {
    if (!user || user.role !== 'ragpicker') return;
    
    try {
      setLoading(true);
      
      // Load available tasks in the ragpicker's zone with real-time sync
      console.log(`🔍 Loading tasks for ragpicker in zone: ${user.zone}`);
      const availableTasks = await taskService.getAvailableTasks(user.zone);
      console.log(`📋 Found ${availableTasks.length} available task(s) in your zone`);
      
      const enhancedAvailableTasks = availableTasks.map(task => ({
        ...task,
        // Add real-time distance calculation
        distance: calculateDistance(
          user.latitude || 28.4595, 
          user.longitude || 77.0266, 
          task.latitude, 
          task.longitude
        ).toFixed(1),
        // Add estimated travel time
        estimatedTravelTime: Math.ceil(calculateDistance(
          user.latitude || 28.4595, 
          user.longitude || 77.0266, 
          task.latitude, 
          task.longitude
        ) / 20 * 60), // Assuming 20 km/h average speed
        // Add real-time task urgency based on time elapsed
        urgencyScore: calculateUrgencyScore(task.created_at, task.severity),
        // Add real-time payment calculation
        calculatedPayment: calculateDynamicBounty(task.category, task.severity, task.created_at)
      }));
      
      // Sort by urgency and proximity
      enhancedAvailableTasks.sort((a, b) => {
        return (b.urgencyScore * 0.7) + ((10 - parseFloat(a.distance)) * 0.3) - 
               ((a.urgencyScore * 0.7) + ((10 - parseFloat(b.distance)) * 0.3));
      });
      
      setAvailableReports(enhancedAvailableTasks);
      
      // Load assigned tasks with progress tracking
      const assignedTasks = await taskService.getTasksByRagpicker(user.id, 'assigned');
      const inProgressTasks = await taskService.getTasksByRagpicker(user.id, 'in_progress');
      const allAssignedTasks = [...assignedTasks, ...inProgressTasks].map(task => ({
        ...task,
        // Add real-time progress tracking
        progressPercentage: calculateTaskProgress(task),
        timeElapsed: calculateTimeElapsed(task.assigned_at || task.started_at),
        estimatedCompletion: calculateEstimatedCompletion(task)
      }));
      
      setAssignedTasks(allAssignedTasks);
      
      // Load completed tasks with enhanced details
      const completedTasks = await taskService.getTasksByRagpicker(user.id, 'completed');
      const enhancedCompletedTasks = completedTasks.map(task => ({
        ...task,
        actualDuration: calculateActualDuration(task.assigned_at, task.completed_at),
        efficiencyRating: calculateEfficiencyRating(task)
      }));
      
      setCompletedTasks(enhancedCompletedTasks);
      
      // Sync with localStorage for offline capability
      localStorage.setItem(`ragpicker_tasks_${user.id}`, JSON.stringify({
        available: enhancedAvailableTasks,
        assigned: allAssignedTasks,
        completed: enhancedCompletedTasks,
        lastSync: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Load from local storage if available
      const cachedTasks = localStorage.getItem(`ragpicker_tasks_${user.id}`);
      if (cachedTasks) {
        const parsed = JSON.parse(cachedTasks);
        setAvailableReports(parsed.available || []);
        setAssignedTasks(parsed.assigned || []);
        setCompletedTasks(parsed.completed || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadStats = useCallback(async () => {
    if (!user || user.role !== 'ragpicker') return;
    
    try {
      console.log('📊 Loading real-time stats for ragpicker:', user.id);
      
      // Get real-time stats from the enhanced service
      const realTimeStats = await taskService.getRagpickerStats(user.id);
      console.log('📈 Stats loaded:', realTimeStats);
      
      setStats({
        totalEarnings: realTimeStats.totalEarnings,
        tasksCompleted: realTimeStats.tasksCompleted,
        averageRating: realTimeStats.averageRating,
        activeHours: realTimeStats.hoursThisWeek
      });

      // Update user record with latest stats
      await taskService.updateRagpickerStats(user.id);
      
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default stats if service fails
      setStats({
        totalEarnings: user.total_earnings || 0,
        tasksCompleted: completedTasks.length,
        averageRating: user.average_rating || 4.5,
        activeHours: user.hours_this_week || 0
      });
    }
  }, [user, completedTasks.length]);

  const loadWorkers = useCallback(async () => {
    try {
      if (user?.id) {
        const kioskWorkers = await workerService.getWorkersByKiosk(user.id);
        console.log('Loaded workers for kiosk:', user.id, kioskWorkers);
        setWorkers(kioskWorkers);
      }
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  }, [user?.id]);

  const loadRagpickers = useCallback(async () => {
    try {
      const allRagpickers = await userService.getUsersByRole('ragpicker');
      console.log('Loaded ragpickers:', allRagpickers);
      setRagpickers(allRagpickers);
    } catch (error) {
      console.error('Error loading ragpickers:', error);
    }
  }, []);

  // Initial load and real-time setup
  useEffect(() => {
    loadTasks();
    loadWorkers();
    loadRagpickers();
    
    // Request notification permission for real-time alerts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Push notifications enabled for real-time task updates');
        }
      });
    }
  }, [loadTasks, loadWorkers, loadRagpickers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Enhanced real-time auto-refresh with dynamic intervals
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, reduce refresh frequency
        if (window.tasksInterval) {
          clearInterval(window.tasksInterval);
          window.tasksInterval = null;
        }
      } else {
        // Tab is active, increase refresh frequency
        if (!window.tasksInterval) {
          window.tasksInterval = setInterval(() => {
            loadTasks();
            loadStats();
            loadWorkers();
            loadRagpickers();
          }, 30000); // 30 seconds when active
        }
      }
    };

    // Set up initial interval for active tab
    if (!document.hidden && !window.tasksInterval) {
      window.tasksInterval = setInterval(() => {
        loadTasks();
        loadStats();
        loadWorkers();
        loadRagpickers();
      }, 30000);
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for localStorage changes from other tabs (citizen reports)
    const handleStorageChange = (event) => {
      if (event.key === 'cleansight_reports' || event.key === 'cleansight_tasks') {
        console.log('🔄 Real-time sync: New data detected from citizen portal');
        
        // Check if the new report/task is in the same zone
        if (event.key === 'cleansight_reports' && event.newValue) {
          try {
            const reports = JSON.parse(event.newValue);
            const newReports = reports.filter(report => {
              const reportDate = new Date(report.created_at);
              const now = new Date();
              const timeDiff = (now - reportDate) / 1000; // seconds
              
              // Check if report is very recent (within last 10 seconds) and from same zone
              return timeDiff < 10 && report.status === 'pending';
            });
            
            if (newReports.length > 0) {
              console.log(`🆕 ${newReports.length} new report(s) detected, checking zone compatibility...`);
              
              // Check if any new reports are in the ragpicker's zone
              const relevantReports = newReports.filter(report => {
                // Get the citizen who created this report
                const reporterZone = report.reporter_zone || report.zone;
                return reporterZone === user?.zone;
              });
              
              if (relevantReports.length > 0) {
                console.log(`✅ ${relevantReports.length} report(s) match your zone: ${user?.zone}`);
                
                // Show real-time notification
                if (Notification.permission === 'granted') {
                  const reportCount = relevantReports.length;
                  const zoneText = user?.zone?.split(' - ')[1] || user?.zone || 'your area';
                  
                  new Notification(`🚨 ${reportCount} New Task${reportCount > 1 ? 's' : ''} Available!`, {
                    body: `New waste collection task${reportCount > 1 ? 's' : ''} reported in ${zoneText}. Tap to view details.`,
                    icon: '/icon-192x192.png',
                    tag: 'new-tasks',
                    requireInteraction: true
                  });
                }
                
                // Immediate refresh for zone-matching reports
                setTimeout(() => {
                  console.log('🔄 Triggering immediate refresh for zone-matched reports');
                  loadTasks();
                  loadStats();
                }, 500); // Small delay to ensure database consistency
              } else {
                console.log(`ℹ️ New reports detected but not in your zone (${user?.zone})`);
              }
            }
          } catch (error) {
            console.error('Error parsing new reports:', error);
          }
        }
        
        // For task updates, always refresh
        if (event.key === 'cleansight_tasks') {
          console.log('🔄 Task updates detected, refreshing...');
          setTimeout(() => {
            loadTasks();
            loadStats();
          }, 1000);
        }

        // For user updates (earnings, ratings, etc.), refresh stats
        if (event.key === 'cleansight_users') {
          console.log('👤 User data updated, refreshing stats...');
          setTimeout(() => {
            loadStats();
          }, 500);
        }

        // For rewards updates, refresh stats
        if (event.key === 'cleansight_rewards') {
          console.log('🎁 Rewards updated, refreshing stats...');
          setTimeout(() => {
            loadStats();
          }, 500);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Enhanced real-time sync with server simulation
    const simulateRealTimeUpdates = () => {
      // Simulate WebSocket-like real-time updates
      const updates = ['new_task', 'task_claimed', 'task_completed', 'urgent_task'];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      
      switch (randomUpdate) {
        case 'new_task':
          // Show notification for new tasks
          if (Notification.permission === 'granted') {
            new Notification('New Task Available!', {
              body: 'A new waste collection task is available in your area.',
              icon: '/icon-192x192.png'
            });
          }
          break;
        case 'urgent_task':
          console.log('🚨 Urgent task detected - triggering immediate refresh');
          loadTasks();
          break;
      }
    };

    // Run real-time simulation every 2 minutes
    const realTimeSimulation = setInterval(simulateRealTimeUpdates, 120000);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      
      if (window.tasksInterval) {
        clearInterval(window.tasksInterval);
        window.tasksInterval = null;
      }
      
      clearInterval(realTimeSimulation);
    };
  }, [loadTasks, loadStats]);

  // Manual refresh
  const handleRefreshTasks = async () => {
    setRefreshing(true);
    await loadTasks();
    await loadStats();
    setRefreshing(false);
  };

  // Work session management
  const [isWorkingActive, setIsWorkingActive] = useState(false);
  
  const handleToggleWorkSession = async () => {
    try {
      if (isWorkingActive) {
        await taskService.endWorkSession(user.id);
        setIsWorkingActive(false);
        console.log('🏁 Work session ended');
      } else {
        await taskService.startWorkSession(user.id);
        setIsWorkingActive(true);
        console.log('🚀 Work session started');
      }
      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error toggling work session:', error);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      await taskService.claimTask(taskId, user.id);
      alert('Task claimed successfully! You can now navigate to the location.');
      await loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error claiming task:', error);
      alert('Failed to claim task. It may have already been taken by another ragpicker.');
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await taskService.startTask(taskId, user.id);
      alert('Task started! Remember to take before photos.');
      await loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error starting task:', error);
      alert('Failed to start task. Please try again.');
    }
  };

  const handleCompleteTask = async (taskId, completionData, imageFile) => {
    try {
      await taskService.completeTask(taskId, user.id, completionData, imageFile);
      alert('Task completed successfully! Rewards have been credited.');
      await loadTasks(); // Refresh tasks
      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  const handleViewLocation = (task) => {
    const latitude = task.report?.latitude || task.latitude;
    const longitude = task.report?.longitude || task.longitude;
    
    if (latitude && longitude) {
      // Open in Google Maps
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      alert(`Location: ${task.report?.address || task.address}`);
    }
  };

  const handleNavigate = (task) => {
    const latitude = task.report?.latitude || task.latitude;
    const longitude = task.report?.longitude || task.longitude;
    
    if (latitude && longitude) {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      alert(`Starting navigation to: ${task.report?.address || task.address}`);
    }
  };

  const handleUpdateStatus = (task) => {
    setCompletionTask(task);
    setShowCompletionModal(true);
    setCompletionData({ weight: '', notes: '' });
    setCleanupImage(null);
    setCleanupImageFile(null);
  };

  const handleCleanupImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      
      setCleanupImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCleanupImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCompletion = async () => {
    if (!completionData.weight || isNaN(completionData.weight) || parseFloat(completionData.weight) <= 0) {
      alert('Please enter a valid weight in kg');
      return;
    }

    if (!cleanupImageFile) {
      alert('Please upload a photo of the cleaned area');
      return;
    }

    setIsSubmittingCompletion(true);
    
    try {
      const completionPayload = {
        weight: parseFloat(completionData.weight),
        notes: completionData.notes
      };

      await handleCompleteTask(completionTask.id, completionPayload, cleanupImageFile);
      setShowCompletionModal(false);
      setCompletionTask(null);
    } catch (error) {
      console.error('Error submitting completion:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const handleAssignTask = async (taskId, workerId) => {
    try {
      await taskService.assignTaskToWorker(taskId, workerId);
      alert('Task assigned successfully to team member!');
      
      // Close dialog and refresh data
      setShowAssignDialog(false);
      setSelectedWorker(null);
      await loadTasks();
      await loadWorkers();
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again.');
    }
  };

  const handleViewDetails = (task) => {
    const report = task.report || task;
    alert(`Task Details:\n\nTitle: ${report.title}\nLocation: ${report.address}\nCategory: ${report.category}\nSeverity: ${report.severity}\n\nDescription: ${report.description || 'No additional details'}`);
  };

  const handleFilterTasks = () => {
    alert('Filter options:\n- By waste type\n- By distance\n- By bounty amount\n- By urgency');
  };

  // Helper functions for real-time calculations
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateUrgencyScore = (createdAt, severity) => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    
    const severityMultiplier = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    
    const timeMultiplier = Math.min(hoursElapsed / 24, 2); // Max 2x multiplier for time
    return (severityMultiplier[severity] || 1) * (1 + timeMultiplier);
  };

  const calculateDynamicBounty = (category, severity, createdAt) => {
    // Use simple fixed reward amounts without complex calculations
    const baseAmount = calculateBounty(category, severity);
    
    // Small bonus for urgent tasks (max ₹10 extra)
    const urgencyScore = calculateUrgencyScore(createdAt, severity);
    const urgencyBonus = Math.min(urgencyScore, 2) * 5; // Max ₹10 bonus
    
    return Math.round(baseAmount + urgencyBonus);
  };

  const calculateTaskProgress = (task) => {
    if (task.status === 'assigned') return 10;
    if (task.status === 'in_progress') return 60;
    if (task.status === 'completed') return 100;
    return 0;
  };

  const calculateTimeElapsed = (startTime) => {
    if (!startTime) return '0 min';
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = now - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const calculateEstimatedCompletion = (task) => {
    const baseTime = {
      'low': 30,
      'medium': 45,
      'high': 60,
      'critical': 90
    };
    
    const estimatedMinutes = baseTime[task.report?.severity] || 30;
    const now = new Date();
    const completion = new Date(now.getTime() + estimatedMinutes * 60000);
    
    return completion.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateActualDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const calculateEfficiencyRating = (task) => {
    // Mock efficiency calculation based on time and quality
    const baseRating = 4.0;
    const timeBonus = Math.random() * 1.0; // Mock calculation
    return Math.min(5.0, baseRating + timeBonus).toFixed(1);
  };

  const calculateBounty = (category, severity) => {
    // Realistic fixed rewards based on task severity (not category-dependent)
    const rewardAmounts = {
      'low': 25,        // ₹25 for small cleanup tasks
      'medium': 50,     // ₹50 for medium cleanup tasks  
      'high': 100,      // ₹100 for large cleanup tasks
      'critical': 150   // ₹150 for urgent/critical cleanup
    };

    return rewardAmounts[severity] || 50;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'traveling': return 'bg-blue-100 text-blue-800';
      case 'pickup_ready': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'available', label: 'Available', count: availableReports.length },
    { id: 'assigned', label: 'Assigned', count: assignedTasks.length },
    { id: 'completed', label: 'Completed', count: completedTasks.length },
    { id: 'workers', label: 'Team Members', count: workers.length },
    { id: 'ragpickers', label: 'All Ragpickers', count: ragpickers.length }
  ];

  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'available':
        return availableReports.map(report => ({
          id: report.id,
          title: report.title,
          location: report.address,
          description: report.description,
          category: report.category,
          severity: report.severity,
          reportedBy: report.reporter?.full_name || 'Anonymous',
          reportedAt: new Date(report.created_at).toLocaleDateString(),
          image_url: report.image_url,
          latitude: report.latitude,
          longitude: report.longitude,
          // Real-time enhancements
          distance: report.distance,
          estimatedTravelTime: report.estimatedTravelTime,
          urgencyScore: report.urgencyScore,
          calculatedPayment: report.calculatedPayment,
          timeAgo: getTimeAgo(report.created_at),
          isUrgent: report.urgencyScore > 3,
          distanceCategory: report.distance < 2 ? 'Very Close' : report.distance < 5 ? 'Nearby' : 'Far'
        }));
      case 'assigned':
        return assignedTasks.map(task => ({
          ...task,
          title: task.report?.title || 'Task',
          location: task.report?.address || 'Location not specified',
          description: task.report?.description || '',
          category: task.report?.category || 'other',
          severity: task.report?.severity || 'medium',
          image_url: task.report?.image_url,
          // Real-time progress tracking
          progressPercentage: task.progressPercentage,
          timeElapsed: task.timeElapsed,
          estimatedCompletion: task.estimatedCompletion,
          isOverdue: new Date() > new Date(task.estimatedCompletion),
          nextAction: task.status === 'assigned' ? 'Start Task' : 'Complete Task'
        }));
      case 'completed':
        return completedTasks.map(task => ({
          ...task,
          title: task.report?.title || 'Completed Task',
          location: task.report?.address || 'Location not specified',
          description: task.report?.description || '',
          category: task.report?.category || 'other',
          severity: task.report?.severity || 'medium',
          image_url: task.cleanup_image_url || task.report?.image_url,
          // Real-time completion details
          actualDuration: task.actualDuration,
          efficiencyRating: task.efficiencyRating,
          completedAgo: getTimeAgo(task.completed_at),
          earnings: task.earnings || 0
        }));
      case 'workers':
        return workers.map(worker => ({
          ...worker,
          statusColor: worker.status === 'active' ? 'text-green-600' : 
                      worker.status === 'on-task' ? 'text-blue-600' : 'text-gray-500',
          statusBg: worker.status === 'active' ? 'bg-green-100' : 
                   worker.status === 'on-task' ? 'bg-blue-100' : 'bg-gray-100'
        }));
      case 'ragpickers':
        return ragpickers.map(ragpicker => ({
          ...ragpicker,
          statusColor: ragpicker.status === 'active' ? 'text-green-600' : 
                      ragpicker.status === 'busy' ? 'text-orange-600' : 'text-gray-500',
          statusBg: ragpicker.status === 'active' ? 'bg-green-100' : 
                   ragpicker.status === 'busy' ? 'bg-orange-100' : 'bg-gray-100',
          lastActive: ragpicker.last_active || ragpicker.updated_at
        }));
      default:
        return [];
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-lg">Loading tasks...</div>
          <p className="text-gray-500 text-sm">Syncing with real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portal Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Recycle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">🏪 Kiosk Portal</h1>
            <p className="text-blue-100 text-lg">
              Welcome to your dedicated waste management workspace
            </p>
          </div>
        </div>
      </div>

      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="flex items-center gap-4">
          <ProfilePicture 
            src={user?.profileImage} 
            alt={user?.full_name || 'User'} 
            size="lg"
            className="flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Collection Management</h1>
              <button
                onClick={handleRefreshTasks}
                disabled={refreshing}
                className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
                  refreshing ? 'animate-pulse' : 'hover:scale-105'
                }`}
                title="Refresh tasks"
              >
                <RefreshCw className={`h-5 w-5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
              {user?.zone && (
                <Badge variant="outline" className="bg-eco/10 text-eco border-eco">
                  📍 Working Zone: {user.zone}
                </Badge>
              )}
              <Button
                onClick={handleToggleWorkSession}
                variant={isWorkingActive ? "destructive" : "default"}
                size="sm"
                className={`ml-2 ${isWorkingActive ? 'animate-pulse' : ''}`}
              >
                {isWorkingActive ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    End Shift
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Start Shift
                  </>
                )}
              </Button>
            </div>
            <p className="text-gray-600">
              Hello {user?.full_name || 'User'}, manage your kiosk collection operations and track earnings in real-time
              {user?.zone && (
                <span className="block text-sm text-eco font-medium mt-1">
                  {(getCurrentTasks() || []).length} collection task(s) available in your service zone
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</div>
              <div className="text-xs text-gray-500">Total Earnings</div>
              <div className="text-xs text-green-600 mt-1">
                {stats.tasksCompleted > 0 ? `₹${Math.round(stats.totalEarnings/stats.tasksCompleted)} per task` : 'No tasks yet'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.tasksCompleted}</div>
              <div className="text-xs text-gray-500">Tasks Completed</div>
              <div className="text-xs text-blue-600 mt-1">
                {stats.tasksCompleted > 0 ? `${stats.tasksCompleted} cleanup${stats.tasksCompleted > 1 ? 's' : ''} done` : 'Start your first task!'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}⭐</div>
              <div className="text-xs text-gray-500">Average Rating</div>
              <div className="text-xs text-yellow-600 mt-1">
                {stats.averageRating >= 4.5 ? 'Excellent work!' : stats.averageRating >= 4.0 ? 'Great job!' : 'Keep improving!'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.activeHours}h</div>
              <div className="text-xs text-gray-500">This Week</div>
              <div className="text-xs text-purple-600 mt-1">
                {isWorkingActive ? 'Currently active' : `${40 - stats.activeHours}h remaining`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <Badge variant="outline" className="ml-2">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleFilterTasks}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshTasks}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {activeTab === 'workers' ? (
          // Team Members View
          getCurrentTasks().map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                        <p className="text-gray-600">{worker.phoneNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`${worker.statusBg} ${worker.statusColor} border-0`}>
                            {worker.status === 'active' ? 'Available' : worker.status === 'on-task' ? 'On Task' : 'Offline'}
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 font-medium">{worker.specialization}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Performance</div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{worker.completedTasks}</div>
                          <div className="text-xs text-gray-500">Tasks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{worker.rating}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">₹{worker.totalEarnings}</div>
                          <div className="text-xs text-gray-500">Earned</div>
                        </div>
                      </div>
                      {worker.status === 'active' && (
                        <Button
                          size="sm"
                          className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => {
                            setSelectedWorker(worker);
                            setShowAssignDialog(true);
                          }}
                        >
                          Assign Task
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : activeTab === 'ragpickers' ? (
          // All Ragpickers View
          getCurrentTasks().map((ragpicker, index) => (
            <motion.div
              key={ragpicker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {ragpicker.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{ragpicker.full_name}</h3>
                        <p className="text-gray-600">{ragpicker.email}</p>
                        <p className="text-gray-600">{ragpicker.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`${ragpicker.statusBg} ${ragpicker.statusColor} border-0`}>
                            {ragpicker.status === 'active' ? 'Active' : ragpicker.status === 'busy' ? 'Busy' : 'Inactive'}
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 font-medium">{ragpicker.zone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Statistics</div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{ragpicker.total_points || 0}</div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{ragpicker.average_rating || 4.5}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">₹{ragpicker.total_earnings || 0}</div>
                          <div className="text-xs text-gray-500">Earned</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Joined: {new Date(ragpicker.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          // Regular Task Views
          getCurrentTasks().map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Task Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{task.location}</span>
                          <Badge variant="outline" className="ml-2">
                            Nearby
                          </Badge>
                        </div>
                        {task.reporter_name && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>Reported by:</span>
                            <span className="font-medium">{task.reporter_name}</span>
                            {task.zone && (
                              <Badge variant="outline" size="sm" className="bg-eco/10 text-eco border-eco">
                                {task.zone.split(' - ')[1] || task.zone}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Reward</div>
                        <div className="text-2xl font-bold text-green-600">
                          ₹{task.calculatedPayment || calculateBounty(task.category, task.severity)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedTravelTime ? `${task.estimatedTravelTime} min away` : '~30 mins'}
                        </div>
                        {task.distance && (
                          <div className="text-xs text-blue-600 mt-1">
                            {task.distance} km • {task.distanceCategory}
                          </div>
                        )}
                        {task.isUrgent && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            🚨 Urgent
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700">{task.description}</p>

                    {/* Task Meta with real-time info */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className={getUrgencyColor(task.severity)}>
                        {task.severity} Priority
                      </Badge>
                      
                      <Badge variant="outline">
                        {task.category}
                      </Badge>

                      {task.status && (
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      )}

                      {task.timeAgo && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.timeAgo}
                        </span>
                      )}

                      {task.reportedBy && (
                        <span className="text-sm text-gray-500">
                          by {task.reportedBy} • {task.reportedAt}
                        </span>
                      )}

                      {task.completed_at && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {task.completedAgo}
                        </span>
                      )}

                      {task.earnings && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Earned: ₹{task.earnings}
                        </Badge>
                      )}
                    </div>

                    {/* Real-time progress for assigned tasks */}
                    {task.status === 'in_progress' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            In Progress • {task.timeElapsed} elapsed
                          </span>
                          <span className={task.isOverdue ? 'text-red-600' : 'text-gray-600'}>
                            ETA: {task.estimatedCompletion}
                            {task.isOverdue && ' (Overdue)'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              task.isOverdue ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Status indicator for assigned tasks */}
                    {task.status === 'assigned' && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                          Task assigned • Ready to start • {task.timeElapsed} ago
                        </span>
                      </div>
                    )}

                    {/* Completion details for completed tasks */}
                    {task.weight_collected && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-green-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-800">{task.weight_collected} kg</div>
                          <div className="text-xs text-green-600">Weight</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-800">{task.actualDuration}</div>
                          <div className="text-xs text-green-600">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-800 flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {task.efficiencyRating}
                          </div>
                          <div className="text-xs text-green-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-800">₹{task.earnings || 0}</div>
                          <div className="text-xs text-green-600">Earned</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  <div className="lg:w-32">
                    <div className="flex lg:flex-col gap-2">
                      {task.image_url && (
                        <img 
                          src={task.image_url} 
                          alt="Report" 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      {task.cleanup_image_url && (
                        <img 
                          src={task.cleanup_image_url} 
                          alt="Cleanup" 
                          className="w-16 h-16 object-cover rounded-lg border-2 border-green-200"
                        />
                      )}
                      {!task.image_url && !task.cleanup_image_url && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-48 flex lg:flex-col gap-2">
                    {activeTab === 'available' && (
                      <>
                        <Button 
                          className="flex-1" 
                          variant="eco"
                          onClick={() => handleAcceptTask(task.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Task
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewLocation(task)}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View Location
                        </Button>
                      </>
                    )}

                    {activeTab === 'assigned' && (
                      <>
                        <Button 
                          className="flex-1" 
                          variant="eco"
                          onClick={() => handleNavigate(task)}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleUpdateStatus(task)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Complete Task
                        </Button>
                        {task.status === 'assigned' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStartTask(task.id)}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </>
                    )}

                    {activeTab === 'completed' && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewDetails(task)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))
        )}
      </div>

      {/* Empty State */}
      {getCurrentTasks().length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks in {activeTab}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'available' && "Check back later for new tasks in your area"}
              {activeTab === 'assigned' && "You don't have any assigned tasks right now"}
              {activeTab === 'completed' && "Complete some tasks to see your history here"}
              {activeTab === 'workers' && "No team members found for your kiosk"}
              {activeTab === 'ragpickers' && "No ragpickers are enrolled in the system"}
            </p>
            {activeTab === 'available' && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">💰 Reward Structure</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Low Priority:</span>
                    <span className="font-medium text-green-600">₹25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medium Priority:</span>
                    <span className="font-medium text-green-600">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Priority:</span>
                    <span className="font-medium text-green-600">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical Priority:</span>
                    <span className="font-medium text-green-600">₹150</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ Bonus for urgent tasks</p>
              </div>
            )}
            {activeTab === 'available' && (
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Tasks
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Task Completion Modal */}
      {showCompletionModal && completionTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Complete Task</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCompletionModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Task: {completionTask.title}</Label>
                <p className="text-sm text-gray-600">{completionTask.location}</p>
              </div>
              
              <div>
                <Label htmlFor="weight">Weight Collected (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter weight in kg"
                  value={completionData.weight}
                  onChange={(e) => setCompletionData(prev => ({
                    ...prev,
                    weight: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="cleanup-photo">Cleanup Photo *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {cleanupImage ? (
                    <div className="space-y-2">
                      <img 
                        src={cleanupImage} 
                        alt="Cleanup" 
                        className="max-w-full h-32 object-cover rounded mx-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cleanup-upload')?.click()}
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload photo of cleaned area</p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('cleanup-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Photo
                      </Button>
                    </div>
                  )}
                  
                  <input
                    id="cleanup-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCleanupImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about the cleanup"
                  value={completionData.notes}
                  onChange={(e) => setCompletionData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCompletionModal(false)}
                  disabled={isSubmittingCompletion}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubmitCompletion}
                  disabled={isSubmittingCompletion}
                >
                  {isSubmittingCompletion ? 'Submitting...' : 'Complete Task'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Dialog */}
      {showAssignDialog && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Assign Task to {selectedWorker.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAssignDialog(false);
                    setSelectedWorker(null);
                  }}
                >
                  ×
                </Button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-3">Select an Available Task:</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableReports.length > 0 ? (
                    availableReports.map(report => (
                      <div 
                        key={report.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleAssignTask(report.id, selectedWorker.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{report.title}</h5>
                            <p className="text-xs text-gray-600 mt-1">{report.address}</p>
                            <Badge variant="outline" size="sm" className="mt-1">
                              {report.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">
                              ₹{calculateBounty(report.category, report.severity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No available tasks to assign</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAssignDialog(false);
                    setSelectedWorker(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RagpickerTasks;
