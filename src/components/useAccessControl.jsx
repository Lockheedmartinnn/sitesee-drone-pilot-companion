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
    
    const effectiveLevel = testLevel || user?.access_level || 'pilot';
    const effectiveCompany = testCompany || user?.company || extractCompanyFromEmail(user?.email);
    
    const permissions = {
      // View permissions
      canViewOwnMissions: true,
      canViewTeamMissions: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewCompanyMissions: ['manager', 'admin'].includes(effectiveLevel),
      canViewAllMissions: effectiveLevel === 'admin',
      
      // Dashboard permissions - Head Pilot can see dashboards but only their group data
      canViewDashboards: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewPortfolio: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canViewAnalytics: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      
      // Management permissions
      canManageTeam: ['head_pilot', 'manager', 'admin'].includes(effectiveLevel),
      canManageCompany: ['manager', 'admin'].includes(effectiveLevel),
      canManageSystem: effectiveLevel === 'admin',
      
      // Data access
      level: effectiveLevel,
      company: effectiveCompany,
      isTestMode: !!(testLevel || testCompany)
    };
    
    return permissions;
  }, [user]);
}

function extractCompanyFromEmail(email) {
  if (!email) return null;
  const match = email.match(/@(.+)\./);
  return match ? match[1] : null;
}

export function filterMissionsByAccess(missions, permissions, userEmail) {
  if (permissions.canViewAllMissions) {
    return missions;
  }
  
  if (permissions.canViewCompanyMissions) {
    // Manager: see all missions from their company
    return missions.filter(m => m.company === permissions.company);
  }
  
  if (permissions.canViewTeamMissions) {
    // Head Pilot: see missions from their pilot group
    return missions.filter(m => m.pilot_group === permissions.company);
  }
  
  // Pilot: only own missions
  return missions.filter(m => m.created_by === userEmail);
}