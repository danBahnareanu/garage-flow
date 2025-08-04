import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', 
          headerStyle: {
          backgroundColor: colorScheme === 'light' ? '#f4511e' : '#1e2124'},
          headerTintColor: '#fff'
         }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
      </Stack>
  );
}
