import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import useCarStore from '../store/carList.store';
import { Car } from '../types/car.types';
import { cancelScheduledNotifications } from '../utils/notificationService';
import { useCarImportExport } from './useCarImportExport';

export const useDropdownMenu = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { isLoading, handleExport, handleImport } = useCarImportExport();
  const cars = useCarStore(state => state.cars);
  const removeCar = useCarStore(state => state.removeCar);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleDeleteCar = (car: Car) => {
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
          close();
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
  };
};
