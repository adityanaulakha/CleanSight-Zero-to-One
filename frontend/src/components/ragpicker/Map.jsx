import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin } from 'lucide-react';
import { taskService } from '../../lib/localDatabase';

const RagpickerMap = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Getting location...');

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setLocationStatus(`Location found (±${Math.round(location.accuracy)}m)`);
        },
        (error) => {
          console.log('Location error:', error);
          // Use demo location for testing
          const demoLocation = {
            lat: 28.6139,
            lng: 77.2090,
            accuracy: 50
          };
          setUserLocation(demoLocation);
          setLocationStatus('Using demo location (New Delhi)');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      // Fallback to demo location
      const demoLocation = {
        lat: 28.6139,
        lng: 77.2090,
        accuracy: 50
      };
      setUserLocation(demoLocation);
      setLocationStatus('Using demo location (New Delhi)');
    }
  }, []);

  // Load tasks
  const loadTasks = async () => {
    if (!user || !userLocation) return;
    
    setLoading(true);
    try {
      const availableTasks = await taskService.getAvailableTasks(user.zone);
      setTasks(availableTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when user location is available
  useEffect(() => {
    loadTasks();
  }, [user, userLocation]);

  // Auto-refresh tasks every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, userLocation]);

  // Handle task claim
  const handleClaimTask = (taskId) => {
    try {
      const success = taskService.claimTask(taskId, user.id);
      if (success) {
        loadTasks(); // Refresh tasks
        alert('Task claimed successfully!');
      } else {
        alert('Failed to claim task. It may already be taken.');
      }
    } catch (error) {
      console.error('Error claiming task:', error);
      alert('Error claiming task');
    }
  };

  // Calculate distance between two points (simplified)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Portal Header Banner */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">🏪 Kiosk Portal - Area Map</h1>
            <p className="text-blue-100 text-lg">
              Manage your service area collections with real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Area Collection Map</h1>
        <p className="text-gray-600 mt-2">Find and claim available cleaning tasks in your service area</p>
      </div>

      {/* Location Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Your Location</h3>
              <p className="text-sm text-gray-600">{locationStatus}</p>
              {userLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              📍 Refresh Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(Array.isArray(tasks) ? tasks : []).length}</div>
              <div className="text-sm text-gray-600">Available Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user?.zone || 'Unknown'}</div>
              <div className="text-sm text-gray-600">Your Zone</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(Array.isArray(tasks) ? tasks : []).reduce((sum, task) => sum + task.reward, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Rewards (₹)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Tasks</h2>
          <Button variant="outline" size="sm" onClick={loadTasks}>
            🔄 Refresh
          </Button>
        </div>

        {(Array.isArray(tasks) ? tasks : []).length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-gray-900">No Tasks Available</h3>
                <p className="text-gray-600 mt-2">
                  Check back later or try refreshing to see new tasks in your zone.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {(Array.isArray(tasks) ? tasks : []).map((task) => {
              const distance = userLocation ? 
                calculateDistance(userLocation.lat, userLocation.lng, task.location.lat, task.location.lng) 
                : null;

              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{task.type}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {distance && (
                            <Badge variant="outline">
                              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {task.location.address}</span>
                          <span>💰 ₹{task.reward}</span>
                          <span>⏱️ {task.estimatedDuration}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button 
                          onClick={() => handleClaimTask(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Claim Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Kiosk Collection Map Guide</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• View all available collection tasks in your service zone</li>
            <li>• Collection opportunities are updated every 30 seconds</li>
            <li>• Distance is calculated from your kiosk location</li>
            <li>• Claim tasks to schedule for collection service</li>
            <li>• Higher priority collections offer better service fees</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RagpickerMap;
