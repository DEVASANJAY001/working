import { ROLES } from '../constants/roles';

const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    accessAdmin: true,
    manageUsers: true,
    deletePosts: true,
    manageAds: true,
    moderate: true,
    viewAnalytics: true,
  },
  [ROLES.ADMIN]: {
    accessAdmin: true,
    manageUsers: true,
    deletePosts: true,
    manageAds: true,
    moderate: true,
    viewAnalytics: true,
  },
  [ROLES.USER]: {
    accessAdmin: false,
    manageUsers: false,
    deletePosts: false,
    manageAds: false,
    moderate: false,
    viewAnalytics: false,
  },
};

export function hasPermission(role, permission) {
  if (!role) return false;
  return !!PERMISSIONS[role]?.[permission];
}
