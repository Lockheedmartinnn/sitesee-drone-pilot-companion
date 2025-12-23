import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getEmailDomain } from './rbac';

export default function CompanyAssignment({ user, onAssigned }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const queryClient = useQueryClient();
  
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.entities.Company.filter({ status: 'active' }),
  });
  
  // Auto-assign based on email domain
  useEffect(() => {
    if (user && companies.length > 0 && !selectedCompanyId) {
      const emailDomain = getEmailDomain(user.email);
      if (emailDomain) {
        const matchingCompany = companies.find(c => 
          c.email_domains && c.email_domains.includes(emailDomain)
        );
        if (matchingCompany) {
          setSelectedCompanyId(matchingCompany.company_id);
          // Auto-assign with ADMIN role for matched domain
          assignMutation.mutate({ companyId: matchingCompany.company_id, role: 'ADMIN' });
        }
      }
    }
  }, [user, companies]);
  
  const assignMutation = useMutation({
    mutationFn: async ({ companyId, role = 'PILOT' }) => {
      await base44.auth.updateMe({
        company_id: companyId,
        role: role,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      onAssigned?.();
    }
  });
  
  const handleAssign = () => {
    if (selectedCompanyId) {
      assignMutation.mutate({ companyId: selectedCompanyId, role: 'ADMIN' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 mx-auto mb-6">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Company Assignment Required</h2>
          <p className="text-slate-400 text-center mb-6">
            Select your company to continue
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium mb-1">Pending Approval</p>
                <p className="text-xs text-slate-400">
                  Your email domain couldn't be automatically matched. Please select your company or contact your administrator.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2">Company</Label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Select your company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.company_id}>
                      {company.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleAssign}
              disabled={!selectedCompanyId || assignMutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {assignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 text-center mt-6">
            If your company is not listed, please contact support
          </p>
        </div>
      </motion.div>
    </div>
  );
}