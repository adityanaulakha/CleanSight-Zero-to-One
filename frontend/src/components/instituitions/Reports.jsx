import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Download,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

const InstitutionReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // TODO: Replace with real-time Supabase data for institution reports
  const reports = [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleEditReport = (reportId) => {
    alert(`Editing report ID: ${reportId}\n\nThis would open the report editor with:\n• Editable title and description\n• Location updates\n• Status changes\n• Assignment modifications`);
  };

  const handleDeleteReport = (reportId) => {
    alert(`Delete Report ID: ${reportId}\n\nWARNING: This action cannot be undone.\nThe report and all associated data will be permanently removed.`);
  };

  const handleCreateReport = () => {
    alert('Creating New Report\n\nOpening report creation form with:\n• Waste type selection\n• Location picker\n• Priority setting\n• Description editor\n• Photo upload\n• Assignment options');
  };

  const handleExportReports = () => {
    alert('Exporting Institution Reports\n\nGenerating comprehensive export including:\n• All report data\n• Status summaries\n• Performance metrics\n• Assignment history\n• Cost analysis\n\nAvailable formats: PDF, CSV, Excel');
  };

  const handleBulkAction = (action) => {
    alert(`Bulk Action: ${action}\n\nThis would apply the selected action to all checked reports:\n• Status updates\n• Assignment changes\n• Priority modifications\n• Deletion (with confirmation)`);
  };

  const statusCounts = {
    all: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    'in-progress': reports.filter(r => r.status === 'in-progress').length,
    completed: reports.filter(r => r.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institution Reports</h1>
            <p className="text-gray-600 mt-2">Manage and track all waste management reports</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportReports} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button onClick={handleCreateReport}>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: statusCounts.all, color: 'bg-blue-500' },
            { label: 'Pending', value: statusCounts.pending, color: 'bg-yellow-500' },
            { label: 'In Progress', value: statusCounts['in-progress'], color: 'bg-blue-500' },
            { label: 'Completed', value: statusCounts.completed, color: 'bg-green-500' }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports by title or location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status === 'all' ? 'All Reports' : status.replace('-', ' ')}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Reports ({filteredReports.length})
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('assign')}
                >
                  Bulk Assign
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('status')}
                >
                  Update Status
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(report.status)}
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge className={getPriorityColor(report.priority)}>
                          {report.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>By: {report.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{report.reportedDate}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Waste Type: {report.wasteType}</span>
                        <span>Weight: {report.estimatedWeight}</span>
                        {report.assignedTo && <span>Assigned: {report.assignedTo}</span>}
                        {report.completionDate && <span>Completed: {report.completionDate}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditReport(report.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedReport(null)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="text-gray-900">{selectedReport.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedReport.status)}
                        <Badge className={getStatusColor(selectedReport.status)}>
                          {selectedReport.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Reported By</label>
                      <p className="text-gray-900">{selectedReport.reportedBy}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date Reported</label>
                      <p className="text-gray-900">{selectedReport.reportedDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Waste Type</label>
                      <p className="text-gray-900">{selectedReport.wasteType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estimated Weight</label>
                      <p className="text-gray-900">{selectedReport.estimatedWeight}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-900 mt-1">{selectedReport.description}</p>
                  </div>
                  
                  {selectedReport.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-gray-900">{selectedReport.assignedTo}</p>
                    </div>
                  )}
                  
                  {selectedReport.completionDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Completion Date</label>
                      <p className="text-gray-900">{selectedReport.completionDate}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button onClick={() => handleEditReport(selectedReport.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Report
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionReports;
