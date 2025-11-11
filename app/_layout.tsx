import { Stack } from 'expo-router'

export default function Layout() {
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
      <Stack.Screen name="index" options={{ title: 'My Garage' }} />
      <Stack.Screen name="cars/add" options={{ title: 'Add a Car' }} />
    </Stack>
  )
}
