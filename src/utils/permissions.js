import { hasPermission } from './roleUtils';

export const canAccessAdmin = (role) => hasPermission(role, 'accessAdmin');
export const canManageUsers = (role) => hasPermission(role, 'manageUsers');
export const canDeletePosts = (role) => hasPermission(role, 'deletePosts');
export const canManageAds = (role) => hasPermission(role, 'manageAds');
export const canModerate = (role) => hasPermission(role, 'moderate');
export const canViewAnalytics = (role) => hasPermission(role, 'viewAnalytics');
