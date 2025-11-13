import DropdownMenu, { MenuOption } from '@/features/cars/components /DropdownMenu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Layout() {
  const router = useRouter()
  const [visible, setVisible] = useState(false);

  return (
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
            <DropdownMenu
        visible={visible}
        handleOpen={() => setVisible(true)}
        handleClose={() => setVisible(false)}
        trigger={
          <View style={styles.triggerStyle}>
            <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="#fff" />
          </View>
        }
      >
        <MenuOption onSelect={() => {
           
          setVisible(false);
        }}>
          <Text>View Details</Text>
        </MenuOption>
        <MenuOption onSelect={() => {
           
          setVisible(false);
        }}>
          <Text>Delete</Text>
        </MenuOption>
      </DropdownMenu>
          ),
        }} 
      />
      <Stack.Screen name="cars/add" options={{ title: 'Add a Car' }} />
    </Stack>
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