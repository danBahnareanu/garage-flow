import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { Car } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BasicInfoSectionProps {
  car: Car;
  onSave: (updates: Partial<Car>) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ car, onSave }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [fuel, setFuel] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');
  const [transmission, setTransmission] = useState<'manual' | 'automatic' | ''>('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setMake(car.make || '');
    setModel(car.model || '');
    setYear(car.year?.toString() || '');
    setLicensePlate(car.licensePlate || '');
    setFuel(car.fuel || '');
    setPurchasePrice(car.purchasePrice?.toString() || '');
    setCurrentMileage(car.currentMileage?.toString() || '');
    setVin(car.vin || '');
    setColor(car.color || '');
    setTransmission(car.transmission || '');
    setNotes(car.notes || '');
    setImageUrl(car.imageUrl || '');
  }, [car]);

  const handleSave = () => {
    onSave({
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      currentMileage: currentMileage ? parseInt(currentMileage, 10) : undefined,
      vin: vin || undefined,
      color: color || undefined,
      transmission: transmission || undefined,
      notes: notes || undefined,
      imageUrl: imageUrl || undefined,
    });
    Alert.alert('Success', 'Basic info updated!');
  };

  return (
    <View style={styles.basicInfoSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="car" size={24} color="#7142CD" />
        <Text style={styles.sectionTitle}>Basic Info</Text>
      </View>

      <View style={styles.basicInfoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            value={make}
            onChangeText={setMake}
            placeholder="Toyota"
            placeholderTextColor="#8A8A8C"
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="Camry"
            placeholderTextColor="#8A8A8C"
          />
        </View>
      </View>

      <View style={styles.basicInfoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="2020"
            placeholderTextColor="#8A8A8C"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Fuel Type</Text>
          <TextInput
            style={styles.input}
            value={fuel}
            onChangeText={setFuel}
            placeholder="Petrol"
            placeholderTextColor="#8A8A8C"
          />
        </View>
      </View>

      <View style={styles.basicInfoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>License Plate</Text>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="ABC123"
            placeholderTextColor="#8A8A8C"
          />
        </View>
      </View>

      <View style={styles.basicInfoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Purchase Price (€)</Text>
          <TextInput
            style={styles.input}
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            placeholder="15000"
            placeholderTextColor="#8A8A8C"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Mileage (km)</Text>
          <TextInput
            style={styles.input}
            value={currentMileage}
            onChangeText={setCurrentMileage}
            placeholder="125000"
            placeholderTextColor="#8A8A8C"
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.basicInfoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>VIN</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="VIN"
            placeholderTextColor="#8A8A8C"
            autoCapitalize="characters"
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Silver"
            placeholderTextColor="#8A8A8C"
          />
        </View>
      </View>

      <Text style={styles.label}>Transmission</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.optionButton, transmission === 'manual' && styles.optionButtonActive]}
          onPress={() => setTransmission('manual')}
        >
          <Text
            style={[styles.optionButtonText, transmission === 'manual' && styles.optionButtonTextActive]}
          >
            Manual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, transmission === 'automatic' && styles.optionButtonActive]}
          onPress={() => setTransmission('automatic')}
        >
          <Text
            style={[
              styles.optionButtonText,
              transmission === 'automatic' && styles.optionButtonTextActive,
            ]}
          >
            Automatic
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://..."
        placeholderTextColor="#8A8A8C"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes..."
        placeholderTextColor="#8A8A8C"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.saveBasicButton} onPress={handleSave}>
        <Ionicons name="save" size={16} color="#fff" />
        <Text style={styles.saveBasicButtonText}>Save Basic Info</Text>
      </TouchableOpacity>
    </View>
  );
};
