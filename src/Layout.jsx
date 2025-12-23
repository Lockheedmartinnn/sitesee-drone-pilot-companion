import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { isCompanyAssigned, hasPermission, PERMISSIONS } from '@/utils/rbac';
import CompanyAssignment from '@/components/CompanyAssignment';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  ClipboardList, 
  LogOut,
  Compass,
  BarChart3,
  MapPin,
  Settings,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ChatWidget from '@/components/ChatWidget';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home },
    { name: 'My Profile', href: createPageUrl('Profile'), icon: User },
    { name: 'Mission History', href: createPageUrl('MissionHistory'), icon: ClipboardList },
  ];
  
  const dashboards = [
    { name: 'Portfolio Overview', href: createPageUrl('PortfolioOverview'), icon: BarChart3, permission: PERMISSIONS.VIEW_COMPANY_DASHBOARDS },
    { name: 'Location Quality', href: createPageUrl('LocationQuality'), icon: MapPin, permission: PERMISSIONS.VIEW_REGIONAL_DASHBOARDS },
    { name: 'Equipment Correlation', href: createPageUrl('EquipmentCorrelation'), icon: Settings, permission: PERMISSIONS.VIEW_COMPANY_DASHBOARDS },
    { name: 'Pilot Group Trends', href: createPageUrl('PilotGroupTrends'), icon: Users, permission: PERMISSIONS.VIEW_COMPANY_DASHBOARDS },
  ].filter(item => !item.permission || hasPermission(user, item.permission));
  
  const isActive = (href) => {
    return location.pathname === href || location.pathname === href + '.html';
  };
  
  const handleLogout = async () => {
    await base44.auth.logout();
  };
  
  // Check if user needs company assignment
  if (user && !isCompanyAssigned(user)) {
    return <CompanyAssignment user={user} onAssigned={() => window.location.reload()} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
              alt="SiteSee"
              className="h-6"
            />
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-400">
                  {user.full_name?.[0] || user.email?.[0] || 'P'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex flex-col gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
                alt="SiteSee"
                className="h-8"
              />
              <div>
                <h1 className="font-bold text-white">Pilot Companion</h1>
                <p className="text-xs text-slate-400">Field Operations Guide</p>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-400">
                    {user.full_name?.[0] || user.email?.[0] || 'P'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {user.full_name || 'Pilot'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      active
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div>
              <div className="px-4 mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Dashboards
                </h3>
              </div>
              <div className="space-y-1">
                {dashboards.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                        active
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:pl-72">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
      </div>
      );
      }