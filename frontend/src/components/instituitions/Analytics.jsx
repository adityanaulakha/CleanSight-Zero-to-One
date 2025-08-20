import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  Users,
  Recycle,
  DollarSign,
  MapPin,
  Clock,
  Award,
  Target,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const InstitutionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('waste');

  // TODO: Replace with real-time Supabase data for analytics
  const wasteCollectionData = [];
  const teamPerformanceData = [];
  const wasteTypeDistribution = [];
  const monthlyTrends = [];
  const departmentStats = [];
  const kpiData = [];
  const alerts = [];

  const handleExportReport = (type) => {
    alert(`Exporting ${type} Report\n\nGenerating comprehensive analytics report including:\n• Performance metrics\n• Trend analysis\n• Cost breakdowns\n• Team statistics\n• Recommendations\n\nAvailable formats: PDF, Excel, CSV`);
  };

  const handleDrillDown = (metric) => {
    alert(`Drilling down into ${metric} analytics\n\nDetailed view will show:\n• Hourly/daily breakdowns\n• Individual contributor data\n• Historical comparisons\n• Predictive insights\n• Action recommendations`);
  };

  const handleAlertAction = (alert) => {
    alert(`Taking action on alert: ${alert.message}\n\nThis would:\n• Open detailed analysis\n• Show recommended actions\n• Allow status updates\n• Enable quick fixes`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor performance and track sustainability metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExportReport('comprehensive')}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Custom Filters
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Time Range:</span>
              <div className="flex gap-2">
                {[
                  { label: '7 Days', value: '7d' },
                  { label: '30 Days', value: '30d' },
                  { label: '90 Days', value: '90d' },
                  { label: '1 Year', value: '1y' }
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDrillDown(kpi.title)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                      <div className={`flex items-center gap-1 mt-2 ${kpi.color}`}>
                        {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="text-sm font-medium">{kpi.change}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                      <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste Collection Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Waste Collection Trends
                <Button variant="outline" size="sm" onClick={() => handleExportReport('waste-trends')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wasteCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="organic" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="plastic" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="paper" stackId="4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Waste Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Waste Type Distribution
                <Button variant="outline" size="sm" onClick={() => handleExportReport('waste-distribution')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wasteTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {wasteTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Team Performance
                <Button variant="outline" size="sm" onClick={() => handleExportReport('team-performance')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="reports" fill="#3b82f6" />
                    <Bar dataKey="tasks" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Monthly Performance Trends
                <Button variant="outline" size="sm" onClick={() => handleExportReport('monthly-trends')}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="waste" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Department Performance Overview
              <Button variant="outline" size="sm" onClick={() => handleExportReport('department-stats')}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Department</th>
                    <th className="text-left py-2">Waste Managed (kg)</th>
                    <th className="text-left py-2">Reports</th>
                    <th className="text-left py-2">Cost Savings</th>
                    <th className="text-left py-2">Efficiency</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{dept.department}</td>
                      <td className="py-3">{dept.waste.toLocaleString()}</td>
                      <td className="py-3">{dept.reports}</td>
                      <td className="py-3 text-green-600">₹{dept.cost.toLocaleString()}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${dept.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{dept.efficiency}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDrillDown(dept.department)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Smart Insights & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.type === 'warning' ? 'text-yellow-600' :
                          alert.type === 'success' ? 'text-green-600' :
                          'text-blue-600'
                        }`} />
                        <span className="text-sm text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-gray-900">{alert.message}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAlertAction(alert)}
                    >
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleExportReport('comprehensive')}
              >
                <Download className="h-8 w-8 text-blue-500" />
                <span>Generate Monthly Report</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => alert('Opening prediction models...\n\nThis will show:\n• Waste generation forecasts\n• Resource requirement predictions\n• Budget planning insights\n• Seasonal trend analysis')}
              >
                <TrendingUp className="h-8 w-8 text-green-500" />
                <span>Predictive Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => alert('Opening optimization suggestions...\n\nThis will provide:\n• Route optimization recommendations\n• Cost reduction opportunities\n• Process improvements\n• Efficiency enhancement tips')}
              >
                <Target className="h-8 w-8 text-purple-500" />
                <span>Optimization Insights</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionAnalytics;
