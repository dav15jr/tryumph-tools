
// types.ts
export const categoryColors = {
  'HIGH LIFE TIME (HLV)': 'bg-green-600',
  'HIGH DOLLAR (HDV)': 'bg-blue-600',
  'LOW DOLLAR (LDV)': 'bg-sky-400',
  'ZERO VALUE (ZV)': 'bg-orange-500',
} as const;

export type CategoryColor = keyof typeof categoryColors;

export interface Activity {
  id: string;
  name: string;
  category: CategoryColor;
}

export interface GroupedActivities {
  'HIGH LIFE TIME (HLV)': Activity[];
  'HIGH DOLLAR (HDV)': Activity[];
  'LOW DOLLAR (LDV)': Activity[];
  'ZERO VALUE (ZV)': Activity[];
}