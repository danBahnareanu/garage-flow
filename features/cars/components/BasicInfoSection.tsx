import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { Car } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

const IMAGE_ASPECT = 16 / 9;

const cropperOptions = {
  mediaType: 'photo' as const,
  width: 1600,
  height: 900,
  compressImageQuality: 0.8,
  cropperToolbarTitle: 'Crop Image',
  // Android cropper theming (ignored on iOS)
  cropperToolbarColor: '#1C1643',
  cropperToolbarWidgetColor: '#FFFFFF',
  cropperStatusBarColor: '#1C1643',
  cropperActiveWidgetColor: '#7142CD',
};

const isPickerCancelled = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === 'E_PICKER_CANCELLED';

interface BasicInfoSectionProps {
  car: Car;
  onSave: (updates: Partial<Car>) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ car, onSave }) => {
  const [name, setName] = useState('');
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
  const [sold, setSold] = useState(false);

  useEffect(() => {
    setName(car.name || '');
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
    setSold(car.sold ?? false);
  }, [car]);

  const pickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({ ...cropperOptions, cropping: true });
      setImageUrl(image.path);
    } catch (error) {
      if (isPickerCancelled(error)) return;
      Alert.alert('Error', 'Could not load the selected image. Please try again.');
    }
  };

  const adjustCrop = async () => {
    if (!imageUrl) return;
    try {
      const image = await ImageCropPicker.openCropper({ ...cropperOptions, path: imageUrl });
      setImageUrl(image.path);
    } catch (error) {
      if (isPickerCancelled(error)) return;
      Alert.alert('Error', 'Could not crop the image. Try selecting it again.');
    }
  };

  const handleSave = () => {
    onSave({
      name: name || undefined,
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
      sold: sold || undefined,
    });
    Alert.alert('Success', 'Basic info updated!');
  };

  return (
    <View style={styles.basicInfoSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="car" size={24} color="#7142CD" />
        <Text style={styles.sectionTitle}>Basic Info</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. My Daily Driver"
        placeholderTextColor="#8A8A8C"
      />

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
          width: '100%',
          aspectRatio: IMAGE_ASPECT,
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
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
          <TouchableOpacity onPress={adjustCrop}>
            <Text style={{ color: '#9B7BE0', fontSize: 12 }}>Adjust crop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setImageUrl('')}>
            <Text style={{ color: '#FF4444', fontSize: 12 }}>Remove image</Text>
          </TouchableOpacity>
        </View>
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

      <View style={styles.soldToggle}>
        <Text style={styles.label}>Sold</Text>
        <Switch
          value={sold}
          onValueChange={setSold}
          trackColor={{ false: '#3D2F6E', true: '#7142CD' }}
          thumbColor={sold ? '#E1E1E2' : '#8A8A8C'}
        />
      </View>

      <TouchableOpacity style={styles.saveBasicButton} onPress={handleSave}>
        <Ionicons name="save" size={16} color="#fff" />
        <Text style={styles.saveBasicButtonText}>Save Basic Info</Text>
      </TouchableOpacity>
    </View>
  );
};