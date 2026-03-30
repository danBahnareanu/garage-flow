import { Ionicons } from '@expo/vector-icons';

export type TabType = 'insurance' | 'inspection' | 'roadTax' | 'costs' | 'maintenance';

export interface TabConfig {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const TABS: TabConfig[] = [
  { key: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { key: 'inspection', label: 'Inspections', icon: 'checkmark-done-circle' },
  { key: 'roadTax', label: 'Road Tax', icon: 'receipt' },
  { key: 'costs', label: 'Costs', icon: 'cash' },
  { key: 'maintenance', label: 'Maintenance', icon: 'build' },
];

export const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);
