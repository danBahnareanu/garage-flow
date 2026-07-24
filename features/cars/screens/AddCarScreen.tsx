import { Colors } from '@/constants/colors';
import * as Crypto from 'expo-crypto'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useCarStore from '../store/carList.store'
import { Car } from '../types/car.types'

export default function CarForm() {
  const router = useRouter()
  const addCar = useCarStore((state) => state.addCar)

  const [name, setName] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [fuel, setFuel] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol')
  const [engineCode, setEngineCode] = useState('')

  const handleSubmit = () => {
    const newCar: Car = {
      id: Crypto.randomUUID(),
      name: name || undefined,
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
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add New Car</Text>
          <TextInput
            placeholder="Name (optional, e.g. My Daily Driver)"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Make"
            placeholderTextColor={Colors.textMuted}
            value={make}
            onChangeText={setMake}
            style={styles.input}
          />
          <TextInput
            placeholder="Model"
            placeholderTextColor={Colors.textMuted}
            value={model}
            onChangeText={setModel}
            style={styles.input}
          />
          <TextInput
            placeholder="Year"
            placeholderTextColor={Colors.textMuted}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="License Plate"
            placeholderTextColor={Colors.textMuted}
            value={licensePlate}
            onChangeText={setLicensePlate}
            style={styles.input}
          />
          <TextInput
            placeholder="Engine Code (optional)"
            placeholderTextColor={Colors.textMuted}
            value={engineCode}
            onChangeText={setEngineCode}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
})
