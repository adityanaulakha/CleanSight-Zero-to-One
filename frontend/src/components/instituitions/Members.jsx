import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  Clock,
  UserPlus,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';

const InstitutionMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);

  // TODO: Replace with real-time Supabase data for institution members
  const members = [];

  const getRoleColor = (role) => {
    switch (role) {
      case 'administrator': return 'bg-purple-100 text-purple-800';
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleViewMember = (member) => {
    setSelectedMember(member);
  };

  const handleEditMember = (memberId) => {
    alert(`Editing member ID: ${memberId}\n\nThis would open the member editor with:\n• Personal information fields\n• Role and permission settings\n• Department assignment\n• Contact details\n• Status management`);
  };

  const handleDeleteMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    alert(`Delete Member: ${member.name}\n\nWARNING: This action cannot be undone.\nThe member and all associated data will be permanently removed.`);
  };

  const handleInviteMember = () => {
    alert('Invite New Member\n\nOpening invitation form with:\n• Email invitation system\n• Role assignment\n• Department selection\n• Permission configuration\n• Welcome message customization');
  };

  const handleExportMembers = () => {
    alert('Exporting Member Data\n\nGenerating comprehensive export including:\n• Member directory\n• Role assignments\n• Performance metrics\n• Contact information\n• Activity reports\n\nAvailable formats: PDF, CSV, Excel');
  };

  const handleBulkAction = (action) => {
    alert(`Bulk Action: ${action}\n\nThis would apply the selected action to all checked members:\n• Role changes\n• Status updates\n• Permission modifications\n• Department transfers`);
  };

  const handleSendMessage = (member) => {
    alert(`Sending message to: ${member.name}\n\nOpening message composer with:\n• Email notification\n• In-app messaging\n• Task assignments\n• Announcement broadcasts`);
  };

  const roleCounts = {
    all: members.length,
    administrator: members.filter(m => m.role === 'administrator').length,
    coordinator: members.filter(m => m.role === 'coordinator').length,
    member: members.filter(m => m.role === 'member').length
  };

  const statusCounts = {
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length,
    pending: members.filter(m => m.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage your institution's waste management team</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportMembers} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={handleInviteMember}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrators</p>
                  <p className="text-2xl font-bold text-purple-600">{roleCounts.administrator}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members by name, email, or department..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'administrator', 'coordinator', 'member'].map((role) => (
                  <Button
                    key={role}
                    variant={filterRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole(role)}
                    className="capitalize"
                  >
                    {role === 'all' ? 'All Roles' : role}
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

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Team Members ({filteredMembers.length})
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('role')}
                >
                  Bulk Role Change
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('status')}
                >
                  Bulk Status Update
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Member Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          {getStatusIcon(member.status)}
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{member.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Joined: {member.joinDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Last active: {member.lastActive}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            <span>{member.reportsSubmitted} reports</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Department:</strong> {member.department}
                        </div>

                        <p className="text-sm text-gray-600">{member.bio}</p>

                        {/* Permissions */}
                        <div className="flex gap-1 mt-2">
                          {member.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(member)}
                        title="Send Message"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewMember(member)}
                        title="View Details"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditMember(member.id)}
                        title="Edit Member"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" title="More Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Member Details</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-2xl">
                      {selectedMember.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getRoleColor(selectedMember.role)}>
                        {selectedMember.role}
                      </Badge>
                      <Badge className={getStatusColor(selectedMember.status)}>
                        {selectedMember.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{selectedMember.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedMember.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedMember.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Activity Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div>Reports Submitted: <span className="font-medium">{selectedMember.reportsSubmitted}</span></div>
                      <div>Tasks Completed: <span className="font-medium">{selectedMember.tasksCompleted}</span></div>
                      <div>Join Date: <span className="font-medium">{selectedMember.joinDate}</span></div>
                      <div>Last Active: <span className="font-medium">{selectedMember.lastActive}</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Bio</h4>
                  <p className="text-gray-600">{selectedMember.bio}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => handleEditMember(selectedMember.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Member
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleSendMessage(selectedMember)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
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

export default InstitutionMembers;
