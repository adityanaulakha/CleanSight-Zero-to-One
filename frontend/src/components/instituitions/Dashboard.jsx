import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ProfilePicture from '@/components/ui/ProfilePicture';
import { 
  Building2, 
  Users, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Recycle,
  Award,
  Target,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock organization data
  const orgStats = {
    totalWasteReported: '2.8 tons',
    totalReports: 156,
    completedCollections: 142,
    activeMembers: 45,
    monthlyTarget: '3.0 tons',
    targetProgress: 93,
    complianceScore: 87,
    costSavings: '₹45,600',
    carbonFootprintReduced: '1,240 kg CO2',
    recyclingRate: 78
  };

  const recentReports = [
    {
      id: 1,
      title: 'Plastic bottles in cafeteria',
      reportedBy: 'John Doe - HR',
      location: 'Ground Floor Cafeteria',
      status: 'completed',
      priority: 'medium',
      time: '2 hours ago',
      wasteType: 'Plastic',
      estimatedWeight: '5 kg'
    },
    {
      id: 2,
      title: 'E-waste from IT department',
      reportedBy: 'Sarah Wilson - IT',
      location: '3rd Floor IT Office',
      status: 'in-progress',
      priority: 'high',
      time: '4 hours ago',
      wasteType: 'E-Waste',
      estimatedWeight: '15 kg'
    },
    {
      id: 3,
      title: 'Paper waste from accounts',
      reportedBy: 'Mike Chen - Finance',
      location: '2nd Floor Accounts',
      status: 'pending',
      priority: 'low',
      time: '6 hours ago',
      wasteType: 'Paper',
      estimatedWeight: '8 kg'
    }
  ];

  const wasteBreakdown = [
    { type: 'Paper', amount: '1.2 tons', percentage: 43, trend: '+5%', color: 'bg-blue-500' },
    { type: 'Plastic', amount: '0.8 tons', percentage: 29, trend: '+12%', color: 'bg-green-500' },
    { type: 'E-Waste', amount: '0.5 tons', percentage: 18, trend: '+8%', color: 'bg-purple-500' },
    { type: 'Organic', amount: '0.3 tons', percentage: 10, trend: '-2%', color: 'bg-yellow-500' }
  ];

  const topContributors = [
    { name: 'Sarah Wilson', department: 'IT', reports: 23, impact: '340 kg' },
    { name: 'John Doe', department: 'HR', reports: 18, impact: '280 kg' },
    { name: 'Mike Chen', department: 'Finance', reports: 15, impact: '220 kg' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 text-red-600';
      case 'medium': return 'border-yellow-500 text-yellow-600';
      case 'low': return 'border-green-500 text-green-600';
      default: return 'border-gray-500 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProfilePicture 
                src={user?.profileImage} 
                alt={user?.full_name || 'Organization'} 
                size="lg"
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Organization Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.organization || user?.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['7d', '30d', '90d'].map((period) => (
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
              <Button onClick={() => window.location.href = '/org/reports'}>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Waste Managed</p>
                  <p className="text-2xl font-bold text-blue-600">{orgStats.totalWasteReported}</p>
                  <p className="text-sm text-green-600">↑ 15% this month</p>
                </div>
                <Recycle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">{orgStats.activeMembers}</p>
                  <p className="text-sm text-gray-500">{orgStats.totalReports} reports</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-purple-600">{orgStats.complianceScore}%</p>
                  <p className="text-sm text-green-600">↑ 5% this month</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-orange-600">{orgStats.costSavings}</p>
                  <p className="text-sm text-gray-500">vs outsourcing</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Track karte hai ing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Monthly Target Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Waste Collection Target</span>
                  <span className="text-sm text-gray-600">
                    {orgStats.totalWasteReported} / {orgStats.monthlyTarget}
                  </span>
                </div>
                <Progress value={orgStats.targetProgress} className="h-3" />
                <p className="text-sm text-green-600">
                  {orgStats.targetProgress}% complete • {100 - orgStats.targetProgress}% remaining
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{orgStats.recyclingRate}%</p>
                    <p className="text-sm text-blue-800">Recycling Rate</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{orgStats.carbonFootprintReduced}</p>
                    <p className="text-sm text-green-800">CO₂ Reduced</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contributor.name}</p>
                        <p className="text-sm text-gray-600">{contributor.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{contributor.reports}</p>
                      <p className="text-sm text-gray-600">{contributor.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Reports</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Navigating to all reports page...\n\nHere you can:\n• Filter reports by status\n• Search by location\n• Export data\n• Track progress')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {report.reportedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Recycle className="h-3 w-3" />
                          {report.wasteType} - {report.estimatedWeight}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {report.time}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getPriorityColor(report.priority)}>
                          {report.priority} priority
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => alert(`Report Details:\n\nTitle: ${report.title}\nLocation: ${report.location}\nReported by: ${report.reportedBy}\nStatus: ${report.status}\nWaste Type: ${report.wasteType}\nEstimated Weight: ${report.estimatedWeight}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waste Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wasteBreakdown.map((waste, index) => (
                  <motion.div
                    key={waste.type}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${waste.color}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{waste.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{waste.amount}</span>
                          {waste.trend.startsWith('+') ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs ${
                            waste.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {waste.trend}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${waste.color}`}
                          style={{ width: `${waste.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => alert('Exporting organization waste report...\n\nReport will include:\n• Total waste managed\n• Team performance\n• Cost savings\n• Compliance metrics')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/org/analytics'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/org/members'}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
