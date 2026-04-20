import { DropdownMenu, MenuButton } from '@/features/cars/components/DropdownMenu';
import { useDropdownMenu } from '@/features/cars/hooks/useDropdownMenu';
import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Layout() {
  const {
    visible,
    open,
    close,
    isLoading,
    cars,
    handleDeleteCar,
    handleAddNewCar,
    handleExportCarList,
    handleImportCarList,
  } = useDropdownMenu();

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
              <MenuButton onPress={open} />
            ),
          }}
        />
        <Stack.Screen name="cars/add" options={{ title: 'Add a Car' }} />
        <Stack.Screen name="cars/[id]" options={{ title: 'Car Details' }} />
        <Stack.Screen name="cars/edit/[id]" options={{ title: 'Edit Car Details' }} />
        <Stack.Screen name="cars/edit-insurance/[id]" options={{ title: 'Insurance' }} />
        <Stack.Screen name="cars/edit-inspection/[id]" options={{ title: 'Inspections' }} />
        <Stack.Screen name="cars/edit-road-tax/[id]" options={{ title: 'Road Tax' }} />
        <Stack.Screen name="cars/edit-maintenance/[id]" options={{ title: 'Maintenance' }} />
        <Stack.Screen name="cars/running-costs/[id]" options={{ title: 'Running Costs' }} />
        <Stack.Screen name="cars/maintenance-history/[id]" options={{ title: 'Maintenance History' }} />
        <Stack.Screen name="cars/pdf-viewer" options={{ title: 'Insurance Document' }} />
      </Stack>

      <DropdownMenu
        visible={visible}
        onClose={close}
        onAddNewCar={handleAddNewCar}
        onExportCarList={handleExportCarList}
        onImportCarList={handleImportCarList}
        cars={cars}
        onDeleteCar={handleDeleteCar}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
