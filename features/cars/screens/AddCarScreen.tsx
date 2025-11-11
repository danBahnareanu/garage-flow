import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
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
    <View style={styles.container}>
      <Text style={styles.title}>Add New Car</Text>
      <TextInput placeholder="Make" value={make} onChangeText={setMake} style={styles.input} />
      <TextInput placeholder="Model" value={model} onChangeText={setModel} style={styles.input} />
      <TextInput placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="License Plate" value={licensePlate} onChangeText={setLicensePlate} style={styles.input} />
      <TextInput placeholder="Engine Code (optional)" value={engineCode} onChangeText={setEngineCode} style={styles.input} />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
})
