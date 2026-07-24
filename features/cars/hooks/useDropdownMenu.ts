import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import useCarStore from '../store/carList.store';
import useSettingsStore from '../store/settings.store';
import { Car } from '../types/car.types';
import { cancelScheduledNotifications, rescheduleAllNotifications } from '../utils/notificationService';
import { useCarImportExport } from './useCarImportExport';

export const useDropdownMenu = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [notificationSettingsVisible, setNotificationSettingsVisible] = useState(false);
  const reminderDaysSnapshot = useRef<number[]>([]);
  const { isLoading, handleExport, handleImport } = useCarImportExport();
  const cars = useCarStore(state => state.cars);
  const removeCar = useCarStore(state => state.removeCar);
  const updateInsuranceRecord = useCarStore(state => state.updateInsuranceRecord);
  const updateInspectionRecord = useCarStore(state => state.updateInspectionRecord);
  const updateVignetteRecord = useCarStore(state => state.updateVignetteRecord);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const openNotificationSettings = () => {
    reminderDaysSnapshot.current = useSettingsStore.getState().enabledReminderDays;
    close();
    setNotificationSettingsVisible(true);
  };

  const closeNotificationSettings = async () => {
    setNotificationSettingsVisible(false);
    const current = useSettingsStore.getState().enabledReminderDays;
    const before = reminderDaysSnapshot.current;
    const changed =
      current.length !== before.length || current.some((d) => !before.includes(d));
    if (changed) {
      await rescheduleAllNotifications(
        useCarStore.getState().cars,
        updateInsuranceRecord,
        updateInspectionRecord,
        updateVignetteRecord,
      );
    }
  };

  const handleDeleteCar = (car: Car) => {
    const carListLength = cars.length;
    Alert.alert('Delete Car', `Remove ${car.make} ${car.model}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const allIds = [
            ...(car.insuranceHistory ?? []),
            ...(car.inspectionHistory ?? []),
          ].flatMap(r => r.notificationIds ?? []);
          if (allIds.length > 0) {
            await cancelScheduledNotifications(allIds);
          }
          removeCar(car.id);
          if (carListLength === 1) {
            close();
          }
        },
      },
    ]);
  };

  const handleAddNewCar = () => {
    close();
    router.push('/cars/add');
  };

  const handleExportCarList = async () => {
    await handleExport();
    close();
  };

  const handleImportCarList = async () => {
    await handleImport();
    close();
  };

  return {
    visible,
    open,
    close,
    isLoading,
    cars,
    handleDeleteCar,
    handleAddNewCar,
    handleExportCarList,
    handleImportCarList,
    notificationSettingsVisible,
    openNotificationSettings,
    closeNotificationSettings,
  };
};
