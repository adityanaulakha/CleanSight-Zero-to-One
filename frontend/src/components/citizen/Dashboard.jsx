import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Award,
  TrendingUp,
  Recycle,
  Camera,
  MapPin,
  Star,
  Zap,
  Calendar,
  Target,
  Medal,
  Crown,
  MessageCircle,
  Heart,
  ClipboardList,
  Loader,
  Share2,
  Users,
  Gift,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reportService, leaderboardService, taskService } from '@/lib/localDatabase.js';
import LocationDisplay from '@/components/ui/LocationDisplay';
import ProfilePicture from '@/components/ui/ProfilePicture';

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    total_points: 0,
    total_earnings: 0,
    total_weight: 0,
    total_activities: 0
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    
    console.log('Loading dashboard for user:', user.id);
    setLoading(true);
    
    try {
      // Fetch all dashboard data (localStorage is instant, no timeout needed)
      const [reports, recentTasksData, leaderboardData, stats] = await Promise.all([
        reportService.getReportsByUser(user.id).catch((err) => {
          console.error('Reports fetch failed:', err);
          return [];
        }),
        // Get tasks related to user's reports
        (async () => {
          try {
            const userReports = await reportService.getReportsByUser(user.id);
            const allTasks = [];
            
            for (const report of userReports) {
              const tasks = await taskService.getTasksByReport?.(report.id) || [];
              allTasks.push(...tasks.map(task => ({ ...task, report })));
            }
            
            return allTasks.slice(0, 5); // Get recent 5 tasks
          } catch (error) {
            console.error('Tasks fetch failed:', error);
            return [];
          }
        })(),
        leaderboardService.getLeaderboard('citizens', 'month').catch((err) => {
          console.error('Leaderboard fetch failed:', err);
          return [];
        }),
        leaderboardService.getUserStats(user.id).catch((err) => {
          console.error('User stats fetch failed:', err);
          return {
            total_points: 0,
            total_earnings: 0,
            total_weight: 0,
            total_activities: 0
          };
        })
      ]);

      console.log('Dashboard data loaded:', { reports, recentTasksData, leaderboardData, stats });
      setRecentReports((reports || []).slice(0, 5));
      setRecentTasks(recentTasksData || []);
      setLeaderboard(leaderboardData || []);
      setUserStats(stats || {
        total_points: 0,
        total_earnings: 0,
        total_weight: 0,
        total_activities: 0
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh every 2 minutes (only when component is visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (window.dashboardInterval) {
          clearInterval(window.dashboardInterval);
          window.dashboardInterval = null;
        }
      } else {
        if (!window.dashboardInterval) {
          window.dashboardInterval = setInterval(() => {
            loadDashboardData();
          }, 120000); // 2 minutes
        }
      }
    };

    if (!document.hidden && !window.dashboardInterval) {
      window.dashboardInterval = setInterval(() => {
        loadDashboardData();
      }, 120000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.dashboardInterval) {
        clearInterval(window.dashboardInterval);
        window.dashboardInterval = null;
      }
    };
  }, [loadDashboardData]);

  const achievements = [
    { title: "First Report", description: "Submitted your first garbage report", earned: true, icon: "🏆" },
    { title: "Week Warrior", description: "7 reports in a week", earned: true, icon: "⚡" },
    { title: "Location Scout", description: "Reports from 10 different areas", earned: false, icon: "📍" },
    { title: "Eco Champion", description: "1000 points milestone", earned: true, icon: "🌱" },
  ];

  const weeklyStats = [
    { day: 'Mon', reports: 2 },
    { day: 'Tue', reports: 1 },
    { day: 'Wed', reports: 3 },
    { day: 'Thu', reports: 0 },
    { day: 'Fri', reports: 2 },
    { day: 'Sat', reports: 4 },
    { day: 'Sun', reports: 1 },
  ];

  const communityPosts = [
    { id: 1, user: "Priya S.", time: "2h ago", content: "Just cleaned up the park! 🌱", likes: 24, comments: 8 },
    { id: 2, user: "Raj P.", time: "4h ago", content: "Weekend cleanup drive anyone? 🧹", likes: 15, comments: 12 },
    { id: 3, user: "Maya C.", time: "6h ago", content: "Eco-tip: Use newspapers to wrap gifts! ♻️", likes: 31, comments: 5 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.full_name || 'User'}!</h1>
            <p className="opacity-90 text-lg mb-3">Here's your environmental impact dashboard</p>
            <LocationDisplay 
              user={user} 
              className="opacity-90" 
            />
          </div>
          <div className="flex-shrink-0 ml-6">
            <ProfilePicture 
              src={user.profileImage} 
              alt={user.full_name || 'User'} 
              size="2xl"
              className="border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-600">{userStats.total_points || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Total Points</p>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{userStats.total_points || 0} this week
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Award className="h-10 w-10 text-blue-500" />
            <span className="text-3xl font-bold text-blue-600">#1</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Global Rank</p>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            ↑5 positions
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Camera className="h-10 w-10 text-green-500" />
            <span className="text-3xl font-bold text-green-600">{userStats.total_activities || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Reports Submitted</p>
          <p className="text-xs text-gray-500">{userStats.total_activities || 0} verified</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Recycle className="h-10 w-10 text-emerald-500" />
            <span className="text-3xl font-bold text-emerald-600">{userStats.total_weight || 0}kg</span>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Total Waste Collected</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(userStats.total_weight || 0, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-500" />
              Recent Reports
            </h3>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No recent reports found.</div>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Camera className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{report.location || report.address || 'Unknown Location'}</p>
                      <p className="text-sm text-gray-500">{report.type || report.category || 'N/A'} • {report.date ? report.date : (report.created_at ? new Date(report.created_at).toLocaleDateString() : '')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === "Completed" || report.status === "completed" ? "bg-green-100 text-green-700" :
                      report.status === "In Progress" || report.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {report.status || 'Pending'}
                    </span>
                    <span className="text-sm font-bold">
                      {report.status === 'completed' || report.status === 'Completed' ? (
                        <span className="text-green-600">+50 pts</span>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              Task Status
            </h3>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </button>
          </div>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No tasks assigned yet.</div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {task.type === 'collection' ? 'Waste Collection' : 'Cleanup Task'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {task.report?.location || 'Location not specified'} • 
                        {task.assigned_at ? ` Assigned ${new Date(task.assigned_at).toLocaleDateString()}` : ' Recently assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.status === 'assigned' ? 'Assigned' : 
                       task.status === 'in_progress' ? 'In Progress' : 
                       task.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    {task.ragpicker_id && (
                      <span className="text-xs text-gray-500">
                        Assigned to Kiosk Operator #{task.ragpicker_id}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Weekly Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between h-20">
              {weeklyStats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-blue-500 rounded-t mb-2 transition-all duration-300"
                    style={{ height: `${(stat.reports / Math.max(...weeklyStats.map(s => s.reports))) * 60}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{stat.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                }`}>
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${achievement.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </p>
                    <p className={`text-xs ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && <Medal className="h-4 w-4 text-yellow-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-500" />
            Community Highlights
          </h3>
          <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
            View Community
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityPosts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{post.user}</p>
                  <p className="text-xs text-gray-500">{post.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="h-3 w-3" />
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Report Waste
        </button>
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2">
          <MapPin className="h-5 w-5" />
          View Map
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2">
          <Gift className="h-5 w-5" />
          Rewards
        </button>
        <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2">
          <Users className="h-5 w-5" />
          Community
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

