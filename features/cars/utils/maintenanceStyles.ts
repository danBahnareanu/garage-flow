import { StyleSheet } from 'react-native';
import { MaintenanceRecord } from '@/features/cars/types/car.types';

export const maintenanceStyles = StyleSheet.create({
  maintenanceTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduledBadge: {
    backgroundColor: '#4CAF50',
  },
  unscheduledBadge: {
    backgroundColor: '#FFA500',
  },
  recallBadge: {
    backgroundColor: '#FF4444',
  },
  repairBadge: {
    backgroundColor: '#FF6B6B',
  },
  upgradeBadge: {
    backgroundColor: '#4ECDC4',
  },
  maintenanceTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export const getMaintenanceBadgeStyle = (type: MaintenanceRecord['type']) => {
  switch (type) {
    case 'scheduled':
      return maintenanceStyles.scheduledBadge;
    case 'unscheduled':
      return maintenanceStyles.unscheduledBadge;
    case 'recall':
      return maintenanceStyles.recallBadge;
    case 'repair':
      return maintenanceStyles.repairBadge;
    case 'upgrade':
      return maintenanceStyles.upgradeBadge;
    default:
      return maintenanceStyles.scheduledBadge;
  }
};
