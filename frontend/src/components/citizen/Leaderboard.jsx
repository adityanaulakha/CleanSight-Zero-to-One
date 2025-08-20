import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Crown,
  Zap,
  RefreshCw,
  Weight,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { leaderboardService, userService, initializeSampleData } from "@/lib/localDatabase.js";

const timeFilters = [
  { id: 'week', label: 'This Week', icon: Calendar },
  { id: 'month', label: 'This Month', icon: TrendingUp },
  { id: 'year', label: 'This Year', icon: Trophy },
  { id: 'all', label: 'All Time', icon: Star }
];

const getRankIcon = (rank) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <Star className="h-6 w-6 text-blue-500" />;
};

const getRankColor = (rank) => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-gray-300 to-gray-500';
  if (rank === 3) return 'from-amber-500 to-amber-700';
  return 'from-blue-400 to-blue-600';
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalWeight: 0
  });
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load leaderboard data
  const loadLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // Initialize sample data if needed
      initializeSampleData();
      
      // Get leaderboard data
      const citizensLeaderboard = await leaderboardService.getLeaderboard('citizens', selectedFilter);
      const ragpickersLeaderboard = await leaderboardService.getLeaderboard('ragpickers', selectedFilter);
      
      // Combine and rank all users
      const combinedData = [...citizensLeaderboard, ...ragpickersLeaderboard]
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
          reportsSubmitted: Math.floor(entry.total_points / 30) || 1, // Estimate reports from points
          impactScore: Math.min(100, Math.floor((entry.total_points / 10) + 50)), // Calculate impact score
          badges: generateBadges(entry),
          change: 'same', // For now, we'll show as same (in real app, compare with previous period)
          changeAmount: 0
        }));

      setLeaderboardData(combinedData);

      // Calculate global stats
      const allUsers = await getAllUsers();
      const stats = {
        totalUsers: allUsers.filter(u => u.role === 'citizen' || u.role === 'ragpicker').length,
        totalPoints: allUsers.reduce((sum, u) => sum + (u.total_points || 0), 0),
        totalWeight: allUsers.reduce((sum, u) => sum + (u.total_weight || 0), 0)
      };
      setGlobalStats(stats);

      // Find current user's rank
      if (user) {
        const userIndex = combinedData.findIndex(entry => entry.user_id === user.id);
        setUserRank(userIndex >= 0 ? userIndex + 1 : null);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get all users
  const getAllUsers = async () => {
    const users = JSON.parse(localStorage.getItem('cleansight_users') || '[]');
    return users;
  };

  // Generate badges based on user performance
  const generateBadges = (userEntry) => {
    const badges = [];
    
    if (userEntry.total_points >= 500) badges.push('Eco Champion');
    if (userEntry.total_points >= 200) badges.push('Week Warrior');
    if (userEntry.total_points >= 100) badges.push('Active Contributor');
    if (userEntry.role === 'ragpicker' && userEntry.total_earnings >= 1000) badges.push('Top Collector');
    if (userEntry.role === 'citizen') badges.push('Community Reporter');
    if (userEntry.role === 'ragpicker') badges.push('Cleanup Hero');

    return badges.length > 0 ? badges : ['New Member'];
  };

  // Auto-refresh every 3 minutes (only when tab is active)
  useEffect(() => {
    loadLeaderboardData();
    
    // Auto-refresh with visibility detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (window.leaderboardInterval) {
          clearInterval(window.leaderboardInterval);
          window.leaderboardInterval = null;
        }
      } else {
        if (!window.leaderboardInterval) {
          window.leaderboardInterval = setInterval(() => {
            loadLeaderboardData();
          }, 180000); // 3 minutes
        }
      }
    };

    if (!document.hidden && !window.leaderboardInterval) {
      window.leaderboardInterval = setInterval(() => {
        loadLeaderboardData();
      }, 180000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.leaderboardInterval) {
        clearInterval(window.leaderboardInterval);
        window.leaderboardInterval = null;
      }
    };
  }, [selectedFilter, user]);

  // Manual refresh
  const handleRefresh = () => {
    loadLeaderboardData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Community Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Celebrate the top contributors making our cities cleaner and greener
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-eco/10 mb-4">
              <Users className="h-6 w-6 text-eco" />
            </div>
            <p className="text-2xl font-bold text-foreground">{globalStats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Active Contributors</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-reward/10 mb-4">
              <Trophy className="h-6 w-6 text-reward" />
            </div>
            <p className="text-2xl font-bold text-foreground">{globalStats.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points Earned</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
              <Weight className="h-6 w-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{globalStats.totalWeight.toFixed(1)} kg</p>
            <p className="text-sm text-muted-foreground">Waste Collected</p>
          </CardContent>
        </Card>

        {userRank && (
          <Card className="shadow-card border-eco">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-eco/20 mb-4">
                <MapPin className="h-6 w-6 text-eco" />
              </div>
              <p className="text-2xl font-bold text-eco">#{userRank}</p>
              <p className="text-sm text-muted-foreground">Your Rank</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {timeFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "eco" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-reward" />
              Top Contributors ({selectedFilter === 'week' ? 'This Week' : selectedFilter === 'month' ? 'This Month' : selectedFilter === 'year' ? 'This Year' : 'All Time'})
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-eco" />
                <span className="ml-3 text-muted-foreground">Loading leaderboard...</span>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No data available</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to contribute and appear on the leaderboard!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {leaderboardData.map((entry, index) => (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group ${
                        user && entry.user_id === user.id ? 'border-eco bg-eco/5' : 'border-border'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-lg`}>
                          {entry.rank}
                        </div>
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback className="bg-eco/10 text-eco">
                            {entry.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {entry.full_name || 'Unknown User'}
                              {user && entry.user_id === user.id && (
                                <span className="ml-2 text-xs px-2 py-1 bg-eco/20 text-eco rounded-full">You</span>
                              )}
                            </h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {entry.role}
                            </Badge>
                            {entry.rank <= 3 && getRankIcon(entry.rank)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{entry.reportsSubmitted} reports</span>
                            <span>•</span>
                            <span>{entry.impactScore}% impact</span>
                            {entry.role === 'ragpicker' && entry.total_earnings > 0 && (
                              <>
                                <span>•</span>
                                <span>₹{entry.total_earnings} earned</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Points & Badges */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-reward">{entry.total_points.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                        
                        <div className="flex gap-1">
                          {entry.badges.slice(0, 2).map((badge, badgeIndex) => (
                            <Badge 
                              key={badgeIndex} 
                              variant="outline" 
                              className="text-xs bg-eco/10 text-eco border-eco"
                            >
                              {badge}
                            </Badge>
                          ))}
                          {entry.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.badges.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Rank Change */}
                      <div className="flex-shrink-0">
                        {entry.change === 'up' && (
                          <div className="flex items-center gap-1 text-success">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">+{entry.changeAmount}</span>
                          </div>
                        )}
                        {entry.change === 'down' && (
                          <div className="flex items-center gap-1 text-destructive">
                            <TrendingUp className="h-4 w-4 rotate-180" />
                            <span className="text-sm">-{entry.changeAmount}</span>
                          </div>
                        )}
                        {entry.change === 'same' && (
                          <div className="text-muted-foreground text-sm">-</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-muted-foreground mb-4">
          Want to climb the leaderboard?
        </p>
        <Button 
          variant="eco" 
          size="lg"
          onClick={() => window.location.href = '/citizen/report'}
        >
          <Zap className="h-5 w-5 mr-2" />
          Start Contributing
        </Button>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
