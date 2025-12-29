export interface Category {
  min: number;
  max: number;
  label: string;
}

export const boundaries = [
  0, 5, 15, 25, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82,
  85, 92, 100,
];

export const categories: Category[] = [
  { min: 100, max: 100, label: 'Aurum Standard' },
  { min: 82, max: 92, label: 'Upper First' },
  { min: 72, max: 78, label: 'First' },
  { min: 62, max: 68, label: '2:1' },
  { min: 52, max: 58, label: '2:2' },
  { min: 42, max: 48, label: 'Third' },
  { min: 32, max: 38, label: 'Condonable Fail' },
  { min: 5, max: 25, label: 'Fail' },
  { min: 0, max: 5, label: 'Defecit Opus' },
];
