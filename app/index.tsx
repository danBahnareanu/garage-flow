import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import CarList from '../features/cars/screens/CarListScreen';

export default function HomeScreen() {
  AsyncStorage.clear(); // Clear storage for testing purposes
  return (
    <View style={styles.container}>
      <CarList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1C1643' }
})
