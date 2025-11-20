import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useCarStore from '@/features/cars/store/carList.store';

const EditCarDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCarById, updateCar } = useCarStore();

  const car = getCarById(id as string);

  // Insurance fields
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');

  // Inspection fields
  const [technicalInspectionExpiry, setTechnicalInspectionExpiry] = useState('');
  const [registrationExpiry, setRegistrationExpiry] = useState('');

  // Cost fields
  const [purchasePrice, setPurchasePrice] = useState('');
  const [fuelCosts, setFuelCosts] = useState('');
  const [maintenanceCosts, setMaintenanceCosts] = useState('');
  const [repairCosts, setRepairCosts] = useState('');

  // Maintenance fields
  const [currentMileage, setCurrentMileage] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [nextServiceMileage, setNextServiceMileage] = useState('');

  // Additional details
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');
  const [transmission, setTransmission] = useState<'manual' | 'automatic' | ''>('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (car) {
      // Populate fields with existing car data
      setInsuranceProvider(car.insuranceProvider || '');
      setInsurancePolicyNumber(car.insurancePolicyNumber || '');
      setInsuranceExpiryDate(car.insuranceExpiryDate || '');
      setInsuranceCost(car.insuranceCost?.toString() || '');

      setTechnicalInspectionExpiry(car.technicalInspectionExpiry || '');
      setRegistrationExpiry(car.registrationExpiry || '');

      setPurchasePrice(car.purchasePrice?.toString() || '');
      setFuelCosts(car.fuelCosts?.toString() || '');
      setMaintenanceCosts(car.maintenanceCosts?.toString() || '');
      setRepairCosts(car.repairCosts?.toString() || '');

      setCurrentMileage(car.currentMileage?.toString() || '');
      setLastServiceDate(car.lastServiceDate || '');
      setNextServiceDate(car.nextServiceDate || '');
      setNextServiceMileage(car.nextServiceMileage?.toString() || '');

      setVin(car.vin || '');
      setColor(car.color || '');
      setTransmission(car.transmission || '');
      setNotes(car.notes || '');
      setImageUrl(car.imageUrl || '');
    }
  }, [car]);

  if (!car) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Car not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    const updates = {
      // Insurance
      insuranceProvider: insuranceProvider || undefined,
      insurancePolicyNumber: insurancePolicyNumber || undefined,
      insuranceExpiryDate: insuranceExpiryDate || undefined,
      insuranceCost: insuranceCost ? parseFloat(insuranceCost) : undefined,

      // Inspections
      technicalInspectionExpiry: technicalInspectionExpiry || undefined,
      registrationExpiry: registrationExpiry || undefined,

      // Costs
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      fuelCosts: fuelCosts ? parseFloat(fuelCosts) : undefined,
      maintenanceCosts: maintenanceCosts ? parseFloat(maintenanceCosts) : undefined,
      repairCosts: repairCosts ? parseFloat(repairCosts) : undefined,

      // Maintenance
      currentMileage: currentMileage ? parseInt(currentMileage, 10) : undefined,
      lastServiceDate: lastServiceDate || undefined,
      nextServiceDate: nextServiceDate || undefined,
      nextServiceMileage: nextServiceMileage ? parseInt(nextServiceMileage, 10) : undefined,

      // Additional
      vin: vin || undefined,
      color: color || undefined,
      transmission: transmission || undefined,
      notes: notes || undefined,
      imageUrl: imageUrl || undefined,
    };

    updateCar(id as string, updates);
    Alert.alert('Success', 'Car details updated successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Insurance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#7142CD" />
              <Text style={styles.sectionTitle}>Insurance Details</Text>
            </View>

            <Text style={styles.label}>Insurance Provider</Text>
            <TextInput
              style={styles.input}
              value={insuranceProvider}
              onChangeText={setInsuranceProvider}
              placeholder="e.g., State Farm"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Policy Number</Text>
            <TextInput
              style={styles.input}
              value={insurancePolicyNumber}
              onChangeText={setInsurancePolicyNumber}
              placeholder="e.g., POL-12345678"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={insuranceExpiryDate}
              onChangeText={setInsuranceExpiryDate}
              placeholder="e.g., 2025-12-31"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Annual Cost ($)</Text>
            <TextInput
              style={styles.input}
              value={insuranceCost}
              onChangeText={setInsuranceCost}
              placeholder="e.g., 1200"
              placeholderTextColor="#8A8A8C"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Inspection Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done-circle" size={24} color="#7142CD" />
              <Text style={styles.sectionTitle}>Inspections</Text>
            </View>

            <Text style={styles.label}>Technical Inspection Expiry (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={technicalInspectionExpiry}
              onChangeText={setTechnicalInspectionExpiry}
              placeholder="e.g., 2025-06-15"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Registration Expiry (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={registrationExpiry}
              onChangeText={setRegistrationExpiry}
              placeholder="e.g., 2025-08-20"
              placeholderTextColor="#8A8A8C"
            />
          </View>

          {/* Running Costs Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={24} color="#7142CD" />
              <Text style={styles.sectionTitle}>Running Costs</Text>
            </View>

            <Text style={styles.label}>Purchase Price ($)</Text>
            <TextInput
              style={styles.input}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="e.g., 15000"
              placeholderTextColor="#8A8A8C"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Fuel Costs ($)</Text>
            <TextInput
              style={styles.input}
              value={fuelCosts}
              onChangeText={setFuelCosts}
              placeholder="e.g., 2500"
              placeholderTextColor="#8A8A8C"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Maintenance Costs ($)</Text>
            <TextInput
              style={styles.input}
              value={maintenanceCosts}
              onChangeText={setMaintenanceCosts}
              placeholder="e.g., 800"
              placeholderTextColor="#8A8A8C"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Repair Costs ($)</Text>
            <TextInput
              style={styles.input}
              value={repairCosts}
              onChangeText={setRepairCosts}
              placeholder="e.g., 1200"
              placeholderTextColor="#8A8A8C"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Maintenance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="build" size={24} color="#7142CD" />
              <Text style={styles.sectionTitle}>Maintenance Tracking</Text>
            </View>

            <Text style={styles.label}>Current Mileage (km)</Text>
            <TextInput
              style={styles.input}
              value={currentMileage}
              onChangeText={setCurrentMileage}
              placeholder="e.g., 125000"
              placeholderTextColor="#8A8A8C"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Last Service Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={lastServiceDate}
              onChangeText={setLastServiceDate}
              placeholder="e.g., 2024-10-15"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Next Service Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={nextServiceDate}
              onChangeText={setNextServiceDate}
              placeholder="e.g., 2025-04-15"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Next Service Mileage (km)</Text>
            <TextInput
              style={styles.input}
              value={nextServiceMileage}
              onChangeText={setNextServiceMileage}
              placeholder="e.g., 135000"
              placeholderTextColor="#8A8A8C"
              keyboardType="number-pad"
            />
          </View>

          {/* Additional Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#7142CD" />
              <Text style={styles.sectionTitle}>Additional Details</Text>
            </View>

            <Text style={styles.label}>VIN (Vehicle Identification Number)</Text>
            <TextInput
              style={styles.input}
              value={vin}
              onChangeText={setVin}
              placeholder="e.g., 1HGBH41JXMN109186"
              placeholderTextColor="#8A8A8C"
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Color</Text>
            <TextInput
              style={styles.input}
              value={color}
              onChangeText={setColor}
              placeholder="e.g., Silver"
              placeholderTextColor="#8A8A8C"
            />

            <Text style={styles.label}>Transmission</Text>
            <View style={styles.transmissionButtons}>
              <TouchableOpacity
                style={[
                  styles.transmissionButton,
                  transmission === 'manual' && styles.transmissionButtonActive,
                ]}
                onPress={() => setTransmission('manual')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'manual' && styles.transmissionButtonTextActive,
                  ]}
                >
                  Manual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.transmissionButton,
                  transmission === 'automatic' && styles.transmissionButtonActive,
                ]}
                onPress={() => setTransmission('automatic')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'automatic' && styles.transmissionButtonTextActive,
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
              placeholder="e.g., https://example.com/car.jpg"
              placeholderTextColor="#8A8A8C"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes about your car..."
              placeholderTextColor="#8A8A8C"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#E1E1E2',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#7142CD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: '#2C1F5E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E1E1E2',
  },
  label: {
    fontSize: 15,
    color: '#B0B0B2',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1C1643',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#E1E1E2',
    borderWidth: 1,
    borderColor: '#3D2F6E',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  transmissionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  transmissionButton: {
    flex: 1,
    backgroundColor: '#1C1643',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3D2F6E',
  },
  transmissionButtonActive: {
    borderColor: '#7142CD',
    backgroundColor: '#7142CD',
  },
  transmissionButtonText: {
    fontSize: 16,
    color: '#B0B0B2',
    fontWeight: '500',
  },
  transmissionButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7142CD',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    gap: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditCarDetailScreen;
