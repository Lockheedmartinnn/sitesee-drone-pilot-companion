import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useAccessControl } from '@/components/useAccessControl';

export default function UserManagement() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: permissions.canViewAllMissions,
  });

  // Pilot Group email assignments
  const pilotGroupEmails = {
    'Pilot Group 1': [
      'ichanvaleriano0@gmail.com',
      'jccdefg@gmail.com',
      'jaysondeasisdavid146@gmail.com',
      'joel.mendoza.qroi10578@gmail.com',
      'qnsi.darwinherminigildo24@gmail.com',
      'qroi.ryandorilag@gmail.com',
      'tiujohnedward@gmail.com',
      'jhonnico1323@gmail.com'
    ],
    'Pilot Group 2': [],
    'Pilot Group 3': ['simon.mapstone@fortysouth.co.nz'],
    'Pilot Group 4': [],
    'Pilot Group 5': []
  };

  // Group users by company, with pilot groups in order
  const usersByCompany = useMemo(() => {
    const groups = allUsers.reduce((acc, user) => {
      // Check which pilot group the user belongs to
      let company = user.company || 'Unknown';
      for (const [groupName, emails] of Object.entries(pilotGroupEmails)) {
        if (emails.includes(user.email)) {
          company = groupName;
          break;
        }
      }
      if (!acc[company]) acc[company] = [];
      acc[company].push(user);
      return acc;
    }, {});

    // Sort: Pilot Groups 1-5 first (in order), then alphabetically
    const sortedEntries = Object.entries(groups).sort(([companyA], [companyB]) => {
      const groupOrder = ['Pilot Group 1', 'Pilot Group 2', 'Pilot Group 3', 'Pilot Group 4', 'Pilot Group 5'];
      const indexA = groupOrder.indexOf(companyA);
      const indexB = groupOrder.indexOf(companyB);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return companyA.localeCompare(companyB);
    });

    return sortedEntries;
  }, [allUsers]);

  const getCompanyDisplayName = (company) => {
    return company;
  };

  if (!permissions.canViewAllMissions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Access denied. Admin only.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-sm text-slate-400">All registered users by company</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{allUsers.length} total users</span>
          </div>
        </div>

        {/* User Groups */}
        <div className="space-y-6">
          {usersByCompany.map(([company, users]) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/80 border-2 border-slate-600 rounded-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    {getCompanyDisplayName(company)}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                    {users.length} {users.length === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-white">{user.email}</span>
                          {user.role === 'admin' && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          {user.full_name && (
                            <>
                              <span>{user.full_name}</span>
                              <span>•</span>
                            </>
                          )}
                          {user.pilot_id && (
                            <>
                              <span>Pilot ID: {user.pilot_id}</span>
                              <span>•</span>
                            </>
                          )}
                          <span className="capitalize">{user.access_level || 'pilot'}</span>
                          <span>•</span>
                          <span>Joined {format(new Date(user.created_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}