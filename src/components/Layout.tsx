import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wifi, Shield, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">FindMyNet</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  size="sm"
                >
                  Home
                </Button>
              </Link>
              <Link to="/report-lost">
                <Button 
                  variant={isActive("/report-lost") ? "default" : "ghost"}
                  size="sm"
                >
                  Report Lost
                </Button>
              </Link>
              <Link to="/find-my">
                <Button 
                  variant={isActive("/find-my") ? "default" : "ghost"}
                  size="sm"
                >
                  Find My Device
                </Button>
              </Link>
              <Link to="/report-found">
                <Button 
                  variant={isActive("/report-found") ? "default" : "ghost"}
                  size="sm"
                >
                  Report Found
                </Button>
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Welcome, {user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <LoginDialog />
              )}
            </div>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-foreground">FindMyNet</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Community-driven device tracking network. Secure, anonymous, and reliable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Anonymous tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4" />
                  <span>Community network</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team for assistance with your devices.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 FindMyNet. All rights reserved. Privacy-first device tracking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;