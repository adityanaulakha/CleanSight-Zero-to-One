import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save,
  Shield,
  Bell,
  Globe,
  Database,
  Users,
  Camera,
  MapPin,
  Gift,
  CreditCard,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      platformName: 'CleanSight',
      tagline: 'AI-Powered Community Waste Management',
      timezone: 'Asia/Kolkata',
      language: 'English',
      maintenanceMode: false,
      allowRegistration: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      reportAlerts: true,
      systemAlerts: true,
      partnerUpdates: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90,
      requireStrongPasswords: true,
      allowApiAccess: true
    },
    integrations: {
      googleMapsApi: 'YOUR_GOOGLE_MAPS_API_KEY',
      twilioSid: 'YOUR_TWILIO_SID',
      emailService: 'SendGrid',
      paymentGateway: 'Razorpay',
      cloudStorage: 'AWS S3'
    },
    rewards: {
      reportPoints: 50,
      verificationBonus: 100,
      cleanupPoints: 200,
      referralBonus: 150,
      pointsExpiry: 365,
      minimumRedemption: 1000
    },
    moderation: {
      autoModeration: true,
      aiConfidenceThreshold: 85,
      requireManualReview: false,
      flagThreshold: 3,
      suspensionDuration: 30
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'moderation', label: 'Moderation', icon: Eye },
    { id: 'backup', label: 'Backup & Data', icon: Database }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!\n\nAll configuration changes have been applied to the platform.');
  };

  const handleBackup = () => {
    alert('Creating system backup...\n\nThis will include:\n• User data\n• Reports and media\n• System configurations\n• Analytics data\n\nBackup will be stored in secure cloud storage.');
  };

  const handleRestore = () => {
    alert('System Restore\n\nSelect a backup file to restore:\n• Full system restore\n• Partial data restore\n• Configuration only\n\nWARNING: This will overwrite current data.');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Name
          </label>
          <input
            type="text"
            value={settings.general.platformName}
            onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={settings.general.tagline}
            onChange={(e) => handleSettingChange('general', 'tagline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Maintenance Mode</h4>
            <p className="text-sm text-gray-600">Temporarily disable access to perform maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Allow New Registrations</h4>
            <p className="text-sm text-gray-600">Enable new users to register on the platform</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.allowRegistration}
              onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="5"
            max="120"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="3"
            max="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Expiry (days)
          </label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="30"
            max="365"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'twoFactorAuth', title: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts' },
          { key: 'requireStrongPasswords', title: 'Strong Password Policy', desc: 'Enforce strong password requirements' },
          { key: 'allowApiAccess', title: 'API Access', desc: 'Allow third-party API integrations' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security[item.key]}
                onChange={(e) => handleSettingChange('security', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', title: 'Email Notifications', desc: 'Send notifications via email', icon: Mail },
          { key: 'pushNotifications', title: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
          { key: 'smsNotifications', title: 'SMS Notifications', desc: 'Send notifications via SMS', icon: Phone },
          { key: 'reportAlerts', title: 'Report Alerts', desc: 'Notify when new reports are submitted', icon: Camera },
          { key: 'systemAlerts', title: 'System Alerts', desc: 'Critical system notifications', icon: AlertTriangle },
          { key: 'partnerUpdates', title: 'Partner Updates', desc: 'Updates from partner organizations', icon: Users }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'googleMapsApi', title: 'Google Maps API Key', icon: MapPin, placeholder: 'Enter Google Maps API key' },
          { key: 'twilioSid', title: 'Twilio Account SID', icon: Phone, placeholder: 'Enter Twilio Account SID' },
          { key: 'emailService', title: 'Email Service', icon: Mail, type: 'select', options: ['SendGrid', 'AWS SES', 'Mailgun'] },
          { key: 'paymentGateway', title: 'Payment Gateway', icon: CreditCard, type: 'select', options: ['Razorpay', 'Stripe', 'PayPal'] },
          { key: 'cloudStorage', title: 'Cloud Storage', icon: Database, type: 'select', options: ['AWS S3', 'Google Cloud', 'Azure'] }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <h4 className="font-medium">{item.title}</h4>
              </div>
              {item.type === 'select' ? (
                <select
                  value={settings.integrations[item.key]}
                  onChange={(e) => handleSettingChange('integrations', item.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {item.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={item.key === 'googleMapsApi' && showApiKey ? 'text' : 'password'}
                    value={settings.integrations[item.key]}
                    onChange={(e) => handleSettingChange('integrations', item.key, e.target.value)}
                    placeholder={item.placeholder}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {item.key === 'googleMapsApi' && (
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRewardsSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'reportPoints', title: 'Report Submission Points', min: 10, max: 200 },
          { key: 'verificationBonus', title: 'Verification Bonus Points', min: 50, max: 500 },
          { key: 'cleanupPoints', title: 'Cleanup Activity Points', min: 100, max: 1000 },
          { key: 'referralBonus', title: 'Referral Bonus Points', min: 50, max: 500 },
          { key: 'pointsExpiry', title: 'Points Expiry (days)', min: 30, max: 1095 },
          { key: 'minimumRedemption', title: 'Minimum Redemption Points', min: 100, max: 10000 }
        ].map((item) => (
          <div key={item.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {item.title}
            </label>
            <input
              type="number"
              value={settings.rewards[item.key]}
              onChange={(e) => handleSettingChange('rewards', item.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={item.min}
              max={item.max}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderModerationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Confidence Threshold (%)
          </label>
          <input
            type="number"
            value={settings.moderation.aiConfidenceThreshold}
            onChange={(e) => handleSettingChange('moderation', 'aiConfidenceThreshold', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="50"
            max="99"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flag Threshold
          </label>
          <input
            type="number"
            value={settings.moderation.flagThreshold}
            onChange={(e) => handleSettingChange('moderation', 'flagThreshold', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suspension Duration (days)
          </label>
          <input
            type="number"
            value={settings.moderation.suspensionDuration}
            onChange={(e) => handleSettingChange('moderation', 'suspensionDuration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="365"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'autoModeration', title: 'Auto Moderation', desc: 'Enable automatic content moderation using AI' },
          { key: 'requireManualReview', title: 'Manual Review Required', desc: 'Require manual review for flagged content' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.moderation[item.key]}
                onChange={(e) => handleSettingChange('moderation', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              System Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Create a complete backup of system data, configurations, and user information.
            </p>
            <Button onClick={handleBackup} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              System Restore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Restore system from a previous backup. This will overwrite current data.
            </p>
            <Button onClick={handleRestore} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Restore System
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automatic Backup Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Daily Backup</h4>
                <p className="text-sm text-gray-600">Automatically backup system data daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Time
                </label>
                <input
                  type="time"
                  defaultValue="02:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  min="7"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'integrations': return renderIntegrationsSettings();
      case 'rewards': return renderRewardsSettings();
      case 'moderation': return renderModerationSettings();
      case 'backup': return renderBackupSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
              <p className="text-gray-600">Configure platform settings and preferences</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => alert('Resetting to default settings...\n\nThis will restore all settings to their default values.')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Set karte hai tings Navigation */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Set karte hai tings Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon && (
                    React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "h-5 w-5" })
                  )}
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
