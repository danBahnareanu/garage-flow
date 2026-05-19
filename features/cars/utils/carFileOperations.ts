import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import template from '../../../assets/import-template/garage-flow-export-template.json';
import { Car } from '../types/car.types';
import { CategoryItem, MaintTypeItem } from '../types/taxonomy.types';

interface CarExportEnvelope {
  version: 2;
  categories: CategoryItem[];
  maintTypes: MaintTypeItem[];
  cars: Car[];
}

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

export const exportCarsToFile = async (cars: Car[], categories: CategoryItem[], maintTypes: MaintTypeItem[], setIsLoading?: (loading: boolean) => void): Promise<{ success: boolean; filePath?: string; shared?: boolean }> => {
  let jsonData: string;
  const fileName = `garage-flow-export-${new Date().toISOString().split('T')[0]}`;

  if (cars.length === 0) {
    jsonData = JSON.stringify(template, null, 2);
  } else {
    const envelope: CarExportEnvelope = { version: 2, categories, maintTypes, cars };
    jsonData = JSON.stringify(envelope, null, 2);
  }

  if (Platform.OS === 'android') {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return { success: false };
    }

    setIsLoading?.(true);
    const fileUri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      fileName,
      'application/json',
    );
    await StorageAccessFramework.writeAsStringAsync(fileUri, jsonData);
    setIsLoading?.(false);

    return { success: true, filePath: fileUri, shared: false };
  }

  // iOS: write to cache and share
  const file = new File(Paths.cache, `${fileName}.json`);
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

export const pickAndReadCarFile = async (setIsLoading?: (loading: boolean) => void): Promise<{ canceled: true } | { canceled: false; cars: Car[]; categories: CategoryItem[]; maintTypes: MaintTypeItem[] }> => {
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
  setIsLoading?.(false);

  const raw: unknown = JSON.parse(fileContent);
  let rawCars: unknown[];
  let importedCategories: CategoryItem[] = [];
  let importedMaintTypes: MaintTypeItem[] = [];

  if (Array.isArray(raw)) {
    rawCars = raw;
  } else if (
    raw !== null &&
    typeof raw === 'object' &&
    (raw as CarExportEnvelope).version === 2 &&
    Array.isArray((raw as CarExportEnvelope).cars) &&
    Array.isArray((raw as CarExportEnvelope).categories)
  ) {
    rawCars = (raw as CarExportEnvelope).cars;
    importedCategories = (raw as CarExportEnvelope).categories;
    importedMaintTypes = (raw as CarExportEnvelope).maintTypes ?? [];
  } else {
    throw new Error('Invalid format: unrecognized file structure');
  }

  if (!rawCars.every(isValidCar)) {
    throw new Error('Invalid car data: missing required fields');
  }

  return { canceled: false, cars: rawCars as Car[], categories: importedCategories, maintTypes: importedMaintTypes };
};
