import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { reportService, taskService } from '@/lib/localDatabase.js';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Camera,
  MessageSquare,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

const AdminModeration = () => {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Load reports for moderation
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const allReports = await reportService.getAllReports();
      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time updates
  useEffect(() => {
    loadReports();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(loadReports, 30000);
    
    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key && (e.key.includes('Reports') || e.key.includes('Tasks'))) {
        loadReports();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadReports]);

  // Filter reports based on status
  const filteredReports = reports.filter(report => {
    switch (selectedFilter) {
      case 'pending':
        return report.status === 'pending' || report.status === 'under_review';
      case 'approved':
        return report.status === 'verified' || report.status === 'assigned';
      case 'rejected':
        return report.status === 'rejected' || report.status === 'invalid';
      case 'completed':
        return report.status === 'resolved' || report.status === 'completed';
      case 'flagged':
        return report.flags && (report.flags > 0 || report.flagged === true);
      case 'high-priority':
        return report.severity === 'critical' || report.severity === 'high';
      default:
        return true;
    }
  });

  // Handle report approval
  const handleApproveReport = async (reportId) => {
    try {
      setProcessing(true);
      await reportService.moderateReport(reportId, 'admin-user', 'approved');
      await loadReports();
      setSelectedReport(null);
      alert('Report approved successfully!');
    } catch (error) {
      console.error('Error approving report:', error);
      alert('Failed to approve report. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle report rejection
  const handleRejectReport = async (reportId) => {
    try {
      setProcessing(true);
      await reportService.moderateReport(reportId, 'admin-user', 'rejected');
      await loadReports();
      setSelectedReport(null);
      alert('Report rejected successfully!');
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert('Failed to reject report. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'verified': 
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': 
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'resolved': 
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'plastic': return 'bg-blue-100 text-blue-800';
      case 'e-waste': 
      case 'electronic': return 'bg-purple-100 text-purple-800';
      case 'construction': 
      case 'debris': return 'bg-orange-100 text-orange-800';
      case 'organic': 
      case 'food': return 'bg-green-100 text-green-800';
      case 'metal': return 'bg-gray-100 text-gray-800';
      case 'glass': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
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

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  // Filter options with counts
  const filterOptions = [
    { 
      id: 'pending', 
      label: 'Pending Review', 
      count: reports.filter(r => r.status === 'pending' || r.status === 'under_review').length
    },
    { 
      id: 'flagged', 
      label: 'Flagged', 
      count: reports.filter(r => r.flags && (r.flags > 0 || r.flagged === true)).length
    },
    { 
      id: 'high-priority', 
      label: 'High Priority', 
      count: reports.filter(r => r.severity === 'critical' || r.severity === 'high').length
    }
  ];

  // Calculate stats
  const pendingCount = reports.filter(r => r.status === 'pending' || r.status === 'under_review').length;
  const approvedTodayCount = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = new Date(r.created_at || r.timestamp).toDateString();
    return reportDate === today && (r.status === 'verified' || r.status === 'approved');
  }).length;
  const rejectedTodayCount = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = new Date(r.created_at || r.timestamp).toDateString();
    return reportDate === today && (r.status === 'rejected' || r.status === 'invalid');
  }).length;
  const flaggedCount = reports.filter(r => r.flags && (r.flags > 0 || r.flagged === true)).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading Reports...</div>
          <p className="text-gray-500 text-sm">Syncing real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate user-submitted waste reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-green-600">{approvedTodayCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected Today</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedTodayCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged Reports</p>
                  <p className="text-2xl font-bold text-yellow-600">{flaggedCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reports Queue</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search reports..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  {filterOptions.map((filter) => (
                    <Button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      variant={selectedFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      className="relative"
                    >
                      {filter.label}
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>

                {/* Reports List */}
                <div className="space-y-3">
                  {currentReports.length > 0 ? (
                    currentReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getPriorityColor(report.severity)}>
                                {report.severity || 'medium'}
                              </Badge>
                              <Badge variant="secondary" className={getCategoryColor(report.category)}>
                                {report.category || 'General'}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{getTimeAgo(report.created_at || report.timestamp)}</span>
                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{report.title || `${report.category} Waste Report`}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {(report.user_name || report.citizen_name || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{report.user_name || report.citizen_name || 'Anonymous'}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{report.location || report.address}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {report.flags && report.flags > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {report.flags} flags
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{report.images?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No reports found</p>
                      <p className="text-sm">No reports match the selected filter criteria</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredReports.length > reportsPerPage && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * reportsPerPage + 1} to {Math.min(currentPage * reportsPerPage, filteredReports.length)} of {filteredReports.length} reports
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Report Details Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedReport ? (
                <motion.div
                  key={selectedReport.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Report Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Report Info */}
                      <div>
                        <h4 className="font-semibold mb-2">{selectedReport.title || `${selectedReport.category} Waste Report`}</h4>
                        <p className="text-sm text-gray-600 mb-3">{selectedReport.description}</p>
                        
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge className={getPriorityColor(selectedReport.severity)}>
                            {selectedReport.severity || 'medium'} priority
                          </Badge>
                          <Badge className={getCategoryColor(selectedReport.category)}>
                            {selectedReport.category || 'General'}
                          </Badge>
                          <Badge className={getStatusColor(selectedReport.status)}>
                            {selectedReport.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Reporter Info */}
                      <div>
                        <h5 className="font-medium mb-2">Reporter</h5>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {(selectedReport.user_name || selectedReport.citizen_name || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedReport.user_name || selectedReport.citizen_name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-600">
                              Phone: {selectedReport.phone || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h5 className="font-medium mb-2">Location</h5>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedReport.location || selectedReport.address}</span>
                        </div>
                        {selectedReport.coordinates && (
                          <p className="text-xs text-gray-500 mt-1">
                            Coordinates: {selectedReport.coordinates.lat}, {selectedReport.coordinates.lng}
                          </p>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div>
                        <h5 className="font-medium mb-2">Submitted</h5>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(selectedReport.created_at || selectedReport.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Images */}
                      {selectedReport.images && selectedReport.images.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Images ({selectedReport.images.length})</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedReport.images.map((image, index) => (
                              <div
                                key={index}
                                className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                              >
                                <Camera className="h-6 w-6 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flags */}
                      {selectedReport.flags && selectedReport.flags > 0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-yellow-900 mb-2">Community Flags</h5>
                          <div className="space-y-1 text-sm">
                            <p className="text-yellow-700">{selectedReport.flags} user flags</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                        <div className="space-y-2 pt-4 border-t">
                          <Button
                            onClick={() => handleApproveReport(selectedReport.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={processing}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {processing ? 'Processing...' : 'Approve Report'}
                          </Button>
                          
                          <Button
                            onClick={() => handleRejectReport(selectedReport.id)}
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            disabled={processing}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Report
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => alert(`Requesting additional information for: ${selectedReport.title || 'this report'}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request More Info
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => alert(`Opening map view for: ${selectedReport.location || selectedReport.address}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400">
                      <Eye className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Select a Report</p>
                      <p className="text-sm">Choose a report from the list to view details and take action</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModeration;
