import { useState } from 'react';
import { Alert } from 'react-native';
import useCarStore from '../store/carList.store';
import { exportCarsToFile, pickAndReadCarFile } from '../utils/carFileOperations';

export const useCarImportExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cars, clearCars, addCar } = useCarStore();

  const handleExport = async () => {
    try {

      const result = await exportCarsToFile(cars, setIsLoading);
      cars.length === 0 && result.success && Alert.alert('Exported Template', `No cars to export, but a template file has been created for you to fill in and import.`);
      
      if (result.success && !result.shared) {
        Alert.alert('Export Complete', `File saved to: ${result.filePath}`);
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

      const importedCars = result.cars;

      Alert.alert(
        'Import Car List',
        `Found ${importedCars.length} car(s). How would you like to import?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace All',
            style: 'destructive',
            onPress: () => {
              clearCars();
              importedCars.forEach((car) => addCar(car));
              Alert.alert('Success', `Imported ${importedCars.length} car(s).`);
            },
          },
          {
            text: 'Merge',
            onPress: () => {
              const existingIds = new Set(cars.map((c) => c.id));
              let addedCount = 0;
              importedCars.forEach((car) => {
                if (!existingIds.has(car.id)) {
                  addCar(car);
                  addedCount++;
                }
              });
              Alert.alert('Success', `Added ${addedCount} new car(s).`);
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
