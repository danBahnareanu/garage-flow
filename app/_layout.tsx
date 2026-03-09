import { DropdownMenu, MenuButton } from '@/features/cars/components/DropdownMenu';
import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

const isValidCar = (obj: unknown): obj is Car => {
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

export default function Layout() {
  const router = useRouter()
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { cars, clearCars, addCar } = useCarStore();

  const handleAddNewCar = () => {
    setVisible(false);
    router.push('/cars/add');
  };

  const handleExportCarList = async () => {
    try {
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
        setIsLoading(true);
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export Car List',
        });
      } else {
        Alert.alert('Export Complete', `File saved to: ${filePath}`);
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export car list. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsLoading(false);
      setVisible(false);
    }
  };

  const handleImportCarList = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setIsLoading(true);
      const fileUri = result.assets[0].uri;
      const importedFile = new File(fileUri);
      const fileContent = await importedFile.text();

      const importedCars: Car[] = JSON.parse(fileContent);

      if (!Array.isArray(importedCars)) {
        throw new Error('Invalid format: expected an array of cars');
      }

      if (!importedCars.every(isValidCar)) {
        throw new Error('Invalid car data: missing required fields');
      }

      setIsLoading(false);
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
      setIsLoading(false);
      Alert.alert('Import Failed', 'Could not import car list. Make sure the file is valid JSON.');
      console.error('Import error:', error);
    } finally {      
      setVisible(false);
    }
  };

  return (
    <>
      <Stack screenOptions={{
          headerStyle: {
            backgroundColor: '#1C1643',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'My Garage',
            headerRight: () => (
              <MenuButton onPress={() => setVisible(true)} />
            ),
          }}
        />
        <Stack.Screen name="cars/add" options={{ title: 'Add a Car' }} />
        <Stack.Screen name="cars/[id]" options={{ title: 'Car Details' }} />
        <Stack.Screen name="cars/edit/[id]" options={{ title: 'Edit Car Details' }} />
        <Stack.Screen name="cars/running-costs/[id]" options={{ title: 'Running Costs' }} />
      </Stack>

      <DropdownMenu
        visible={visible}
        onClose={() => setVisible(false)}
        onAddNewCar={handleAddNewCar}
        onExportCarList={handleExportCarList}
        onImportCarList={handleImportCarList}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7142CD" />
        </View>
      )}
    </>
  )
};

const styles = StyleSheet.create({
  triggerStyle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});