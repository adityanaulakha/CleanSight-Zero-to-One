import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Award,
  TrendingUp,
  Download
} from 'lucide-react';

const AdminPartners = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock partner data
  const partners = [
    {
      id: 'P001',
      name: 'Green Earth Foundation',
      type: 'NGO',
      email: 'contact@greenearth.org',
      phone: '+91 11 2345 6789',
      website: 'https://greenearth.org',
      location: 'New Delhi, India',
      joinDate: '2024-01-10',
      status: 'active',
      contactPerson: 'Dr. Rajesh Gupta',
      partnersCount: 45,
      reportsManaged: 156,
      wasteProcessed: '2.5 tons',
      rating: 4.8,
      avatar: null,
      verified: true,
      description: 'Leading environmental NGO focused on waste management and sustainability education.',
      achievements: ['Top Partner 2024', 'Waste Reduction Champion']
    },
    {
      id: 'P002',
      name: 'EcoTech Solutions',
      type: 'Private Company',
      email: 'partnerships@ecotech.com',
      phone: '+91 22 3456 7890',
      website: 'https://ecotech.com',
      location: 'Mumbai, India',
      joinDate: '2024-02-15',
      status: 'active',
      contactPerson: 'Ms. Priya Sharma',
      partnersCount: 78,
      reportsManaged: 234,
      wasteProcessed: '4.2 tons',
      rating: 4.6,
      avatar: null,
      verified: true,
      description: 'Technology-driven waste management solutions for smart cities.',
      achievements: ['Innovation Award', 'Sustainability Leader']
    },
    {
      id: 'P003',
      name: 'Clean Bangalore Initiative',
      type: 'Government',
      email: 'info@cleanblr.gov.in',
      phone: '+91 80 4567 8901',
      website: 'https://cleanblr.gov.in',
      location: 'Bangalore, India',
      joinDate: '2024-03-01',
      status: 'pending',
      contactPerson: 'Mr. Suresh Kumar',
      partnersCount: 0,
      reportsManaged: 0,
      wasteProcessed: '0 tons',
      rating: 0,
      avatar: null,
      verified: false,
      description: 'Government initiative for comprehensive waste management across Bangalore.',
      achievements: []
    },
    {
      id: 'P004',
      name: 'WasteWise Corp',
      type: 'Private Company',
      email: 'hello@wastewise.co.in',
      phone: '+91 44 5678 9012',
      website: 'https://wastewise.co.in',
      location: 'Chennai, India',
      joinDate: '2024-01-25',
      status: 'suspended',
      contactPerson: 'Ms. Anita Devi',
      partnersCount: 23,
      reportsManaged: 67,
      wasteProcessed: '1.8 tons',
      rating: 3.2,
      avatar: null,
      verified: true,
      description: 'Commercial waste management services with focus on recycling.',
      achievements: [],
      suspensionReason: 'Non-compliance with data reporting requirements'
    },
    {
      id: 'P005',
      name: 'Swachh Bharat Foundation',
      type: 'NGO',
      email: 'connect@swachhbharat.org',
      phone: '+91 33 6789 0123',
      website: 'https://swachhbharat.org',
      location: 'Kolkata, India',
      joinDate: '2024-02-20',
      status: 'active',
      contactPerson: 'Dr. Meera Banerjee',
      partnersCount: 67,
      reportsManaged: 189,
      wasteProcessed: '3.1 tons',
      rating: 4.9,
      avatar: null,
      verified: true,
      description: 'National foundation promoting cleanliness and environmental awareness.',
      achievements: ['Excellence Award', 'Community Impact Leader', 'Top Partner 2024']
    }
  ];

  const filters = [
    { id: 'all', label: 'All Partners', count: partners.length },
    { id: 'NGO', label: 'NGOs', count: partners.filter(p => p.type === 'NGO').length },
    { id: 'Private Company', label: 'Companies', count: partners.filter(p => p.type === 'Private Company').length },
    { id: 'Government', label: 'Government', count: partners.filter(p => p.type === 'Government').length },
    { id: 'active', label: 'Active', count: partners.filter(p => p.status === 'active').length },
    { id: 'pending', label: 'Pending', count: partners.filter(p => p.status === 'pending').length },
    { id: 'suspended', label: 'Suspended', count: partners.filter(p => p.status === 'suspended').length }
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesFilter = selectedFilter === 'all' || 
                         partner.type === selectedFilter || 
                         partner.status === selectedFilter;
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'NGO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Private Company': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Government': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'suspended': return AlertCircle;
      default: return CheckCircle;
    }
  };

  const handlePartnerAction = (action, partner) => {
    switch (action) {
      case 'approve':
        alert(`Approving partnership with: ${partner.name}\n\nThis will activate their account and grant full platform access.`);
        break;
      case 'suspend':
        alert(`Suspending partnership with: ${partner.name}\n\nThis will temporarily disable their access. Reason required.`);
        break;
      case 'activate':
        alert(`Reactivating partnership with: ${partner.name}\n\nThis will restore their full platform access.`);
        break;
      case 'terminate':
        alert(`Terminate partnership with: ${partner.name}\n\nWARNING: This action cannot be undone. All partnership data will be archived.`);
        break;
      case 'contact':
        alert(`Contacting: ${partner.name}\n\nContact: ${partner.contactPerson}\nEmail: ${partner.email}\nPhone: ${partner.phone}`);
        break;
      case 'view':
        alert(`Partner Details: ${partner.name}\n\nType: ${partner.type}\nStatus: ${partner.status}\nJoined: ${partner.joinDate}\nLocation: ${partner.location}\nPartners: ${partner.partnersCount}\nReports Managed: ${partner.reportsManaged}\nWaste Processed: ${partner.wasteProcessed}\n\n[Full profile would open in modal]`);
        break;
      case 'export':
        alert(`Exporting data for: ${partner.name}\n\nGenerating comprehensive report including:\n• Partnership details\n• Performance metrics\n• Reports managed\n• Waste processing data\n• Contact information`);
        break;
      default:
        break;
    }
  };

  const totalWasteProcessed = partners.reduce((sum, partner) => {
    const waste = parseFloat(partner.wasteProcessed.replace(' tons', ''));
    return sum + (isNaN(waste) ? 0 : waste);
  }, 0);

  const totalReportsManaged = partners.reduce((sum, partner) => sum + partner.reportsManaged, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Network</h1>
              <p className="text-gray-600">Manage institutional partnerships and collaborations</p>
            </div>
            <Button 
              onClick={() => alert('Add New Partner\n\nFeatures:\n• Partnership application form\n• Due diligence checklist\n• Contract management\n• Performance tracking setup')}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Add Partner
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Partnerships</p>
                  <p className="text-2xl font-bold text-green-600">{partners.filter(p => p.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Waste Processed</p>
                  <p className="text-2xl font-bold text-purple-600">{totalWasteProcessed.toFixed(1)} tons</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports Managed</p>
                  <p className="text-2xl font-bold text-orange-600">{totalReportsManaged}</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partners</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search partners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Advanced Filters\n\n• Filter by partner type\n• Filter by status\n• Filter by location\n• Filter by join date\n• Filter by performance metrics')}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Exporting partner network data...\n\nGenerating comprehensive report including:\n• Partner directory\n• Performance analytics\n• Contract status\n• Contact information')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter karte hai Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Partners List */}
            <div className="space-y-6">
              {filteredPartners.map((partner, index) => {
                const StatusIcon = getStatusIcon(partner.status);
                
                return (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border rounded-lg hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={partner.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                            {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                            <Badge className={getTypeColor(partner.type)}>
                              {partner.type}
                            </Badge>
                            <Badge className={getStatusColor(partner.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {partner.status}
                            </Badge>
                            {partner.verified && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Verified
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-2 max-w-2xl">{partner.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {partner.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {partner.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <a href={partner.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {partner.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Joined {partner.joinDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Contact: {partner.contactPerson}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {partner.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handlePartnerAction('approve', partner)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        {partner.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePartnerAction('suspend', partner)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Suspend
                          </Button>
                        )}
                        {partner.status === 'suspended' && (
                          <Button 
                            size="sm"
                            onClick={() => handlePartnerAction('activate', partner)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePartnerAction('contact', partner)}
                        >
                          Contact
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => alert(`More Actions for ${partner.name}\n\n• View Contract\n• Performance Reports\n• Edit Partnership\n• Export Data\n• Terminate Partnership`)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{partner.partnersCount}</p>
                        <p className="text-sm text-gray-600">Partners</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{partner.reportsManaged}</p>
                        <p className="text-sm text-gray-600">Reports Managed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{partner.wasteProcessed}</p>
                        <p className="text-sm text-gray-600">Waste Processed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{partner.rating > 0 ? partner.rating : 'N/A'}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    {partner.achievements.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Achievements:</p>
                        <div className="flex flex-wrap gap-2">
                          {partner.achievements.map((achievement, idx) => (
                            <Badge key={idx} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              <Award className="h-3 w-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suspension Reason */}
                    {partner.suspensionReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Suspension Reason:</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{partner.suspensionReason}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPartners;
