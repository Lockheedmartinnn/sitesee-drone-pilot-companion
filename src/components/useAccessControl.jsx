import { useMemo } from 'react';

export function useAccessControl(user) {
  return useMemo(() => {
    if (!user) {
      return {
        canViewOwnMissions: true,
        canViewTeamMissions: false,
        canViewCompanyMissions: false,
        canViewAllMissions: false,
        canViewPortfolio: false,
        canViewAnalytics: false,
        canManageTeam: false,
        canManageCompany: false,
        canManageSystem: false,
        level: 'pilot',
        company: null,
        isTestMode: false
      };
    }
    
    // Check for test mode
    const testLevel = typeof window !== 'undefined' ? localStorage.getItem('test_access_level') : null;
    const testCompany = typeof window !== 'undefined' ? localStorage.getItem('test_company') : null;
    const testPilotId = typeof window !== 'undefined' ? localStorage.getItem('test_pilot_id') : null;
    
    const effectiveLevel = testLevel || user?.access_level || 'pilot';
    const effectiveCompany = testCompany || user?.company || extractCompanyFromEmail(user?.email);
    const effectivePilotId = testPilotId || user?.pilot_id;
    
    const permissions = {
      // View permissions
      canViewOwnMissions: true,
      canViewTeamMissions: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewCompanyMissions: ['manager', 'admin'].includes(effectiveLevel),
      canViewAllMissions: effectiveLevel === 'admin',
      
      // Dashboard permissions - Head Pilot has same dashboard access as Manager
      canViewDashboards: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewPortfolio: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewAnalytics: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewLocationQuality: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewEquipmentCorrelation: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewPilotGroupTrends: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      
      // Management permissions
      canManageTeam: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canManageCompany: ['manager', 'admin'].includes(effectiveLevel),
      canManageSystem: effectiveLevel === 'admin',
      
      // Data access
      level: effectiveLevel,
      company: effectiveCompany,
      pilotId: effectivePilotId,
      isTestMode: !!(testLevel || testCompany || testPilotId)
    };
    
    return permissions;
  }, [user]);
}

function extractCompanyFromEmail(email) {
  if (!email) return null;
  const match = email.match(/@(.+)\./);
  return match ? match[1] : null;
}

export function filterMissionsByAccess(missions, permissions, userEmail, user) {
  if (permissions.canViewAllMissions) {
    return missions;
  }
  
  if (permissions.canViewCompanyMissions) {
    // Manager: see all missions from their company
    return missions.filter(m => m.company === permissions.company);
  }
  
  if (permissions.canViewTeamMissions) {
    // Head Pilot: see all missions from their pilot group
    return missions.filter(m => m.pilot_group === permissions.company);
  }
  
  // Pilot: only missions where they are the pilot (by pilot_id)
  const pilotId = typeof window !== 'undefined' ? localStorage.getItem('test_pilot_id') : null;
  const effectivePilotId = pilotId || user?.pilot_id;
  return missions.filter(m => m.pilot_id === effectivePilotId);
}