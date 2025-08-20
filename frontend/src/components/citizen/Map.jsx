import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Recycle,
  Zap
} from "lucide-react";
import { reportService } from "@/lib/localDatabase.js";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for different urgency levels
const createCustomIcon = (urgency) => {
  const color = urgency === 'High' ? '#ef4444' : urgency === 'Medium' ? '#f59e0b' : '#10b981';
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const Map = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.4595, 77.0466]); // Default to Gurugram

  useEffect(() => {
    loadReports();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, filterType]);

  const loadReports = async () => {
    const allReports = await reportService.getAllReports();
    setReports(allReports);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.landmark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(report => 
        report.severity?.toLowerCase() === filterType.toLowerCase()
      );
    }

    setFilteredReports(filtered);
  };

  const mapStats = [
    { 
      label: "Active Reports", 
      value: reports.filter(r => r.status === 'pending').length, 
      icon: AlertTriangle, 
      color: "warning" 
    },
    { 
      label: "Completed", 
      value: reports.filter(r => r.status === 'completed').length, 
      icon: CheckCircle, 
      color: "success" 
    },
    { 
      label: "In Progress", 
      value: reports.filter(r => r.status === 'in_progress').length, 
      icon: Clock, 
      color: "primary" 
    },
    { 
      label: "Total Reports", 
      value: reports.length, 
      icon: Recycle, 
      color: "eco" 
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Garbage Heatmap</h1>
          <p className="text-muted-foreground">Real-time visualization of garbage reports across the city</p>
        </div>
      </div>

      {/* Map Controls */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search location, landmark, or report..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setFilterType(filterType === "all" ? "high" : filterType === "high" ? "medium" : filterType === "medium" ? "low" : "all")}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filterType === "all" ? "All" : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Priority`}
              </Button>
              <Button 
                variant="eco"
                onClick={getCurrentLocation}
              >
                <Navigation className="h-4 w-4 mr-2" />
                My Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 w-full">
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  className="h-full w-full rounded-lg"
                  style={{ height: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Navigation className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">Your Location</span>
                          </div>
                          <p className="text-sm text-gray-600">You are here</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Report Markers */}
                  {filteredReports.map((report) => (
                    <Marker 
                      key={report.id} 
                      position={[report.latitude, report.longitude]}
                      icon={createCustomIcon(report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1))}
                    >
                      <Popup>
                        <div className="min-w-48">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{report.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={
                                report.severity === 'high' ? 'border-red-500 text-red-600' :
                                report.severity === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-green-500 text-green-600'
                              }
                            >
                              {report.severity?.toUpperCase()}
                            </Badge>
                          </div>
                          
                          {report.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {report.description}
                            </p>
                          )}
                          
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{report.address}</span>
                            </div>
                            {report.landmark && (
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                <span>{report.landmark}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">Status:</span>
                              <Badge 
                                variant="outline" 
                                className={
                                  report.status === 'completed' ? 'bg-green-100 border-green-500 text-green-700' :
                                  report.status === 'in_progress' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' :
                                  'bg-gray-100 border-gray-500 text-gray-700'
                                }
                              >
                                {report.status?.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Map Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mapStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                        <Icon className={`h-4 w-4 text-${stat.color}`} />
                      </div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Map Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-destructive"></div>
                <span className="text-sm">High Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-warning"></div>
                <span className="text-sm">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-success"></div>
                <span className="text-sm">Low Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-muted"></div>
                <span className="text-sm">Completed</span>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Reports */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Nearby Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">{report.title}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        report.status === 'completed' ? 'bg-success/10 border-success text-success text-xs' :
                        report.status === 'in_progress' ? 'bg-warning/10 border-warning text-warning text-xs' :
                        'bg-destructive/10 border-destructive text-destructive text-xs'
                      }
                    >
                      {report.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{report.address}</span>
                  </div>
                  {report.landmark && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" />
                      <span>{report.landmark}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <div className="text-center py-6">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No reports found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
