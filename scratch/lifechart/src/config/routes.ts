export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TIMELINE: '/timeline',
  UPLOAD: '/upload',
  DOCTOR_SUMMARY: '/doctor-summary',
  SHARE_ACCESS: '/share',
  FAMILY: '/family',
  EMERGENCY_CARD: '/emergency',
  REMINDERS: '/reminders',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
