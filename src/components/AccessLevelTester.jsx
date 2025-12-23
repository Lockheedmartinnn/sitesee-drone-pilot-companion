import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ACCESS_LEVELS = [
  { value: 'pilot', label: 'Pilot', color: 'text-blue-400' },
  { value: 'head_pilot', label: 'Head Pilot', color: 'text-purple-400' },
  { value: 'manager', label: 'Manager', color: 'text-amber-400' },
  { value: 'admin', label: 'Admin', color: 'text-red-400' }
];

const COMPANIES = [
  { value: 'wavecon', label: 'Wavecon' },
  { value: 'sitesee', label: 'SiteSee' },
  { value: 'techops', label: 'TechOps' },
  { value: 'globalsite', label: 'GlobalSite' }
];

export default function AccessLevelTester({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testLevel, setTestLevel] = useState(null);
  const [testCompany, setTestCompany] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('test_access_level');
    const storedCompany = localStorage.getItem('test_company');
    if (stored) setTestLevel(stored);
    if (storedCompany) setTestCompany(storedCompany);
  }, []);

  const handleLevelChange = (level) => {
    setTestLevel(level);
    localStorage.setItem('test_access_level', level);
    window.location.reload();
  };

  const handleCompanyChange = (company) => {
    setTestCompany(company);
    localStorage.setItem('test_company', company);
    window.location.reload();
  };

  const clearTest = () => {
    setTestLevel(null);
    setTestCompany(null);
    localStorage.removeItem('test_access_level');
    localStorage.removeItem('test_company');
    window.location.reload();
  };

  const currentLevel = ACCESS_LEVELS.find(l => l.value === (testLevel || user?.access_level || 'pilot'));
  const isTestMode = testLevel || testCompany;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-4 w-72"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">Access Level Tester</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="h-6 w-6">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Test Access Level</label>
                <Select value={testLevel || user?.access_level || 'pilot'} onValueChange={handleLevelChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Test Company</label>
                <Select value={testCompany || user?.company || 'wavecon'} onValueChange={handleCompanyChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANIES.map(company => (
                      <SelectItem key={company.value} value={company.value}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isTestMode && (
                <Button onClick={clearTest} variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <X className="w-4 h-4 mr-2" />
                  Clear Test Mode
                </Button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Real: {user?.access_level || 'pilot'} @ {user?.company || 'unknown'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg transition-all",
          isTestMode
            ? "bg-amber-500/20 border-2 border-amber-500/50 text-amber-400"
            : "bg-slate-800 border border-slate-700 text-slate-300"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Shield className="w-4 h-4" />
        <div className="flex flex-col items-start">
          <span className={cn("text-xs font-semibold", currentLevel.color)}>
            {currentLevel.label}
          </span>
          {isTestMode && (
            <span className="text-[10px] text-amber-400">Test Mode</span>
          )}
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}