import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";

const ReportLost = () => {
  const [deviceId, setDeviceId] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [status, setStatus] = useState<"idle" | "reporting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId.trim()) {
      toast.error("Please enter a device ID");
      return;
    }

    setIsReporting(true);
    setStatus("reporting");

    // Simulate API call
    setTimeout(() => {
      setIsReporting(false);
      setStatus("success");
      toast.success("Device successfully marked as lost!");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setDeviceId("");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Report a Lost Device
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Enter the unique ID of your device to mark it as lost. 
              This will activate location tracking via the network.
            </p>
          </div>

          {/* Form Card */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-center text-xl">Device Information</CardTitle>
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
                    placeholder="Enter Your Device ID (e.g., SIH_PROJECT_COBRA)"
                    className="h-12 text-base"
                    disabled={isReporting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  variant="hero"
                  disabled={isReporting}
                >
                  {isReporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Reporting Device...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Mark as Lost
                    </>
                  )}
                </Button>
              </form>

              {/* Status Messages */}
              <div className="mt-6">
                {status === "reporting" && (
                  <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
                    <span className="text-primary font-medium">Reporting device...</span>
                  </div>
                )}
                
                {status === "success" && (
                  <div className="flex items-center justify-center p-4 bg-accent/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    <span className="text-accent font-medium">Device successfully marked as lost.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
                <p className="text-muted-foreground text-sm">
                  Your device will be added to our network's watchlist. When other FindMyNet users 
                  come within range, they'll anonymously report its location to help you find it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;