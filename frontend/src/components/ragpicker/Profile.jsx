import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  Settings,
  Camera,
  Save,
  Edit3,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  Timer,
  DollarSign
} from 'lucide-react';

const RagpickerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '09:00', end: '18:00' },
    tuesday: { available: true, start: '09:00', end: '18:00' },
    wednesday: { available: true, start: '09:00', end: '18:00' },
    thursday: { available: true, start: '09:00', end: '18:00' },
    friday: { available: true, start: '09:00', end: '18:00' },
    saturday: { available: true, start: '10:00', end: '16:00' },
    sunday: { available: false, start: '', end: '' }
  });

  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    address: 'Sector 15, Gurugram, Haryana - 122001',
    experience: '3 years',
    specialization: ['Plastic', 'E-Waste', 'Metal'],
    vehicleType: 'Rickshaw',
    serviceRadius: '5 km',
    languages: ['Hindi', 'English'],
    bio: 'Experienced waste collector with focus on environmental sustainability. Committed to efficient and reliable service.',
    emergencyContact: '+91 9876543211'
  });

  const stats = {
    totalTasks: 1824,
    completionRate: 96.5,
    rating: 4.8,
    totalEarnings: 142000,
    badges: ['Eco Warrior', 'Speed Demon', 'Customer Favorite', 'Green Champion']
  };

  const recentReviews = [
    {
      id: 1,
      customer: 'Apartment Complex A-15',
      rating: 5,
      comment: 'Very punctual and thorough in collection. Highly recommended!',
      date: '2024-01-15',
      taskType: 'Plastic Collection'
    },
    {
      id: 2,
      customer: 'Tech Solutions Pvt Ltd',
      rating: 5,
      comment: 'Professional handling of e-waste. Great service!',
      date: '2024-01-12',
      taskType: 'E-Waste'
    },
    {
      id: 3,
      customer: 'Residential Society B-12',
      rating: 4,
      comment: 'Good service, arrived on time.',
      date: '2024-01-10',
      taskType: 'Mixed Waste'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
    alert('Profile updated successfully!');
  };

  const handleSaveSchedule = () => {
    console.log('Saving schedule:', availability);
    alert('Availability schedule saved successfully!');
  };

  const handleResetSchedule = () => {
    console.log('Resetting schedule to default');
    const defaultSchedule = {
      Monday: { isActive: true, start: '09:00', end: '18:00' },
      Tuesday: { isActive: true, start: '09:00', end: '18:00' },
      Wednesday: { isActive: true, start: '09:00', end: '18:00' },
      Thursday: { isActive: true, start: '09:00', end: '18:00' },
      Friday: { isActive: true, start: '09:00', end: '18:00' },
      Saturday: { isActive: true, start: '10:00', end: '16:00' },
      Sunday: { isActive: false, start: '10:00', end: '16:00' }
    };
    setAvailability(defaultSchedule);
    alert('Schedule reset to default hours!');
  };

  const toggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }));
  };

  const updateTimeSlot = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Portal Header Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">🏪 Kiosk Portal - Profile</h1>
              <p className="text-purple-100 text-lg">
                Manage your kiosk operator profile and service settings
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kiosk Profile Management</h1>
          <p className="text-gray-600">Manage your profile, availability, and service preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'profile', name: 'Profile Info', icon: User },
                { id: 'availability', name: 'Availability', icon: Clock },
                { id: 'stats', name: 'Performance', icon: Award },
                { id: 'reviews', name: 'Reviews', icon: Star },
                { id: 'settings', name: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
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
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Profile Picture Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-2xl">{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-4">{profileData.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{stats.rating}</span>
                    <span className="text-gray-500">({stats.totalTasks} tasks)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{profileData.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{profileData.vehicleType} • {profileData.serviceRadius}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {profileData.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    size="sm"
                    variant={isEditing ? "default" : "outline"}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <Input
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <Input
                        value={profileData.vehicleType}
                        onChange={(e) => setProfileData({...profileData, vehicleType: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Radius</label>
                      <Input
                        value={profileData.serviceRadius}
                        onChange={(e) => setProfileData({...profileData, serviceRadius: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'availability' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Availability Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(availability).map(([day, schedule]) => (
                      <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-24">
                            <h4 className="font-medium capitalize">{day}</h4>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={schedule.available}
                              onChange={() => toggleDay(day)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm">Available</span>
                          </label>
                        </div>
                        
                        {schedule.available && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">From:</label>
                              <input
                                type="time"
                                value={schedule.start}
                                onChange={(e) => updateTimeSlot(day, 'start', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">To:</label>
                              <input
                                type="time"
                                value={schedule.end}
                                onChange={(e) => updateTimeSlot(day, 'end', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <Button className="mr-3" onClick={handleSaveSchedule}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Schedule
                    </Button>
                    <Button variant="outline" onClick={handleResetSchedule}>
                      Reset to Default
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </CardContent>
              </Card>

              {/* Badges Section */}
              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Achievement Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.badges.map((badge, index) => (
                      <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <p className="font-medium text-sm">{badge}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{review.customer}</h4>
                            <p className="text-sm text-gray-600">{review.taskType} • {review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about new tasks and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Location Tracking</h4>
                      <p className="text-sm text-gray-600">Allow location access for better task matching</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive SMS alerts for urgent tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Deactivate Account
                    </Button>
                    <p className="text-sm text-gray-600">
                      Temporarily disable your account. You can reactivate it anytime.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RagpickerProfile;
