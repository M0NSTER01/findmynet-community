import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Clock } from "lucide-react";
import { toast } from "sonner";

const FindMyDevice = () => {
  const [deviceId, setDeviceId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [locationInfo, setLocationInfo] = useState<{
    found: boolean;
    location?: string;
    timestamp?: string;
    accuracy?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId.trim()) {
      toast.error("Please enter a device ID");
      return;
    }

    setIsSearching(true);
    setLocationInfo(null);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      
      // Simulate finding device
      const found = Math.random() > 0.3; // 70% chance of finding
      
      if (found) {
        setLocationInfo({
          found: true,
          location: "Dombivli, Maharashtra",
          timestamp: "2 minutes ago",
          accuracy: "±25 meters"
        });
        toast.success("Device found!");
      } else {
        setLocationInfo({
          found: false
        });
        toast.error("Device not found in network");
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find My Device
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Enter your device ID to see its last known location on the map.
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-elegant border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl">Device Search</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="deviceId" className="text-sm font-medium text-foreground">
                    Device ID
                  </Label>
                  <Input
                    id="deviceId"
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="Enter Your Device ID"
                    className="h-12 text-base"
                    disabled={isSearching}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  variant="hero"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching Network...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find Device
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="shadow-elegant border-0 mb-8">
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-hero rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Map will be displayed here...</p>
                  <p className="text-muted-foreground">Search for a device to see its location</p>
                </div>
                
                {/* Decorative map-like elements */}
                <div className="absolute top-10 left-10 w-3 h-3 bg-primary rounded-full opacity-30"></div>
                <div className="absolute bottom-20 right-15 w-2 h-2 bg-accent rounded-full opacity-40"></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-accent/30 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          {locationInfo && (
            <Card className="shadow-elegant border-0">
              <CardContent className="p-8">
                {locationInfo.found ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Device Located</h3>
                        <p className="text-sm text-muted-foreground">Last known location</p>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                        <p className="text-foreground">{locationInfo.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Last Seen</p>
                        <p className="text-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {locationInfo.timestamp}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Accuracy</p>
                        <p className="text-foreground">{locationInfo.accuracy}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Device Not Found</h3>
                    <p className="text-muted-foreground">
                      This device hasn't been detected by our network recently. 
                      Try again later or ensure the device ID is correct.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMyDevice;