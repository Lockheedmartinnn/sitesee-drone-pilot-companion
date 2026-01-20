import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Menu, 
  X, 
  Home, 
  ClipboardList, 
  BookOpen,
  Rocket,
  GraduationCap,
  User,
  LogOut,
  ChevronRight,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ChatWidget from '@/components/ChatWidget';
import TermsAcceptance from '@/components/TermsAcceptance';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Listen for custom event to open chat
  React.useEffect(() => {
    const handleOpenChat = () => setChatOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);
  
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Check if user needs to accept terms
  React.useEffect(() => {
    if (user && !user.terms_accepted) {
      setShowTerms(true);
    }
  }, [user]);
  
  const topNavigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home },
    { name: 'Field Operations', href: createPageUrl('FieldOperationsHub'), icon: Rocket },
    { name: 'Training', href: createPageUrl('TrainingHub'), icon: GraduationCap },
    { name: 'Resources', href: createPageUrl('ToolsLinks'), icon: BookOpen },
  ];

  const bottomNavigation = [
    { name: 'My Capture Logbook', href: createPageUrl('MissionHistory'), icon: ClipboardList },
    { name: 'Checklist Analytics', href: createPageUrl('ChecklistAnalytics'), icon: BarChart3 },
    { name: 'My Profile', href: createPageUrl('Profile'), icon: User },
  ];
  
  const isActive = (href) => {
    return location.pathname === href || location.pathname === href + '.html';
  };
  
  const handleLogout = async () => {
    await base44.auth.logout();
  };
  
  // Show terms acceptance screen if needed
  if (showTerms) {
    return (
      <TermsAcceptance 
        onAccept={() => {
          setShowTerms(false);
          refetchUser();
        }} 
      />
    );
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
        "fixed top-0 left-0 z-40 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300",
        "lg:translate-x-0",
        sidebarCollapsed ? "w-20" : "w-72",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            {!sidebarCollapsed ? (
              <div className="flex flex-col gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
                  alt="SiteSee"
                  className="h-8"
                />
                <div>
                  <h1 className="font-bold text-white">SiteSee</h1>
                  <p className="text-xs text-slate-400">Pilot Companion</p>
                </div>
              </div>
            ) : (
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
                alt="SiteSee"
                className="h-8 mx-auto"
              />
            )}
          </div>
          
          {/* Top Navigation */}
          <nav className="p-4 space-y-1 border-b border-slate-800">
            <div className={cn("text-xs font-bold uppercase tracking-wider mb-3", sidebarCollapsed ? "text-center" : "px-3", "text-slate-500")}>
              {!sidebarCollapsed && 'Navigation'}
            </div>
            {topNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                  {!sidebarCollapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                </Link>
              );
            })}
          </nav>

          {/* Middle Section - Dynamic Tiles */}
          <div className="flex-1 overflow-y-auto p-4">
            {!sidebarCollapsed && (
              <>
                <div className="text-xs font-bold uppercase tracking-wider px-3 mb-3 text-slate-500">
                  Quick Access
                </div>
                <div className="text-sm text-slate-500 px-3">
                  Select a section from above to see quick links here.
                </div>
              </>
            )}
          </div>

          {/* Bottom Navigation */}
          <nav className="p-4 space-y-1 border-t border-slate-800">
            {bottomNavigation.map((item) => {
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
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            {!sidebarCollapsed && user && (
              <div className="text-center">
                <p className="text-sm text-white font-medium">{user.full_name || 'User'}</p>
                <p className="text-xs text-slate-500">{user.access_level || 'pilot'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => base44.auth.logout()}
              className={cn(
                "w-full text-slate-400 hover:text-white hover:bg-slate-800",
                sidebarCollapsed ? "justify-center px-2" : "justify-start"
              )}
              title={sidebarCollapsed ? "Logout" : ''}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageSquare className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
      );
      }