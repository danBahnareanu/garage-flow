import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Car } from '../types/car.types';

export const isValidCar = (obj: unknown): obj is Car => {
  if (typeof obj !== 'object' || obj === null) return false;
  const car = obj as Record<string, unknown>;
  return (
    typeof car.id === 'string' &&
    typeof car.make === 'string' &&
    typeof car.model === 'string' &&
    typeof car.year === 'number' &&
    typeof car.licensePlate === 'string' &&
    typeof car.fuel === 'string'
  );
};

export const exportCarsToFile = async (cars: Car[], setIsLoading?: (loading: boolean) => void): Promise<{ success: boolean; filePath?: string; shared?: boolean }> => {
  const jsonData = JSON.stringify(cars, null, 2);
  const fileName = `garage-flow-export-${new Date().toISOString().split('T')[0]}.json`;
  const file = new File(Paths.cache, fileName);

  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(jsonData);

  const filePath = file.uri;
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    setIsLoading?.(true);
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export Car List',
    });
    setIsLoading?.(false);
    return { success: true, filePath, shared: true };
  }

  return { success: true, filePath, shared: false };
};

export const pickAndReadCarFile = async (setIsLoading?: (loading: boolean) => void): Promise<{ canceled: true } | { canceled: false; cars: Car[] }> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return { canceled: true };
  }

  setIsLoading?.(true);
  const fileUri = result.assets[0].uri;
  const importedFile = new File(fileUri);
  const fileContent = await importedFile.text();
  const importedCars: Car[] = JSON.parse(fileContent);
  setIsLoading?.(false);

  if (!Array.isArray(importedCars)) {
    throw new Error('Invalid format: expected an array of cars');
  }

  if (!importedCars.every(isValidCar)) {
    throw new Error('Invalid car data: missing required fields');
  }

  return { canceled: false, cars: importedCars };
};
