import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { Car } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    onSave({
      make: make || undefined,
      model: model || undefined,
      year: year ? parseInt(year, 10) : undefined,
      licensePlate: licensePlate || undefined,
      fuel: fuel as 'petrol' | 'diesel' | 'electric' | 'hybrid' || undefined,
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

      <Text style={styles.label}>Car Image</Text>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: '#1C1643',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#3D2F6E',
          overflow: 'hidden',
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Ionicons name="image-outline" size={40} color="#8A8A8C" />
            <Text style={{ color: '#8A8A8C', fontSize: 14 }}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>
      {imageUrl && (
        <TouchableOpacity
          onPress={() => setImageUrl('')}
          style={{ marginTop: 8, alignSelf: 'flex-end' }}
        >
          <Text style={{ color: '#FF4444', fontSize: 12 }}>Remove image</Text>
        </TouchableOpacity>
      )}

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
