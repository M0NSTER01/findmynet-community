import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Play, Square, Wifi, Shield } from "lucide-react";
import { toast } from "sonner";

const ReportFound = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Array<{
    deviceId: string;
    timestamp: string;
  }>>([]);

  const handleScanToggle = () => {
    if (!isScanning) {
      // Start scanning
      setIsScanning(true);
      toast.success("Started scanning for nearby devices");
      
      // Simulate finding devices
      const simulateDeviceDetection = () => {
        if (isScanning) {
          const deviceIds = [
            "DEVICE_ABC123",
            "SIH_PROJECT_COBRA", 
            "TRACKER_XYZ789",
            "BEACON_DEF456"
          ];
          
          const randomDevice = deviceIds[Math.floor(Math.random() * deviceIds.length)];
          const now = new Date().toLocaleTimeString();
          
          setScanResults(prev => [{
            deviceId: randomDevice,
            timestamp: now
          }, ...prev.slice(0, 4)]); // Keep only last 5 results
          
          toast.info(`Found '${randomDevice}' and reported its location!`);
        }
      };

      // Simulate device detection every 3-8 seconds
      const interval = setInterval(() => {
        if (Math.random() > 0.6) { // 40% chance each interval
          simulateDeviceDetection();
        }
      }, Math.random() * 5000 + 3000);

      // Store interval in component state (in real app, use useRef)
      (window as any).scanInterval = interval;
    } else {
      // Stop scanning
      setIsScanning(false);
      clearInterval((window as any).scanInterval);
      toast.info("Stopped scanning");
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Radar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Help Find a Device
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Help others by turning your device into a scanner. If you find a lost device, 
              its location will be anonymously reported to the owner.
            </p>
          </div>

          {/* Scan Control */}
          <Card className="shadow-elegant border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl">Network Scanner</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <Button
                onClick={handleScanToggle}
                variant={isScanning ? "scan-active" : "scan"}
                size="lg"
                className="w-full h-16 text-lg mb-6"
              >
                {isScanning ? (
                  <>
                    <Square className="w-6 h-6 mr-3" />
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-3" />
                    Start Scanning
                  </>
                )}
              </Button>

              {/* Status */}
              <div className="p-4 rounded-lg bg-muted/30">
                {isScanning ? (
                  <div className="flex items-center justify-center text-accent">
                    <div className="animate-pulse w-3 h-3 bg-accent rounded-full mr-3"></div>
                    <span className="font-medium">Scanning for nearby devices...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Wifi className="w-5 h-5 mr-3" />
                    <span>Your device is not currently scanning</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scan Results */}
          {scanResults.length > 0 && (
            <Card className="shadow-elegant border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Recent Detections
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {scanResults.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/10 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                          <Radar className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{result.deviceId}</p>
                          <p className="text-xs text-muted-foreground">Location reported anonymously</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Info */}
          <Card className="bg-muted/30 border-0">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Privacy Protected</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    All scanning is completely anonymous. Device locations are encrypted and 
                    only shared with verified owners. Your personal information is never collected or stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;