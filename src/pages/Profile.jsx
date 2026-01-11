import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Loader2,
  CheckCircle2,
  Shield,
  BookOpen,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InfoCard from '@/components/InfoCard';
import { cn } from '@/lib/utils';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
    <div className="flex items-center gap-3 mb-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const userData = await base44.auth.me();
      setFullName(userData.full_name || '');
      return userData;
    },
  });
  
  const { data: missionLogs = [] } = useQuery({
    queryKey: ['userMissionLogs'],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.MissionLog.filter(
        { created_by: user.email },
        '-created_date'
      );
    },
    enabled: !!user,
  });

  const { data: localCaptures = [] } = useQuery({
    queryKey: ['localCaptures'],
    queryFn: () => base44.entities.LocalMissionLog.list('-created_date'),
    initialData: [],
  });

  const { data: quizAttempts = [] } = useQuery({
    queryKey: ['allQuizAttempts'],
    queryFn: () => base44.entities.QuizAttempt.list('-completed_at'),
    initialData: [],
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });
  
  const handleSave = () => {
    updateProfileMutation.mutate({ full_name: fullName });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  const totalMissions = missionLogs.length;
  const successfulMissions = missionLogs.filter(log => log.outcome === 'success').length;
  const issuesFlagged = missionLogs.filter(log => log.outcome === 'issue_flagged').length;
  
  const userLocalCaptures = localCaptures.filter(c => c.created_by === user?.email);
  const userQuizAttempts = quizAttempts.filter(q => q.created_by === user?.email);
  const passedQuizzes = userQuizAttempts.filter(q => q.passed).length;
  
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account and view your activity</p>
        </motion.div>
        
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden mb-6"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-8 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-400">
                  {user?.full_name?.[0] || user?.email?.[0] || 'P'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user?.full_name || 'Pilot'}</h2>
                <p className="text-slate-400">{user?.email}</p>
                {user?.role === 'admin' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Admin
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Personal Information
                </h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-slate-400">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-900/50 border-slate-700"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{user?.full_name || 'Not set'}</span>
                  </div>
                )}
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-slate-400">Email</Label>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{user?.email}</span>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="space-y-2">
                <Label className="text-slate-400">Member Since</Label>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{new Date(user?.created_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              
              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user?.full_name || '');
                    }}
                    className="flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Admin Access Button */}
              {user?.role === 'admin' && !isEditing && (
                <div className="pt-4 border-t border-slate-700">
                  <Button
                    onClick={async () => {
                      await base44.auth.updateMe({ access_level: 'admin' });
                      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Enable Admin Access Level
                  </Button>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Click to set your access_level to admin and view all checklists
                  </p>
                </div>
              )}
              
              {/* Success Message */}
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <InfoCard variant="success">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile updated successfully</span>
                    </div>
                  </InfoCard>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Mission Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Calendar}
              label="Total Missions Logged"
              value={totalMissions}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              icon={CheckCircle2}
              label="Successful Completions"
              value={successfulMissions}
              color="bg-emerald-500/20 text-emerald-400"
            />
            <StatCard
              icon={User}
              label="Issues Reported"
              value={issuesFlagged}
              color="bg-amber-500/20 text-amber-400"
            />
          </div>
        </motion.div>

        {/* Training Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Training Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={CheckCircle2}
              label="Captures Completed"
              value={userLocalCaptures.length}
              color="bg-purple-500/20 text-purple-400"
            />
            <StatCard
              icon={BookOpen}
              label="Quiz Attempts"
              value={userQuizAttempts.length}
              color="bg-cyan-500/20 text-cyan-400"
            />
            <StatCard
              icon={Award}
              label="Quizzes Passed"
              value={passedQuizzes}
              color="bg-emerald-500/20 text-emerald-400"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}