import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Menu, 
  X, 
  Home, 
  ClipboardList, 
  BookOpen,
  PlayCircle,
  Map,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ChatWidget from '@/components/ChatWidget';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home },
    { name: 'My Captures', href: createPageUrl('MissionHistory'), icon: ClipboardList },
    { name: 'Quick Reference', href: createPageUrl('QuickReference'), icon: BookOpen },
    { name: 'Training Videos', href: createPageUrl('TrainingVideos'), icon: PlayCircle },
    { name: 'Scenarios', href: createPageUrl('Scenarios'), icon: Map },
    { name: 'Tools & Links', href: createPageUrl('ToolsLinks'), icon: ExternalLink },
  ];
  
  const isActive = (href) => {
    return location.pathname === href || location.pathname === href + '.html';
  };
  
  const handleLogout = async () => {
    await base44.auth.logout();
  };
  
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
          

          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
          </nav>

          {/* Info Footer */}
          <div className="p-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              Personal training companion<br />
              All data stored locally on your device
            </p>
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