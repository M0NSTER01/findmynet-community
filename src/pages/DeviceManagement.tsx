import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Smartphone, UserCheck, UserX, Shield, Plus, Monitor, User } from 'lucide-react';

interface TransferRequest {
  id: string;
  deviceId: string;
  deviceName: string;
  fromUser: string;
  toUser: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const DeviceManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIMEI, setNewDeviceIMEI] = useState('');
  const [newDeviceSerial, setNewDeviceSerial] = useState('');
  const [requestDeviceId, setRequestDeviceId] = useState('');
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [pendingTransfer, setPendingTransfer] = useState<TransferRequest | null>(null);

  useEffect(() => {
    // Load transfer requests from localStorage
    const saved = localStorage.getItem('transferRequests');
    if (saved) {
      setTransferRequests(JSON.parse(saved));
    }
  }, []);

  const saveTransferRequests = (requests: TransferRequest[]) => {
    setTransferRequests(requests);
    localStorage.setItem('transferRequests', JSON.stringify(requests));
  };

  const handleRegisterDevice = () => {
    if (!newDeviceId.trim() || !newDeviceName.trim() || !newDeviceIMEI.trim() || !newDeviceSerial.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simulate device registration
    toast.success(`Device "${newDeviceName}" registered successfully with ID: ${newDeviceId}`);
    setNewDeviceId('');
    setNewDeviceName('');
    setNewDeviceIMEI('');
    setNewDeviceSerial('');
  };

  const handleRequestOwnership = () => {
    if (!requestDeviceId.trim()) {
      toast.error('Please enter a device ID');
      return;
    }

    // Check if device exists (static check)
    const knownDevices = ['DEVICE_USER1_001', 'SIH_PROJECT_COBRA', 'DEV_SAMSUNG_S24'];
    if (!knownDevices.includes(requestDeviceId)) {
      toast.error('Device not found');
      return;
    }

    // Create transfer request
    const request: TransferRequest = {
      id: Date.now().toString(),
      deviceId: requestDeviceId,
      deviceName: requestDeviceId === 'DEVICE_USER1_001' ? 'iPhone 14 Pro' : 'Unknown Device',
      fromUser: 'user1', // Static owner
      toUser: user?.username || '',
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };

    const updatedRequests = [...transferRequests, request];
    saveTransferRequests(updatedRequests);
    
    toast.success('Ownership request sent successfully');
    setRequestDeviceId('');
  };

  const handleApproveRequest = (request: TransferRequest) => {
    setPendingTransfer(request);
    setShowOtpDialog(true);
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = transferRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    saveTransferRequests(updatedRequests);
    toast.success('Request rejected');
  };

  const handleOtpVerification = () => {
    if (otpInput !== '0000') {
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    if (pendingTransfer) {
      const updatedRequests = transferRequests.map(req =>
        req.id === pendingTransfer.id ? { ...req, status: 'approved' as const } : req
      );
      saveTransferRequests(updatedRequests);
      toast.success('Device ownership transferred successfully!');
    }

    setShowOtpDialog(false);
    setOtpInput('');
    setPendingTransfer(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access device management features
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const myRequests = transferRequests.filter(req => req.toUser === user?.username);
  const pendingApprovals = transferRequests.filter(req => req.fromUser === user?.username && req.status === 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Device Management</h1>
        <p className="text-muted-foreground">
          Manage your devices, transfer ownership, and handle requests
        </p>
      </div>

      <Tabs defaultValue="my-devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="my-devices">My Devices</TabsTrigger>
          <TabsTrigger value="register">Register Device</TabsTrigger>
          <TabsTrigger value="request">Request Ownership</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground flex items-center justify-center">
                {pendingApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="my-devices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                My Devices
              </CardTitle>
              <CardDescription>
                Devices registered under your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.devices && user.devices.length > 0 ? (
                <div className="space-y-4">
                  {user.devices.map((device) => (
                    <div key={device.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {device.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Location: {device.location.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last seen: {device.lastSeen}
                          </p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No devices registered yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Register New Device
              </CardTitle>
              <CardDescription>
                Register a new device under your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  placeholder="Enter device ID"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  placeholder="Enter device name"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceIMEI">IMEI Number</Label>
                <Input
                  id="deviceIMEI"
                  placeholder="Enter IMEI number"
                  value={newDeviceIMEI}
                  onChange={(e) => setNewDeviceIMEI(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceSerial">Serial Number</Label>
                <Input
                  id="deviceSerial"
                  placeholder="Enter serial number"
                  value={newDeviceSerial}
                  onChange={(e) => setNewDeviceSerial(e.target.value)}
                />
              </div>
              <Button onClick={handleRegisterDevice} className="w-full">
                Register Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Request Device Ownership
              </CardTitle>
              <CardDescription>
                Request ownership of a device from another user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requestDeviceId">Device ID</Label>
                <Input
                  id="requestDeviceId"
                  placeholder="Enter device ID to request"
                  value={requestDeviceId}
                  onChange={(e) => setRequestDeviceId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available devices: DEVICE_USER1_001, SIH_PROJECT_COBRA, DEV_SAMSUNG_S24
                </p>
              </div>
              <Button onClick={handleRequestOwnership} className="w-full">
                Send Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Requests waiting for your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No pending approval requests
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{request.deviceName}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {request.deviceId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Requested by: {request.toUser}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.createdAt}
                          </p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request)}
                          className="flex items-center gap-1"
                        >
                          <UserCheck className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex items-center gap-1"
                        >
                          <UserX className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
              <CardDescription>
                Your ownership transfer requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No requests made yet
                </p>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{request.deviceName}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {request.deviceId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From: {request.fromUser}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.createdAt}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'approved'
                              ? 'default'
                              : request.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              Please enter the OTP sent to your Aadhaar registered mobile number.
              For demo purposes, use: 0000
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                placeholder="Enter 4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOtpVerification} className="flex-1">
                Verify & Transfer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOtpDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceManagement;