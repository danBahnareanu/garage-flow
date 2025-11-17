import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { v4 as uuidv4 } from 'uuid'
import useCarStore from '../store/carList.store'
import { Car } from '../types/car.types'

export default function CarForm() {
  const router = useRouter()
  const addCar = useCarStore((state) => state.addCar)

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [fuel, setFuel] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol')
  const [engineCode, setEngineCode] = useState('')

  const handleSubmit = () => {
    const newCar: Car = {
      id: uuidv4(),
      make,
      model,
      year: parseInt(year) || new Date().getFullYear(),
      licensePlate,
      fuel,
      engineCode,
    }
    addCar(newCar)
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Car</Text>
        <TextInput
          placeholder="Make"
          placeholderTextColor="#999"
          value={make}
          onChangeText={setMake}
          style={styles.input}
        />
        <TextInput
          placeholder="Model"
          placeholderTextColor="#999"
          value={model}
          onChangeText={setModel}
          style={styles.input}
        />
        <TextInput
          placeholder="Year"
          placeholderTextColor="#999"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="License Plate"
          placeholderTextColor="#999"
          value={licensePlate}
          onChangeText={setLicensePlate}
          style={styles.input}
        />
        <TextInput
          placeholder="Engine Code (optional)"
          placeholderTextColor="#999"
          value={engineCode}
          onChangeText={setEngineCode}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E1E1E2',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2C1F5E',
    borderWidth: 1,
    borderColor: '#7142CD',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    color: '#E1E1E2',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7142CD',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#E1E1E2',
    fontSize: 18,
    fontWeight: '600',
  },
})
