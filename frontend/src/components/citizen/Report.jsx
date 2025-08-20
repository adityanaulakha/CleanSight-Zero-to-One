import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Clock,
  Zap,
  X,
  Image as ImageIcon,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { reportService } from "@/lib/localDatabase.js";

const Report = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [canSubmitReport, setCanSubmitReport] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    address: "",
    landmark: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecentReports();
    }
  }, [user]);

  const loadRecentReports = async () => {
    if (!user) {
      console.log('No user found, skipping recent reports load'); // Debug log
      return;
    }
    
    try {
      const reports = await reportService.getReportsByUser(user.id);
      setRecentReports(reports.slice(0, 5)); // Show last 5 reports
    } catch (error) {
      console.error('Error loading recent reports:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file); // Debug log
    
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      
      console.log('File validation passed, setting file...'); // Debug log
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('File read successfully'); // Debug log
        setSelectedImage(e.target?.result);
        // Call YOLO detection instead of simulation
        analyzeImageWithYOLO(file);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading file');
        setSelectedFile(null);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected'); // Debug log
    }
  };

  const analyzeImageWithYOLO = async (file) => {
    setIsAnalyzing(true);
    setDetectionResult(null);
    setAnnotatedImage(null);
    setCanSubmitReport(false);
    
    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Sending image to YOLO model...');
      
      // Send to your Python backend
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('YOLO detection result:', result);
      
      if (result.success) {
        // Set the detection results
        setDetectionResult({
          garbageDetected: result.garbage_detected,
          confidence: result.confidence,
          garbageProbability: result.garbage_probability,
          message: result.garbage_detected 
            ? `Garbage detected with ${(result.confidence * 100).toFixed(1)}% confidence`
            : `No garbage detected (${(result.confidence * 100).toFixed(1)}% confidence)`
        });
        
        // Set annotated image if available
        if (result.annotated_image) {
          setAnnotatedImage(`data:image/png;base64,${result.annotated_image}`);
        }
        
        // Allow report submission only if garbage is detected
        setCanSubmitReport(result.garbage_detected);
        
        // Update form category if garbage detected
        if (result.garbage_detected) {
          setFormData(prev => ({
            ...prev,
            category: "waste"
          }));
        }
        
      } else {
        throw new Error(result.error || 'Detection failed');
      }
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Check if it's a connection error (backend not running)
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        alert('Cannot connect to AI detection service. Please ensure the backend server is running on port 5000.\n\nTo start the backend:\n1. Navigate to the backend folder\n2. Run: python app.py');
        
        // Fallback: allow manual submission with warning
        setDetectionResult({
          garbageDetected: null,
          confidence: 0,
          garbageProbability: 0,
          message: 'AI detection unavailable - manual verification required'
        });
        setCanSubmitReport(true); // Allow submission in case of backend issues
      } else {
        alert(`AI detection failed: ${error.message}\n\nPlease try again or contact support.`);
        setDetectionResult({
          garbageDetected: false,
          confidence: 0,
          garbageProbability: 0,
          message: 'Detection failed - please try again'
        });
        setCanSubmitReport(false);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      // Fallback to coordinates if API fails
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const getCurrentLocation = () => {
    console.log('getCurrentLocation called'); // Debug log
    
    if (navigator.geolocation) {
      console.log('Geolocation is supported'); // Debug log
      
      // Show loading state
      setFormData(prev => ({
        ...prev,
        address: "Getting location..."
      }));
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Position obtained:', position.coords); // Debug log
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          
          try {
            // Get human-readable address from coordinates
            const address = await getAddressFromCoordinates(latitude, longitude);
            console.log('Address obtained:', address); // Debug log
            setFormData(prev => ({
              ...prev,
              address: address
            }));
          } catch (error) {
            console.error('Error getting address:', error);
            setFormData(prev => ({
              ...prev,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your location. ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please enter address manually.";
              break;
          }
          alert(errorMessage);
          setFormData(prev => ({
            ...prev,
            address: ""
          }));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    } else {
      console.log('Geolocation is not supported'); // Debug log
      alert("Geolocation is not supported by this browser. Please enter address manually.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please provide a title for the report.');
      return;
    }
    if (!formData.address.trim() && !currentLocation) {
      alert('Please specify the location or use GPS.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reportData = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        address: formData.address,
        landmark: formData.landmark,
        latitude: currentLocation?.latitude || 28.4595, // Default to Gurugram
        longitude: currentLocation?.longitude || 77.0466
      };

      console.log('🏢 Creating report with citizen zone:', user?.zone); // Debug log
      const result = await reportService.createReport(reportData, selectedFile);
      
      // Show enhanced success message with zone information
      const zoneText = user?.zone?.split(' - ')[1] || user?.zone || 'your area';
      alert(`Report submitted successfully! 🎉\n\nDetails:\n• Title: ${formData.title}\n• Location: ${formData.address}\n• Severity: ${formData.severity}\n• Your Zone: ${zoneText}\n• Status: Pending Assignment\n\n✅ Task automatically created for collection kiosks in ${zoneText}!\n\nYou'll receive points once the cleanup is completed.`);
      
      // Log for cross-portal synchronization debugging
      console.log('📝 Report created successfully:', result);
      console.log('🔄 Automatic task creation should be triggered for zone:', user?.zone);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        address: "",
        landmark: "",
      });
      setSelectedImage(null);
      setSelectedFile(null);
      setDetectionResult(null);
      setAnnotatedImage(null);
      setCanSubmitReport(false);
      setCurrentLocation(null);
      
      // Reload recent reports
      await loadRecentReports();
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId, reportTitle) => {
    if (!user) {
      alert('You must be logged in to delete reports.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the report "${reportTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await reportService.deleteReport(reportId, user.id);
      alert('Report deleted successfully!');
      
      // Reload recent reports to reflect the deletion
      await loadRecentReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(`Failed to delete report: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Report Garbage
        </h1>
        <p className="text-lg text-muted-foreground">
          Help keep our community clean by reporting garbage locations
        </p>
        {user?.zone && (
          <div className="mt-4">
            <Badge variant="outline" className="bg-eco/10 text-eco border-eco">
              📍 Your Zone: {user.zone}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-eco" />
              Upload Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-eco transition-colors cursor-pointer"
              onClick={() => document.getElementById('image-upload')?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-eco');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-eco');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-eco');
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  handleImageUpload({ target: { files } });
                }
              }}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={annotatedImage || selectedImage} 
                    alt="Uploaded garbage" 
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  {annotatedImage && (
                    <p className="text-xs text-muted-foreground text-center">
                      Showing AI-annotated version with detection boxes
                    </p>
                  )}
                  {isAnalyzing && (
                    <div className="flex items-center justify-center gap-2 text-eco">
                      <Zap className="h-4 w-4 animate-pulse" />
                      <span>AI analyzing image...</span>
                    </div>
                  )}
                  {detectionResult && (
                    <div className="space-y-2">
                      <Badge 
                        variant="outline" 
                        className={
                          detectionResult.garbageDetected === true 
                            ? 'bg-success/10 text-success border-success' 
                            : detectionResult.garbageDetected === false
                            ? 'bg-destructive/10 text-destructive border-destructive'
                            : 'bg-warning/10 text-warning border-warning'
                        }
                      >
                        {detectionResult.garbageDetected === true ? (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        ) : detectionResult.garbageDetected === false ? (
                          <X className="h-4 w-4 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-2" />
                        )}
                        {detectionResult.message}
                      </Badge>
                      
                      {detectionResult.garbageDetected === true && (
                        <div className="text-center p-3 bg-success/5 border border-success/20 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
                          <p className="text-sm font-medium text-success">
                            ✅ Report can be submitted
                          </p>
                          <p className="text-xs text-success/80">
                            Garbage detected with {(detectionResult.confidence * 100).toFixed(1)}% confidence
                          </p>
                        </div>
                      )}
                      
                      {detectionResult.garbageDetected === false && (
                        <div className="text-center p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <X className="h-6 w-6 text-destructive mx-auto mb-2" />
                          <p className="text-sm font-medium text-destructive">
                            ❌ Report submission blocked
                          </p>
                          <p className="text-xs text-destructive/80">
                            No garbage detected in this image. Please upload an image containing garbage.
                          </p>
                        </div>
                      )}
                      
                      {detectionResult.garbageDetected === null && (
                        <div className="text-center p-3 bg-warning/5 border border-warning/20 rounded-lg">
                          <AlertCircle className="h-6 w-6 text-warning mx-auto mb-2" />
                          <p className="text-sm font-medium text-warning">
                            ⚠️ AI detection unavailable
                          </p>
                          <p className="text-xs text-warning/80">
                            Manual verification required - please ensure image contains garbage
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop an image or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                  type="button"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {selectedImage ? "Change Photo" : "Select Photo"}
                </Button>
              </div>
            </div>

            <Button 
              variant="eco" 
              className="w-full"
              onClick={() => {
                console.log('Use Current Location button clicked'); // Debug log
                getCurrentLocation();
              }}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Report Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input 
                id="title" 
                placeholder="Brief title for this report"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Enter address or use GPS"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Nearby Landmark (Optional)</Label>
              <Input 
                id="landmark" 
                placeholder="e.g., Near City Mall, Opposite School..."
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({...prev, landmark: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the garbage type and quantity..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label>Severity Level</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select the priority level for this waste report
              </p>
              <div className="flex gap-2">
                <Button 
                  variant={formData.severity === "low" ? "default" : "outline"} 
                  size="sm" 
                  className="flex-1 flex-col h-auto py-3"
                  onClick={() => setFormData(prev => ({...prev, severity: "low"}))}
                >
                  <Clock className="h-4 w-4 mb-1" />
                  <span>Low</span>
                </Button>
                <Button 
                  variant={formData.severity === "medium" ? "warning" : "outline"} 
                  size="sm" 
                  className="flex-1 flex-col h-auto py-3"
                  onClick={() => setFormData(prev => ({...prev, severity: "medium"}))}
                >
                  <AlertCircle className="h-4 w-4 mb-1" />
                  <span>Medium</span>
                </Button>
                <Button 
                  variant={formData.severity === "high" ? "destructive" : "outline"} 
                  size="sm" 
                  className="flex-1 flex-col h-auto py-3"
                  onClick={() => setFormData(prev => ({...prev, severity: "high"}))}
                >
                  <AlertCircle className="h-4 w-4 mb-1" />
                  <span>High</span>
                </Button>
                <Button 
                  variant={formData.severity === "critical" ? "destructive" : "outline"} 
                  size="sm" 
                  className="flex-1 flex-col h-auto py-3"
                  onClick={() => setFormData(prev => ({...prev, severity: "critical"}))}
                >
                  <AlertCircle className="h-4 w-4 mb-1" />
                  <span>Critical</span>
                </Button>
              </div>
            </div>

            <Button 
              variant="hero" 
              className={`w-full transition-all duration-200 ${
                !canSubmitReport && selectedImage
                  ? 'opacity-50 cursor-not-allowed bg-muted hover:bg-muted' 
                  : ''
              }`}
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || (!canSubmitReport && selectedImage)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : 
               (!canSubmitReport && selectedImage) ? "Report Blocked - No Garbage Detected" :
               "Submit Report"}
            </Button>

            {!canSubmitReport && selectedImage && detectionResult?.garbageDetected === false && (
              <div className="text-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Upload an image containing garbage to enable report submission
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Earn <span className="font-semibold bg-gradient-to-r from-eco to-primary bg-clip-text text-transparent">Reward Points</span> based on waste quantity collected
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mt-8 shadow-card">
        <CardHeader>
          <CardTitle>Your Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reports submitted yet. Submit your first report above!
              </p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg group hover:border-eco/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-eco/10 rounded-lg flex items-center justify-center">
                      {report.image_url ? (
                        <img 
                          src={report.image_url} 
                          alt="Report" 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-eco" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString()} • {report.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" size="sm">
                          {report.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className={
                            report.severity === 'critical' ? 'border-destructive text-destructive' :
                            report.severity === 'high' ? 'border-destructive text-destructive' :
                            report.severity === 'medium' ? 'border-warning text-warning' :
                            'border-muted text-muted-foreground'
                          }
                        >
                          {report.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={
                        report.status === 'completed' ? 'bg-success/10 text-success border-success' :
                        report.status === 'in_progress' ? 'bg-warning/10 text-warning border-warning' :
                        report.status === 'assigned' ? 'bg-primary/10 text-primary border-primary' :
                        'bg-muted/10 text-muted-foreground border-muted'
                      }
                    >
                      {report.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <span className="text-sm font-medium">
                      {report.status === 'completed' ? (
                        <span className="text-success">+50 pts</span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </span>
                    
                    {/* Delete button - only show for pending reports */}
                    {report.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id, report.title)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity border-destructive/20 hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
                        title="Delete this report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
