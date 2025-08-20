import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Award, 
  Gift, 
  Zap, 
  Target, 
  TrendingUp,
  Crown,
  Medal,
  Sparkles,
  CheckCircle,
  Lock,
  ArrowRight,
  Users,
  RefreshCw,
  Calendar,
  Weight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { leaderboardService, rewardsService } from "@/lib/localDatabase.js";

const mockBadges = [
  {
    id: '1',
    name: 'First Report',
    description: 'Submitted your first garbage report',
    icon: Star,
    color: 'from-blue-400 to-blue-600',
    gradient: 'bg-blue-500',
    pointsRequired: 0,
    earned: true,
    earnedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: '7 reports in a week',
    icon: Zap,
    color: 'from-green-400 to-green-600',
    gradient: 'bg-green-500',
    pointsRequired: 100,
    earned: true,
    earnedDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Location Scout',
    description: 'Reports from 10 different areas',
    icon: Target,
    color: 'from-purple-400 to-purple-600',
    gradient: 'bg-purple-500',
    pointsRequired: 250,
    earned: true,
    earnedDate: '2024-01-25'
  },
  {
    id: '4',
    name: 'Eco Champion',
    description: '1000 points milestone',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600',
    gradient: 'bg-yellow-500',
    pointsRequired: 1000,
    earned: true,
    earnedDate: '2024-02-01'
  },
  {
    id: '5',
    name: 'Community Hero',
    description: 'Organized a cleanup drive',
    icon: Award,
    color: 'from-red-400 to-red-600',
    gradient: 'bg-red-500',
    pointsRequired: 500,
    earned: false
  },
  {
    id: '6',
    name: 'Clean City Partner',
    description: 'Collaborated with municipality',
    icon: Medal,
    color: 'from-indigo-400 to-indigo-600',
    gradient: 'bg-indigo-500',
    pointsRequired: 750,
    earned: false
  }
];

const mockLevels = [
  {
    id: '1',
    name: 'Novice',
    pointsRequired: 0,
    rewards: ['Basic reporting access', 'Community forum access'],
    icon: Star,
    color: 'from-gray-400 to-gray-600',
    current: false,
    completed: true
  },
  {
    id: '2',
    name: 'Contributor',
    pointsRequired: 100,
    rewards: ['Advanced reporting tools', 'Priority support'],
    icon: Zap,
    color: 'from-green-400 to-green-600',
    current: false,
    completed: true
  },
  {
    id: '3',
    name: 'Advocate',
    pointsRequired: 500,
    rewards: ['Organize cleanup drives', 'Exclusive badges'],
    icon: Target,
    color: 'from-blue-400 to-blue-600',
    current: false,
    completed: true
  },
  {
    id: '4',
    name: 'Champion',
    pointsRequired: 1000,
    rewards: ['Municipality partnerships', 'VIP events'],
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600',
    current: true,
    completed: false
  },
  {
    id: '5',
    name: 'Legend',
    pointsRequired: 2500,
    rewards: ['City recognition', 'Leadership opportunities'],
    icon: Trophy,
    color: 'from-purple-400 to-purple-600',
    current: false,
    completed: false
  }
];

const mockPerks = [
  {
    id: '1',
    name: 'Eco-friendly Water Bottle',
    description: 'Reusable water bottle made from recycled materials',
    pointsCost: 500,
    icon: Gift,
    available: true,
    redeemed: false
  },
  {
    id: '2',
    name: 'Community Meetup Pass',
    description: 'Free entry to next community cleanup event',
    pointsCost: 200,
    icon: Users,
    available: true,
    redeemed: false
  },
  {
    id: '3',
    name: 'Municipality Recognition',
    description: 'Get featured in city newsletter',
    pointsCost: 1000,
    icon: Award,
    available: false,
    redeemed: false
  },
  {
    id: '4',
    name: 'VIP Cleanup Event',
    description: 'Exclusive access to special cleanup initiatives',
    pointsCost: 1500,
    icon: Crown,
    available: false,
    redeemed: false
  }
];

const Rewards = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('badges');
  const [userStats, setUserStats] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [userLevel, setUserLevel] = useState(null);
  const [availablePerks, setAvailablePerks] = useState([]);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load all reward data
  const loadRewardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [stats, badges, level, perks, redemptions] = await Promise.all([
        rewardsService.getUserRewardStats(user.id),
        rewardsService.getUserBadges(user.id),
        rewardsService.getUserLevel(user.id),
        rewardsService.getAvailablePerks(user.id),
        rewardsService.getUserRedemptions(user.id)
      ]);

      setUserStats(stats);
      setUserBadges(badges);
      setUserLevel(level);
      setAvailablePerks(perks);
      setRedemptionHistory(redemptions);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading reward data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (user) {
      loadRewardData();
      
      // Auto-refresh every 5 minutes (only when tab is active)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (window.rewardsInterval) {
            clearInterval(window.rewardsInterval);
            window.rewardsInterval = null;
          }
        } else {
          if (!window.rewardsInterval) {
            window.rewardsInterval = setInterval(() => {
              loadRewardData();
            }, 300000); // 5 minutes
          }
        }
      };

      if (!document.hidden && !window.rewardsInterval) {
        window.rewardsInterval = setInterval(() => {
          loadRewardData();
        }, 300000);
      }

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (window.rewardsInterval) {
          clearInterval(window.rewardsInterval);
          window.rewardsInterval = null;
        }
      };
    }
  }, [user]);

  // Manual refresh
  const handleRefresh = () => {
    loadRewardData();
  };

  // Handle perk redemption
  const handleRedeemPerk = async (perk) => {
    if (!user) {
      alert('You must be logged in to redeem perks.');
      return;
    }

    const confirmRedeem = window.confirm(
      `Redeem "${perk.name}" for ${perk.pointsCost} points?\n\nThis will be deducted from your available points balance.\n\nYour current available points: ${userStats?.available_points || 0}`
    );

    if (!confirmRedeem) return;

    try {
      const redemption = await rewardsService.redeemPerk(user.id, perk.id);
      alert(`🎉 Successfully redeemed "${perk.name}"!\n\nRedemption ID: ${redemption.id}\nPoints used: ${perk.pointsCost}\n\nYour redemption is being processed and you'll be contacted soon with details.`);
      
      // Reload data to reflect the redemption
      await loadRewardData();
    } catch (error) {
      console.error('Error redeeming perk:', error);
      alert(`Failed to redeem perk: ${error.message}`);
    }
  };

  // Get icon component from string name
  const getIcon = (iconName) => {
    const iconMap = {
      Star, Zap, Target, Crown, Award, Medal, Weight, TrendingUp, Trophy, Gift, Users, Sparkles
    };
    return iconMap[iconName] || Star;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground mb-4">Please log in to view your rewards</h1>
        <Button variant="eco" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }

  const earnedBadges = userBadges.filter(b => b.earned);
  const availableBadges = userBadges.filter(b => !b.earned);
  const redeemablePerks = availablePerks.filter(p => p.available);
  const lockedPerks = availablePerks.filter(p => !p.available);

  const categories = [
    { id: 'badges', label: 'Badges', icon: Star, count: earnedBadges.length },
    { id: 'levels', label: 'Levels', icon: Trophy, count: userLevel?.all_levels?.filter(l => l.completed).length || 0 },
    { id: 'perks', label: 'Perks', icon: Gift, count: redeemablePerks.length },
    { id: 'history', label: 'History', icon: Calendar, count: redemptionHistory.length }
  ];

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
          Rewards & Recognition
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Earn points, unlock badges, and climb the ranks as you make your city cleaner
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* User Progress Overview */}
      <motion.div 
        className="max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {isLoading ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-eco mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your rewards...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card bg-gradient-to-r from-eco/5 to-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-eco/10 text-eco text-2xl">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {user?.full_name || 'Community Member'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Current Level: <span className="font-semibold text-eco">{userLevel?.current?.name || 'Novice'}</span>
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress to {userLevel?.next?.name || 'Max Level'}</span>
                      <span className="font-semibold">{Math.round(userLevel?.progress || 0)}%</span>
                    </div>
                    <Progress value={userLevel?.progress || 0} className="h-2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-reward mb-1">
                      {userStats?.available_points?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">Available Points</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success mb-1">
                      {userStats?.total_reports || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">Reports</div>
                  </div>
                </div>
              </div>
              
              {/* Additional stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {userStats?.total_points?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {userStats?.completed_reports || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {userStats?.total_weight?.toFixed(1) || '0.0'} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Waste Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {earnedBadges.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Category Tabs */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "eco" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-5 w-5" />
              {category.label}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </motion.div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {selectedCategory === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">🏆 Earned Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedBadges.map((badge, index) => {
                    const Icon = getIcon(badge.icon);
                    
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="shadow-card hover:shadow-eco transition-all duration-300 hover:scale-105 ring-2 ring-eco/20">
                          <CardContent className="p-6 text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} mb-4`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-xl font-semibold text-foreground mb-2">{badge.name}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{badge.description}</p>
                            
                            <div className="space-y-2">
                              <Badge variant="outline" className="bg-eco/10 text-eco border-eco">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Earned
                              </Badge>
                              {badge.earnedDate && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(badge.earnedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Badges */}
            {availableBadges.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">🎯 Available Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableBadges.map((badge, index) => {
                    const Icon = getIcon(badge.icon);
                    
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: (earnedBadges.length * 0.1) + (index * 0.1) }}
                      >
                        <Card className="shadow-card hover:shadow-eco transition-all duration-300 opacity-75">
                          <CardContent className="p-6 text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} mb-4 grayscale opacity-50`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-xl font-semibold text-foreground mb-2">{badge.name}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{badge.description}</p>
                            
                            <div className="space-y-2">
                              <Badge variant="outline" className="bg-muted">
                                <Lock className="h-3 w-3 mr-1" />
                                {badge.pointsRequired} points
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {selectedCategory === 'levels' && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {userLevel?.all_levels?.map((level, index) => {
                const Icon = getIcon(level.icon);
                
                return (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`shadow-card ${level.current ? 'ring-2 ring-eco/20 bg-gradient-to-r from-eco/5 to-primary/5' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white ${level.completed ? 'opacity-100' : level.current ? 'opacity-100' : 'opacity-50'}`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-foreground">{level.name}</h3>
                              {level.current && (
                                <Badge variant="eco" className="animate-pulse">
                                  Current Level
                                </Badge>
                              )}
                              {level.completed && !level.current && (
                                <Badge variant="outline" className="bg-success/10 text-success border-success">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground mb-3">
                              {level.pointsRequired.toLocaleString()} points required
                            </p>
                            
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground">Rewards:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {level.rewards.map((reward, rewardIndex) => (
                                  <li key={rewardIndex} className="flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-eco" />
                                    {reward}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Progress indicator for current level */}
                          {level.current && userLevel?.next && (
                            <div className="text-right">
                              <div className="w-16 h-16 relative">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-muted"
                                  />
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - (userLevel.progress / 100))}`}
                                    className="text-eco transition-all duration-500"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-eco">{Math.round(userLevel.progress)}%</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                To {userLevel.next.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {selectedCategory === 'perks' && (
          <motion.div
            key="perks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {/* Available Perks */}
            {redeemablePerks.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">🎁 Available Perks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {redeemablePerks.map((perk, index) => {
                    const Icon = getIcon(perk.icon);
                    
                    return (
                      <motion.div
                        key={perk.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="shadow-card hover:shadow-eco transition-all duration-300 hover:scale-105 border-eco/20">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-reward to-warning flex items-center justify-center">
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-2">{perk.name}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{perk.description}</p>
                                
                                <div className="flex items-center justify-between gap-3">
                                  <Badge variant="outline" className="bg-reward/10 text-reward border-reward">
                                    {perk.pointsCost} points
                                  </Badge>
                                  
                                  <div className="text-right">
                                    <Button 
                                      variant="eco" 
                                      size="sm"
                                      onClick={() => handleRedeemPerk(perk)}
                                    >
                                      <Gift className="h-4 w-4 mr-2" />
                                      Redeem
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {perk.stock} left
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locked Perks */}
            {lockedPerks.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">🔒 Locked Perks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedPerks.map((perk, index) => {
                    const Icon = getIcon(perk.icon);
                    
                    return (
                      <motion.div
                        key={perk.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: (redeemablePerks.length * 0.1) + (index * 0.1) }}
                      >
                        <Card className="shadow-card opacity-60">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted to-muted flex items-center justify-center">
                                <Icon className="h-6 w-6 text-muted-foreground" />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-2">{perk.name}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{perk.description}</p>
                                
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="bg-reward/10 text-reward border-reward">
                                    {perk.pointsCost} points
                                  </Badge>
                                  
                                  <Badge variant="outline" className="bg-muted">
                                    <Lock className="h-3 w-3 mr-1" />
                                    {userStats?.available_points >= perk.pointsCost ? 'Requirements not met' : 'Insufficient points'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {availablePerks.length === 0 && (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground mb-2">No Perks Available</h3>
                <p className="text-muted-foreground">
                  Keep earning points to unlock amazing rewards!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {selectedCategory === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {redemptionHistory.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">📜 Redemption History</h3>
                {redemptionHistory.map((redemption, index) => (
                  <motion.div
                    key={redemption.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-reward to-warning flex items-center justify-center">
                              <Gift className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{redemption.perk_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Redeemed on {new Date(redemption.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {redemption.id}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={
                                  redemption.status === 'fulfilled' ? 'bg-success/10 text-success border-success' :
                                  redemption.status === 'approved' ? 'bg-primary/10 text-primary border-primary' :
                                  'bg-warning/10 text-warning border-warning'
                                }
                              >
                                {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                              </Badge>
                              <div className="text-reward font-bold">
                                -{redemption.points_used} pts
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground mb-2">No Redemptions Yet</h3>
                <p className="text-muted-foreground">
                  Start redeeming perks to see your history here!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-eco/5 to-primary/5 border-eco/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Earn More Rewards?
            </h3>
            <p className="text-muted-foreground mb-6">
              Start reporting garbage, organizing cleanup drives, and collaborating with your community to earn points and unlock exclusive perks!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="eco" 
                size="lg"
                onClick={() => window.location.href = '/citizen/report'}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Submit Reports
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/citizen/leaderboard'}
              >
                <Trophy className="h-5 w-5 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Rewards;
