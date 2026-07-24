import { useState } from 'react';
import { Alert } from 'react-native';
import useCarStore from '../store/carList.store';
import { Car } from '../types/car.types';
import { exportCarsToFile, pickAndReadCarFile } from '../utils/carFileOperations';
import { requestPermissions, rescheduleAllNotifications } from '../utils/notificationService';

const scheduleNotificationsForImportedCars = async (importedCars: Car[]) => {
  if (importedCars.length === 0) return;

  const granted = await requestPermissions();
  if (!granted) return;

  const { updateInsuranceRecord, updateInspectionRecord, updateVignetteRecord } =
    useCarStore.getState();
  await rescheduleAllNotifications(
    importedCars,
    updateInsuranceRecord,
    updateInspectionRecord,
    updateVignetteRecord,
  );
};

export const useCarImportExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cars, categories, maintTypes, clearCars, addCar, addCategory, addMaintType } = useCarStore();

  const handleExport = async () => {
    try {

      const result = await exportCarsToFile(cars, categories, maintTypes, setIsLoading);

      if (!result.success) {
        return;
      }

      if (cars.length === 0) {
        Alert.alert('Exported Template', 'No cars to export, but a template file has been created for you to fill in and import.');
      } else if (!result.shared) {
        Alert.alert('Export Complete', 'File saved successfully.');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export car list. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleImport = async () => {
    try {
      const result = await pickAndReadCarFile(setIsLoading);

      if (result.canceled) {
        return;
      }

      const { cars: importedCars, categories: importedCategories, maintTypes: importedMaintTypes } = result;

      // Add any imported taxonomy not already in store (store skips duplicates by name)
      importedCategories.forEach((cat) => addCategory(cat));
      importedMaintTypes.forEach((t) => addMaintType(t));

      Alert.alert(
        'Import Car List',
        `Found ${importedCars.length} car(s). How would you like to import?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace All',
            style: 'destructive',
            onPress: async () => {
              clearCars();
              importedCars.forEach((car) => addCar(car));
              await scheduleNotificationsForImportedCars(importedCars);
              Alert.alert('Success', `Imported ${importedCars.length} car(s).`);
            },
          },
          {
            text: 'Merge',
            onPress: async () => {
              const existingIds = new Set(cars.map((c) => c.id));
              const addedCars: Car[] = [];
              importedCars.forEach((car) => {
                if (!existingIds.has(car.id)) {
                  addCar(car);
                  addedCars.push(car);
                }
              });
              await scheduleNotificationsForImportedCars(addedCars);
              Alert.alert('Success', `Added ${addedCars.length} new car(s).`);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Import Failed', 'Could not import car list. Make sure the file is valid JSON.');
      console.error('Import error:', error);
    }
  };

  return {
    isLoading,
    setIsLoading,
    handleExport,
    handleImport,
  };
};
