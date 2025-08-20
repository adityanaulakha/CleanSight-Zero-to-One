import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Calendar,
  Download,
  Zap,
  AlertTriangle,
  Activity,
  Eye,
  Users,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

const AdminHeatmap = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedDataType, setSelectedDataType] = useState('waste-density');
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Mock heatMap karte hai data for different regions
  const heatmapData = [
    {
      id: 'sector-15',
      name: 'Sector 15',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      wasteReports: 145,
      density: 'high',
      collections: 89,
      efficiency: 61,
      avgResponseTime: '4.2 hours',
      ragpickers: 8,
      topWasteTypes: ['Plastic', 'E-waste', 'Paper'],
      trend: '+12%',
      healthIndex: 68,
      area: '2.3 km²'
    },
    {
      id: 'dlf-phase-2',
      name: 'DLF Phase 2',
      coordinates: { lat: 28.4743, lng: 77.1017 },
      wasteReports: 89,
      density: 'medium',
      collections: 76,
      efficiency: 85,
      avgResponseTime: '2.8 hours',
      ragpickers: 12,
      topWasteTypes: ['Organic', 'Plastic', 'Construction'],
      trend: '-5%',
      healthIndex: 82,
      area: '1.8 km²'
    },
    {
      id: 'cyber-hub',
      name: 'Cyber Hub',
      coordinates: { lat: 28.4944, lng: 77.0892 },
      wasteReports: 234,
      density: 'very-high',
      collections: 198,
      efficiency: 85,
      avgResponseTime: '3.1 hours',
      ragpickers: 15,
      topWasteTypes: ['Paper', 'E-waste', 'Food'],
      trend: '+8%',
      healthIndex: 91,
      area: '3.1 km²'
    },
    {
      id: 'old-gurugram',
      name: 'Old Gurugram',
      coordinates: { lat: 28.4601, lng: 77.0269 },
      wasteReports: 67,
      density: 'low',
      collections: 52,
      efficiency: 78,
      avgResponseTime: '5.1 hours',
      ragpickers: 6,
      topWasteTypes: ['Mixed', 'Organic', 'Paper'],
      trend: '+3%',
      healthIndex: 75,
      area: '4.2 km²'
    },
    {
      id: 'udyog-vihar',
      name: 'Udyog Vihar',
      coordinates: { lat: 28.4817, lng: 77.0753 },
      wasteReports: 156,
      density: 'high',
      collections: 134,
      efficiency: 86,
      avgResponseTime: '2.9 hours',
      ragpickers: 11,
      topWasteTypes: ['Industrial', 'Metal', 'Plastic'],
      trend: '+15%',
      healthIndex: 84,
      area: '2.7 km²'
    }
  ];

  const getDensityColor = (density) => {
    switch (density) {
      case 'very-high': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      case 'very-low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getDensityText = (density) => {
    switch (density) {
      case 'very-high': return 'Very High';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      case 'very-low': return 'Very Low';
      default: return 'Unknown';
    }
  };

  const getHealthColor = (index) => {
    if (index >= 85) return 'text-green-600';
    if (index >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    const isPositive = trend.startsWith('+');
    return isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const aggregatedStats = useMemo(() => {
    const totalReports = heatmapData.reduce((sum, region) => sum + region.wasteReports, 0);
    const totalCollections = heatmapData.reduce((sum, region) => sum + region.collections, 0);
    const avgEfficiency = Math.round(
      heatmapData.reduce((sum, region) => sum + region.efficiency, 0) / heatmapData.length
    );
    const totalRagpickers = heatmapData.reduce((sum, region) => sum + region.ragpickers, 0);

    return {
      totalReports,
      totalCollections,
      avgEfficiency,
      totalRagpickers,
      collectionRate: Math.round((totalCollections / totalReports) * 100)
    };
  }, [heatmapData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Geographic Analytics</h1>
          <p className="text-gray-600">Visualize waste patterns and resource distribution across regions</p>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Time Period:</span>
                    <div className="flex gap-1">
                      {['24h', '7d', '30d', '90d'].map((period) => (
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
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Data Type:</span>
                    <div className="flex gap-1">
                      {[
                        { key: 'waste-density', label: 'Waste Density' },
                        { key: 'efficiency', label: 'Efficiency' },
                        { key: 'ragpickers', label: 'Workers' }
                      ].map((type) => (
                        <Button
                          key={type.key}
                          onClick={() => setSelectedDataType(type.key)}
                          variant={selectedDataType === type.key ? 'default' : 'outline'}
                          size="sm"
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Heatmap filter options:\n\n• Time range selection\n• Report category filter\n• Priority level filter\n• Geographic region filter\n• Ragpicker activity zones\n• Cleanup completion status\n\nApply filters to focus on specific data patterns.')}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Exporting heatmap data...\n\nGenerating comprehensive report including:\n• Geographic waste distribution\n• Hotspot analysis\n• Trend patterns over time\n• Regional performance metrics\n• High-resolution map images\n\nData will be exported in multiple formats (PDF, PNG, CSV).')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-600">{aggregatedStats.totalReports}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collections</p>
                  <p className="text-2xl font-bold text-green-600">{aggregatedStats.totalCollections}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collection Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{aggregatedStats.collectionRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-orange-600">{aggregatedStats.avgEfficiency}%</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Workers</p>
                  <p className="text-2xl font-bold text-teal-600">{aggregatedStats.totalRagpickers}</p>
                </div>
                <Users className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive HeatMap karte hai */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Heatmap
                  <Badge variant="secondary" className="ml-auto">
                    {selectedTimeframe.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* HeatMap karte hai Visualization Placeholder */}
                <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Interactive Heatmap</p>
                      <p className="text-sm text-gray-500">Geographic visualization would render here</p>
                    </div>
                  </div>

                  {/* Simulated HeatMap karte hai Points */}
                  {heatmapData.map((region, index) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getDensityColor(region.density)}`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + (index % 3) * 20}%`
                      }}
                      onClick={() => setSelectedRegion(region)}
                    >
                      <div className={`w-8 h-8 rounded-full opacity-50 ${getDensityColor(region.density)} animate-pulse`}></div>
                    </motion.div>
                  ))}
                </div>

                {/* HeatMap karte hai Legend */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Density Scale:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-sm">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-sm">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Very High</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Opening heatmap in full screen mode...\n\nFull screen view provides:\n• Enhanced detail visibility\n• Advanced zoom controls\n• Interactive data layers\n• Real-time updates\n• Export options from full view')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region Details */}
          <Card>
            <CardHeader>
              <CardTitle>Region Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRegion ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedRegion.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={`${getDensityColor(selectedRegion.density)} text-white border-0`}>
                        {getDensityText(selectedRegion.density)} Density
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(selectedRegion.trend)}
                        <span className="text-sm">{selectedRegion.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-semibold">{selectedRegion.area}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reports</p>
                      <p className="font-semibold">{selectedRegion.wasteReports}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Collections</p>
                      <p className="font-semibold">{selectedRegion.collections}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Workers</p>
                      <p className="font-semibold">{selectedRegion.ragpickers}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Efficiency</span>
                      <span className="text-sm">{selectedRegion.efficiency}%</span>
                    </div>
                    <Progress value={selectedRegion.efficiency} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Index</span>
                      <span className={`text-sm font-semibold ${getHealthColor(selectedRegion.healthIndex)}`}>
                        {selectedRegion.healthIndex}/100
                      </span>
                    </div>
                    <Progress value={selectedRegion.healthIndex} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Top Waste Types</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRegion.topWasteTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Response Time</span>
                    </div>
                    <p className="text-blue-800">{selectedRegion.avgResponseTime}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => alert(`Detailed Regional Report\n\nRegion: ${selectedRegion.name}\n\nThis report includes:\n• Complete waste distribution analysis\n• Ragpicker performance metrics\n• Historical trend analysis\n• Comparison with other regions\n• Optimization recommendations\n• Resource allocation suggestions`)}
                    >
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">Select a Region</p>
                  <p className="text-sm">Click on any point in the heatmap to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Regional Overview Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Regional Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Region</th>
                    <th className="text-left p-2">Density</th>
                    <th className="text-left p-2">Reports</th>
                    <th className="text-left p-2">Collections</th>
                    <th className="text-left p-2">Efficiency</th>
                    <th className="text-left p-2">Workers</th>
                    <th className="text-left p-2">Health Index</th>
                    <th className="text-left p-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((region, index) => (
                    <motion.tr
                      key={region.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedRegion(region)}
                    >
                      <td className="p-2">
                        <div className="font-medium">{region.name}</div>
                        <div className="text-gray-500 text-xs">{region.area}</div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className={`${getDensityColor(region.density)} text-white border-0 text-xs`}>
                          {getDensityText(region.density)}
                        </Badge>
                      </td>
                      <td className="p-2 font-medium">{region.wasteReports}</td>
                      <td className="p-2 font-medium">{region.collections}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${region.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{region.efficiency}%</span>
                        </div>
                      </td>
                      <td className="p-2 font-medium">{region.ragpickers}</td>
                      <td className="p-2">
                        <span className={`font-semibold ${getHealthColor(region.healthIndex)}`}>
                          {region.healthIndex}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(region.trend)}
                          <span className="font-medium">{region.trend}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHeatmap;
