import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Database,
  Key,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const InstitutionSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      institutionName: 'Green University',
      institutionType: 'University',
      address: '123 Campus Drive, Education City',
      phone: '+1-234-567-8900',
      email: 'sustainability@greenuniversity.edu',
      website: 'https://greenuniversity.edu',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reportAlerts: true,
      taskReminders: true,
      performanceUpdates: true,
      systemMaintenance: true,
      weeklyDigest: true,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: true,
      passwordComplexity: 'high',
      sessionTimeout: 30,
      ipWhitelist: '',
      auditLogging: true,
      dataEncryption: true
    },
    integrations: {
      wasteManagementSystem: 'EcoTrack Pro',
      accountingSoftware: 'QuickBooks',
      emailService: 'SendGrid',
      smsProvider: 'Twilio',
      mapService: 'Google Maps',
      apiKey: 'YOUR_API_KEY',
      webhookUrl: 'https://api.greenuniversity.edu/webhook'
    },
    preferences: {
      theme: 'light',
      dashboardLayout: 'standard',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      numberFormat: 'en-US',
      autoSave: true,
      defaultView: 'dashboard'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!\n\nAll configuration changes have been applied to your institution account.');
  };

  const handleResetSettings = () => {
    alert('Reset Settings\n\nThis will restore all settings to their default values.\nAre you sure you want to continue?\n\n[This is a confirmation dialog]');
  };

  const handleTestIntegration = (service) => {
    alert(`Testing ${service} Integration\n\nRunning connection test...\n\n✅ Connection successful\n✅ API key valid\n✅ Permissions verified\n\nIntegration is working properly!`);
  };

  const handleExportSettings = () => {
    alert('Exporting Institution Settings\n\nGenerating configuration backup including:\n• All current settings\n• Integration configurations\n• User preferences\n• Security policies\n\nBackup will be downloaded as JSON file.');
  };

  const handleImportSettings = () => {
    alert('Import Settings\n\nSelect a configuration backup file to import:\n• Settings validation\n• Conflict resolution\n• Backup current settings\n• Apply new configuration\n\n[File picker would open here]');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
          <Input
            value={settings.general.institutionName}
            onChange={(e) => handleSettingChange('general', 'institutionName', e.target.value)}
            placeholder="Enter institution name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Type</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.general.institutionType}
            onChange={(e) => handleSettingChange('general', 'institutionType', e.target.value)}
          >
            <option value="University">University</option>
            <option value="School">School</option>
            <option value="Hospital">Hospital</option>
            <option value="Government">Government</option>
            <option value="Corporate">Corporate</option>
            <option value="NGO">NGO</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <Input
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          placeholder="Enter full address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <Input
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <Input
          value={settings.general.website}
          onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
          placeholder="Enter website URL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">GMT</option>
            <option value="Asia/Kolkata">IST</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'smsNotifications', label: 'SMS Notifications' },
              { key: 'pushNotifications', label: 'Push Notifications' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'reportAlerts', label: 'Report Alerts' },
              { key: 'taskReminders', label: 'Task Reminders' },
              { key: 'performanceUpdates', label: 'Performance Updates' },
              { key: 'systemMaintenance', label: 'System Maintenance' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'weeklyDigest', label: 'Weekly Digest' },
              { key: 'monthlyReports', label: 'Monthly Reports' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Complexity</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.security.passwordComplexity}
              onChange={(e) => handleSettingChange('security', 'passwordComplexity', e.target.value)}
            >
              <option value="low">Low (8+ characters)</option>
              <option value="medium">Medium (8+ chars, numbers)</option>
              <option value="high">High (8+ chars, numbers, symbols)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              placeholder="Session timeout in minutes"
              min="15"
              max="480"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
            <Input
              value={settings.security.ipWhitelist}
              onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
              placeholder="Enter IP addresses (comma-separated)"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Audit Logging</span>
              <p className="text-xs text-gray-500">Track all system activities and changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.auditLogging}
                onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Data Encryption</span>
              <p className="text-xs text-gray-500">Encrypt sensitive data at rest and in transit</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.dataEncryption}
                onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      {[
        { key: 'wasteManagementSystem', label: 'Waste Management System', icon: Database },
        { key: 'accountingSoftware', label: 'Accounting Software', icon: DollarSign },
        { key: 'emailService', label: 'Email Service', icon: Mail },
        { key: 'smsProvider', label: 'SMS Provider', icon: Phone },
        { key: 'mapService', label: 'Map Service', icon: MapPin }
      ].map((integration) => (
        <Card key={integration.key}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <integration.icon className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{integration.label}</h3>
                  <p className="text-sm text-gray-500">
                    Current: {settings.integrations[integration.key]}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestIntegration(integration.label)}
                >
                  Test Connection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert(`Configure ${integration.label}\n\nThis would open the configuration dialog for:\n• API credentials\n• Connection settings\n• Feature preferences\n• Sync options`)}
                >
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value={settings.integrations.apiKey}
                onChange={(e) => handleSettingChange('integrations', 'apiKey', e.target.value)}
                placeholder="Enter API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <Input
              value={settings.integrations.webhookUrl}
              onChange={(e) => handleSettingChange('integrations', 'webhookUrl', e.target.value)}
              placeholder="Enter webhook URL"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferenceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Layout</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.preferences.dashboardLayout}
                onChange={(e) => handleSettingChange('preferences', 'dashboardLayout', e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.preferences.dateFormat}
                onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.preferences.timeFormat}
                onChange={(e) => handleSettingChange('preferences', 'timeFormat', e.target.value)}
              >
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.preferences.numberFormat}
                onChange={(e) => handleSettingChange('preferences', 'numberFormat', e.target.value)}
              >
                <option value="en-US">1,234.56</option>
                <option value="de-DE">1.234,56</option>
                <option value="fr-FR">1 234,56</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Auto-save</span>
              <p className="text-xs text-gray-500">Automatically save changes as you type</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preferences.autoSave}
                onChange={(e) => handleSettingChange('preferences', 'autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.preferences.defaultView}
              onChange={(e) => handleSettingChange('preferences', 'defaultView', e.target.value)}
            >
              <option value="dashboard">Dashboard</option>
              <option value="reports">Reports</option>
              <option value="analytics">Analytics</option>
              <option value="members">Team Members</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institution Settings</h1>
            <p className="text-gray-600 mt-2">Configure your institution preferences and integrations</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleImportSettings} variant="outline">
              Import Settings
            </Button>
            <Button onClick={handleExportSettings} variant="outline">
              Export Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Set karte hai tings Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tabs.find(tab => tab.id === activeTab)?.icon && 
                    React.createElement(tabs.find(tab => tab.id === activeTab).icon, { className: "h-6 w-6" })
                  }
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'general' && renderGeneralSettings()}
                  {activeTab === 'notifications' && renderNotificationSettings()}
                  {activeTab === 'security' && renderSecuritySettings()}
                  {activeTab === 'integrations' && renderIntegrationSettings()}
                  {activeTab === 'preferences' && renderPreferenceSettings()}
                </motion.div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <Button onClick={handleResetSettings} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Database Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Email Service Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">API Endpoints Healthy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Security Protocols Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Storage 78% Used</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Backups Current</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionSettings;
