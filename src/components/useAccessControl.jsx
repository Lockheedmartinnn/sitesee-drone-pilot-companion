import { useMemo } from 'react';

export function useAccessControl(user) {
  return useMemo(() => {
    if (!user) {
      return {
        canViewOwnMissions: true,
        canViewTeamMissions: false,
        canViewAllMissions: false,
        level: 'pilot',
        company: null,
        pilotId: null
      };
    }
    
    const level = user?.access_level || 'pilot';
    
    return {
      canViewOwnMissions: true,
      canViewTeamMissions: ['ops_manager', 'admin'].includes(level),
      canViewAllMissions: level === 'admin',
      level: level,
      company: user?.company,
      pilotId: user?.pilot_id
    };
  }, [user]);
}

export function filterMissionsByAccess(missions, permissions, userEmail, user) {
  if (permissions.canViewAllMissions) {
    return missions;
  }
  
  if (permissions.canViewTeamMissions) {
    // Manager: see all missions from their company
    return missions.filter(m => m.company === permissions.company);
  }
  
  // Pilot: show all captures created by this user (based on email)
  return missions.filter(m => m.created_by === userEmail);
}