export const gardenViewRoutePaths = {
  viewByGrantId: (grantId: string): string => `/view/${encodeURIComponent(grantId)}`,
} as const;
