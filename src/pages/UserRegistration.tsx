import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    contact: user?.profile?.contact || '',
    address: user?.profile?.address || '',
    aadharNumber: user?.profile?.aadharNumber || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.address.trim() || !formData.aadharNumber.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.aadharNumber.length !== 12) {
      toast.error('Aadhar number must be 12 digits');
      return;
    }

    // Simulate saving user profile
    toast.success('Profile updated successfully!');
    navigate('/device-management');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to register your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Registration</h1>
        <p className="text-muted-foreground">
          Complete your profile to use all device management features
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Please provide your details for account verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aadhar">Aadhar Number</Label>
            <Input
              id="aadhar"
              placeholder="Enter your 12-digit Aadhar number"
              value={formData.aadharNumber}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
              maxLength={12}
            />
          </div>
          
          <Button onClick={handleSubmit} className="w-full">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistration;