import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CreditCard, Users, Calendar, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Billing() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ['company', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) {
        // Return dummy data for demo
        return {
          company_name: 'Demo Company Inc.',
          pilot_group: 'demo_group',
          subscription_status: 'trial',
          subscription_tier: 'pro',
          base_price: 29,
          price_per_pilot: 10,
          included_pilots: 2,
          billing_email: user?.email || 'billing@demo.com',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      const companies = await base44.entities.Company.filter({ id: user.company_id });
      return companies[0] || null;
    },
    enabled: !!user,
  });

  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['companyUsers', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) {
        // Return dummy users for demo
        return [
          { id: '1', full_name: 'John Pilot', email: 'john@demo.com', access_level: 'pilot', is_active: true },
          { id: '2', full_name: 'Sarah Manager', email: 'sarah@demo.com', access_level: 'manager', is_active: true },
          { id: '3', full_name: 'Mike Head Pilot', email: 'mike@demo.com', access_level: 'head_pilot', is_active: true },
          { id: '4', full_name: 'Lisa Drone Operator', email: 'lisa@demo.com', access_level: 'pilot', is_active: true }
        ];
      }
      return await base44.entities.User.filter({ company_id: user.company_id });
    },
    enabled: !!user,
  });

  const activeUsers = useMemo(() => {
    return allUsers.filter(u => u.is_active !== false);
  }, [allUsers]);

  const monthlyTotal = useMemo(() => {
    if (!company) return 0;
    const basePrice = company.base_price || 29;
    const includedPilots = company.included_pilots || 2;
    const pricePerPilot = company.price_per_pilot || 10;
    const activePilots = activeUsers.length;
    
    const additionalPilots = Math.max(0, activePilots - includedPilots);
    return basePrice + (additionalPilots * pricePerPilot);
  }, [company, activeUsers]);

  const handleUpgrade = () => {
    // This would trigger Stripe checkout - requires backend function
    alert('Backend functions need to be enabled to process Stripe payments. Enable them in app settings.');
  };

  const handleManageBilling = () => {
    // This would open Stripe customer portal - requires backend function
    alert('Backend functions need to be enabled for billing portal access. Enable them in app settings.');
  };

  if (loadingUser || loadingCompany || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-5 py-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Company Found</h2>
            <p className="text-slate-400">Your account is not linked to a company. Contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.access_level === 'admin' || user?.access_level === 'manager';
  const isTrial = company.subscription_status === 'trial';
  const isActive = company.subscription_status === 'active';
  const isPastDue = company.subscription_status === 'past_due';

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-5 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-slate-400 mt-1">{company.company_name}</p>
        </motion.div>

        {!isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-300">
              Only company admins and managers can manage billing and subscriptions.
            </p>
          </motion.div>
        )}

        {/* Subscription Status Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Subscription Status
                </CardTitle>
                {isTrial && (
                  <Badge className="bg-amber-500/20 text-amber-400">Trial</Badge>
                )}
                {isActive && (
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                )}
                {isPastDue && (
                  <Badge className="bg-red-500/20 text-red-400">Past Due</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                  <p className="text-2xl font-bold capitalize">{company.subscription_tier}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Monthly Total</p>
                  <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    ${company.base_price} base + {Math.max(0, activeUsers.length - company.included_pilots)} additional pilots × ${company.price_per_pilot}
                  </p>
                </div>
              </div>

              {company.current_period_end && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isTrial ? 'Trial ends' : 'Next billing date'}: {format(new Date(company.current_period_end), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleUpgrade} className="bg-blue-500 hover:bg-blue-600">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  <Button onClick={handleManageBilling} variant="outline">
                    Manage Billing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Users Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Active Users ({activeUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Included pilots:</span>
                  <span className="font-semibold">{company.included_pilots}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-400">Additional pilots:</span>
                  <span className="font-semibold text-blue-400">
                    {Math.max(0, activeUsers.length - company.included_pilots)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {activeUsers.slice(0, 10).map((u, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-400">
                          {u.full_name?.[0] || u.email?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.full_name || 'Unnamed User'}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {u.access_level || 'pilot'}
                    </Badge>
                  </div>
                ))}
              </div>

              {activeUsers.length > 10 && (
                <p className="text-sm text-slate-500 text-center mt-4">
                  + {activeUsers.length - 10} more users
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-300 mb-1">Backend Functions Required</p>
                <p className="text-xs text-blue-400">
                  To enable full Stripe integration (checkout, webhooks, billing portal), enable backend functions in your app settings.
                  This allows secure handling of Stripe API keys and webhook events.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}