import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Wallet,
  PieChart,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Bell,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { rewardsService, userService, taskService } from '@/lib/localDatabase.js';

const RagpickerEarnings = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [kycStatus, setKycStatus] = useState('verified');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);

  // Load real-time earnings data
  const loadEarningsData = useCallback(async () => {
    if (!user || user.role !== 'ragpicker') return;

    try {
      setLoading(true);
      
      // Get updated user data for real-time stats
      const currentUser = await userService.getCurrentUser();
      
      // Get all completed tasks for this ragpicker
      const completedTasks = await taskService.getTasksByRagpicker(user.id, 'completed');
      
      // Calculate real-time earnings stats
      const today = new Date();
      const todayTasks = completedTasks.filter(task => 
        new Date(task.completed_at).toDateString() === today.toDateString()
      );
      
      const thisWeek = completedTasks.filter(task => {
        const taskDate = new Date(task.completed_at);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return taskDate >= weekAgo;
      });
      
      const thisMonth = completedTasks.filter(task => {
        const taskDate = new Date(task.completed_at);
        return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
      });
      
      const thisYear = completedTasks.filter(task => {
        const taskDate = new Date(task.completed_at);
        return taskDate.getFullYear() === today.getFullYear();
      });

      // Calculate earnings for each period
      const calculateEarnings = (tasks) => {
        return tasks.reduce((total, task) => {
          // Estimate earnings based on weight and category
          const baseRate = 10; // ₹10 per kg
          const weight = task.weight_collected || 1;
          return total + (weight * baseRate);
        }, 0);
      };

      setRealTimeStats({
        today: { 
          amount: calculateEarnings(todayTasks), 
          tasks: todayTasks.length,
          weight: todayTasks.reduce((sum, t) => sum + (t.weight_collected || 0), 0)
        },
        week: { 
          amount: calculateEarnings(thisWeek), 
          tasks: thisWeek.length,
          weight: thisWeek.reduce((sum, t) => sum + (t.weight_collected || 0), 0)
        },
        month: { 
          amount: calculateEarnings(thisMonth), 
          tasks: thisMonth.length,
          weight: thisMonth.reduce((sum, t) => sum + (t.weight_collected || 0), 0)
        },
        year: { 
          amount: calculateEarnings(thisYear), 
          tasks: thisYear.length,
          weight: thisYear.reduce((sum, t) => sum + (t.weight_collected || 0), 0)
        }
      });

      // Generate recent transactions from completed tasks
      const transactions = completedTasks
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
        .slice(0, 10)
        .map((task, index) => ({
          id: task.id,
          date: new Date(task.completed_at).toISOString().split('T')[0],
          type: 'Task Payment',
          description: `${task.report?.category || 'Waste'} Collection - ${task.report?.address?.substring(0, 20) || 'Location'}...`,
          amount: Math.round((task.weight_collected || 1) * 10), // ₹10 per kg
          status: 'completed',
          taskId: task.id.substring(0, 6),
          weight: task.weight_collected || 0
        }));
      
      setRecentTransactions(transactions);

      // Calculate monthly breakdown by category
      const categoryStats = {};
      thisMonth.forEach(task => {
        const category = task.report?.category || 'other';
        const earnings = Math.round((task.weight_collected || 1) * 10);
        
        if (!categoryStats[category]) {
          categoryStats[category] = { amount: 0, tasks: 0 };
        }
        categoryStats[category].amount += earnings;
        categoryStats[category].tasks += 1;
      });

      const totalMonthly = Object.values(categoryStats).reduce((sum, cat) => sum + cat.amount, 0);
      
      const breakdown = Object.entries(categoryStats).map(([category, data], index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: data.amount,
        tasks: data.tasks,
        percentage: totalMonthly > 0 ? Math.round((data.amount / totalMonthly) * 100) : 0,
        color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][index % 5]
      })).sort((a, b) => b.amount - a.amount);

      setMonthlyBreakdown(breakdown);
      
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadEarningsData();
  }, [loadEarningsData]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(loadEarningsData, 120000);
    return () => clearInterval(interval);
  }, [loadEarningsData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEarningsData();
    setRefreshing(false);
  };

  // Handle karte hai r functions
  const handleWithdraw = () => {
    if (kycStatus !== 'verified') {
      alert('Please complete KYC verification before withdrawing earnings.');
      setSelectedTab('kyc');
      return;
    }
    alert('Withdrawal Request Initiated!\n\nAvailable balance: ₹8,450\nProcessing time: 2-3 business days\n\nYou will receive a confirmation SMS shortly.');
  };

  const handleDownloadStatement = () => {
    alert('Downloading earnings statement...\n\nStatement will include:\n• All transactions\n• Tax deductions\n• Payment history\n• KYC details');
  };

  const handlePaymentSettings = () => {
    alert('Payment Settings:\n\n• Bank account details\n• UPI preferences\n• Tax information\n• Withdrawal limits');
  };

  // Mock earnings data - fallback
  const earningsData = realTimeStats || {
    today: { amount: 0, tasks: 0, weight: 0 },
    week: { amount: 0, tasks: 0, weight: 0 },
    month: { amount: 0, tasks: 0, weight: 0 },
    year: { amount: 0, tasks: 0, weight: 0 }
  };

  const kycDocuments = [
    { type: 'Aadhaar Card', status: 'verified', uploadDate: '2024-01-10' },
    { type: 'PAN Card', status: 'verified', uploadDate: '2024-01-10' },
    { type: 'Bank Account', status: 'verified', uploadDate: '2024-01-10' },
    { type: 'Profile Photo', status: 'verified', uploadDate: '2024-01-10' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Portal Header Banner */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">🏪 Kiosk Portal - Earnings</h1>
              <p className="text-green-100 text-lg">
                Track your collection service income and performance
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings Dashboard</h1>
              <p className="text-gray-600">Track your real-time income, payments, and financial performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Status Banner */}
        {kycStatus === 'verified' ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">KYC Verified</h3>
                <p className="text-sm text-green-600">Your account is fully verified for payments</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('kyc')}>
              View Details
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">KYC Pending</h3>
                <p className="text-sm text-yellow-600">Complete your KYC to receive payments</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('kyc')}>
              Complete KYC
            </Button>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: DollarSign },
                { id: 'transactions', name: 'Transactions', icon: FileText },
                { id: 'analytics', name: 'Analytics', icon: PieChart },
                { id: 'kyc', name: 'KYC Status', icon: CheckCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Period Selector */}
              <div className="flex gap-2">
                {['today', 'week', 'month', 'year'].map((period) => (
                  <Button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                  >
                    {period === 'today' ? 'Today' : `This ${period}`}
                  </Button>
                ))}
              </div>

              {/* Earnings Overview Cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="mt-2 h-3 bg-gray-200 rounded w-20"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{earningsData[selectedPeriod].amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Real-time sync active
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {earningsData[selectedPeriod].tasks}
                          </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-blue-600">
                        <Target className="h-4 w-4 mr-1" />
                        {selectedPeriod === 'today' ? 'Today' : `This ${selectedPeriod}`}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average per Task</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{earningsData[selectedPeriod].tasks > 0 ? 
                              Math.round(earningsData[selectedPeriod].amount / earningsData[selectedPeriod].tasks) : 0}
                          </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <PieChart className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-purple-600">
                        <Award className="h-4 w-4 mr-1" />
                        Per task efficiency
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Weight Collected</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {earningsData[selectedPeriod].weight?.toFixed(1) || '0'} kg
                          </p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Environmental impact
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-12 justify-start" 
                  variant="outline"
                  onClick={handleWithdraw}
                >
                  <Wallet className="h-5 w-5 mr-3" />
                  Withdraw Earnings
                </Button>
                <Button 
                  className="h-12 justify-start" 
                  variant="outline"
                  onClick={handleDownloadStatement}
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download Statement
                </Button>
                <Button 
                  className="h-12 justify-start" 
                  variant="outline"
                  onClick={handlePaymentSettings}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payment Settings
                </Button>
              </div>
            </motion.div>
          )}

          {selectedTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                            <p className="text-sm text-gray-600">
                              {transaction.type} • {transaction.date}
                              {transaction.taskId && (
                                <span className="ml-2">Task: {transaction.taskId}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(transaction.status)}`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyBreakdown.map((item, index) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${item.color}`} />
                            <span className="font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kycDocuments.map((doc, index) => (
                      <div key={doc.type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(doc.status)}`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{doc.type}</h4>
                            <p className="text-sm text-gray-600">Uploaded: {doc.uploadDate}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(doc.status)}
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RagpickerEarnings;
