/**
 * Role-Based Access Control (RBAC) utilities
 */

export const ROLES = {
  PILOT: 'PILOT',
  HEAD_PILOT: 'HEAD_PILOT',
  MANAGEMENT: 'MANAGEMENT',
  ADMIN: 'ADMIN'
};

export const PERMISSIONS = {
  // Mission permissions
  VIEW_OWN_MISSIONS: 'VIEW_OWN_MISSIONS',
  VIEW_ALL_COMPANY_MISSIONS: 'VIEW_ALL_COMPANY_MISSIONS',
  CREATE_MISSION_EVENTS: 'CREATE_MISSION_EVENTS',
  EDIT_MISSION_EVENTS: 'EDIT_MISSION_EVENTS',
  
  // Dashboard permissions
  VIEW_DASHBOARDS: 'VIEW_DASHBOARDS',
  VIEW_REGIONAL_DASHBOARDS: 'VIEW_REGIONAL_DASHBOARDS',
  VIEW_COMPANY_DASHBOARDS: 'VIEW_COMPANY_DASHBOARDS',
  
  // Data permissions
  EXPORT_DATA: 'EXPORT_DATA',
  EXPORT_AGGREGATED_DATA: 'EXPORT_AGGREGATED_DATA',
  
  // Admin permissions
  MANAGE_USERS: 'MANAGE_USERS',
  CROSS_COMPANY_ACCESS: 'CROSS_COMPANY_ACCESS',
  DATA_IMPORTS: 'DATA_IMPORTS'
};

const rolePermissions = {
  [ROLES.PILOT]: [
    PERMISSIONS.VIEW_OWN_MISSIONS,
    PERMISSIONS.CREATE_MISSION_EVENTS,
    PERMISSIONS.EDIT_MISSION_EVENTS
  ],
  [ROLES.HEAD_PILOT]: [
    PERMISSIONS.VIEW_ALL_COMPANY_MISSIONS,
    PERMISSIONS.CREATE_MISSION_EVENTS,
    PERMISSIONS.EDIT_MISSION_EVENTS,
    PERMISSIONS.VIEW_REGIONAL_DASHBOARDS
  ],
  [ROLES.MANAGEMENT]: [
    PERMISSIONS.VIEW_ALL_COMPANY_MISSIONS,
    PERMISSIONS.VIEW_COMPANY_DASHBOARDS,
    PERMISSIONS.VIEW_REGIONAL_DASHBOARDS,
    PERMISSIONS.EXPORT_AGGREGATED_DATA
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS)
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user can view a specific mission
 */
export function canViewMission(user, mission) {
  if (!user || !mission) return false;
  
  // Admin can see everything
  if (user.role === ROLES.ADMIN) return true;
  
  // Company isolation - must match company_id
  if (mission.company_id !== user.company_id) return false;
  
  // Pilot can only see assigned missions
  if (user.role === ROLES.PILOT) {
    return mission.assigned_pilot_id === user.id || 
           (user.assigned_missions && user.assigned_missions.includes(mission.mission_id));
  }
  
  // HEAD_PILOT and MANAGEMENT can see all company missions
  return true;
}

/**
 * Filter missions based on user role and permissions
 */
export function filterMissionsByRole(missions, user) {
  if (!user) return [];
  
  // Admin sees everything (cross-company if needed)
  if (user.role === ROLES.ADMIN) return missions;
  
  return missions.filter(mission => {
    // Company isolation
    if (mission.company_id !== user.company_id) return false;
    
    // Role-based filtering
    if (user.role === ROLES.PILOT) {
      return mission.assigned_pilot_id === user.id || 
             (user.assigned_missions && user.assigned_missions.includes(mission.mission_id));
    }
    
    return true;
  });
}

/**
 * Get query filter for missions based on user role
 */
export function getMissionQueryFilter(user) {
  if (!user) return null;
  
  // Admin can query everything
  if (user.role === ROLES.ADMIN) return {};
  
  // Company isolation for all non-admin roles
  const filter = { company_id: user.company_id };
  
  // Pilot can only query assigned missions
  if (user.role === ROLES.PILOT && user.assigned_missions) {
    filter.mission_id = { $in: user.assigned_missions };
  }
  
  return filter;
}

/**
 * Check if user's company is assigned
 */
export function isCompanyAssigned(user) {
  return user && user.company_id && user.company_id !== 'pending';
}

/**
 * Get email domain from email address
 */
export function getEmailDomain(email) {
  if (!email) return null;
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}