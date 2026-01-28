import { DropdownMenu, MenuButton } from '@/features/cars/components/DropdownMenu';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function Layout() {
  const router = useRouter()
  const [visible, setVisible] = useState(false);

  const handleAddNewCar = () => {
    setVisible(false);
    router.push('/cars/add');
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
      />
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
  }
});