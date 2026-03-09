import { DropdownMenu, MenuButton } from '@/features/cars/components/DropdownMenu';
import { useCarImportExport } from '@/features/cars/hooks/useCarImportExport';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Layout() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { isLoading, handleExport, handleImport } = useCarImportExport();

  const handleAddNewCar = () => {
    setVisible(false);
    router.push('/cars/add');
  };

  const handleExportCarList = async () => {
    await handleExport();
    setVisible(false);
  };

  const handleImportCarList = async () => {
    await handleImport();
    setVisible(false);
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
