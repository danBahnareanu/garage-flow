import useCarStore from '@/features/cars/store/carList.store';
import {
  InspectionRecord,
  InsuranceRecord,
  MaintenanceRecord,
  RunningCostRecord,
} from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

type TabType = 'insurance' | 'inspection' | 'costs' | 'maintenance';

interface TabConfig {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { key: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { key: 'inspection', label: 'Inspections', icon: 'checkmark-done-circle' },
  { key: 'costs', label: 'Costs', icon: 'cash' },
  { key: 'maintenance', label: 'Maintenance', icon: 'build' },
];

const EditCarDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getCarById,
    updateCar,
    addInsuranceRecord,
    updateInsuranceRecord,
    deleteInsuranceRecord,
    addInspectionRecord,
    updateInspectionRecord,
    deleteInspectionRecord,
    addRunningCostRecord,
    updateRunningCostRecord,
    deleteRunningCostRecord,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
  } = useCarStore();

  const car = getCarById(id as string);

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('insurance');

  // Basic car fields
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');
  const [transmission, setTransmission] = useState<'manual' | 'automatic' | ''>('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Modal states
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [costModalVisible, setCostModalVisible] = useState(false);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);

  // Editing record IDs
  const [editingInsuranceId, setEditingInsuranceId] = useState<string | null>(null);
  const [editingInspectionId, setEditingInspectionId] = useState<string | null>(null);
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [editingMaintenanceId, setEditingMaintenanceId] = useState<string | null>(null);

  // Insurance form fields
  const [insProvider, setInsProvider] = useState('');
  const [insPolicyNumber, setInsPolicyNumber] = useState('');
  const [insStartDate, setInsStartDate] = useState('');
  const [insExpiryDate, setInsExpiryDate] = useState('');
  const [insCost, setInsCost] = useState('');
  const [insCoverageType, setInsCoverageType] = useState('');

  // Inspection form fields
  const [inspType, setInspType] = useState<InspectionRecord['type']>('technical');
  const [inspDate, setInspDate] = useState('');
  const [inspExpiryDate, setInspExpiryDate] = useState('');
  const [inspResult, setInspResult] = useState<InspectionRecord['result']>('pass');
  const [inspMileage, setInspMileage] = useState('');
  const [inspCost, setInspCost] = useState('');
  const [inspLocation, setInspLocation] = useState('');

  // Running cost form fields
  const [costType, setCostType] = useState<RunningCostRecord['type']>('fuel');
  const [costDate, setCostDate] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costMileage, setCostMileage] = useState('');
  const [costDescription, setCostDescription] = useState('');
  const [costVendor, setCostVendor] = useState('');
  const [costLiters, setCostLiters] = useState('');
  const [costPricePerLiter, setCostPricePerLiter] = useState('');

  // Maintenance form fields
  const [maintDate, setMaintDate] = useState('');
  const [maintMileage, setMaintMileage] = useState('');
  const [maintType, setMaintType] = useState<MaintenanceRecord['type']>('scheduled');
  const [maintDescription, setMaintDescription] = useState('');
  const [maintCost, setMaintCost] = useState('');
  const [maintServiceProvider, setMaintServiceProvider] = useState('');
  const [maintNextServiceDate, setMaintNextServiceDate] = useState('');
  const [maintNextServiceMileage, setMaintNextServiceMileage] = useState('');

  useEffect(() => {
    if (car) {
      setPurchasePrice(car.purchasePrice?.toString() || '');
      setCurrentMileage(car.currentMileage?.toString() || '');
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveBasicInfo = () => {
    updateCar(id as string, {
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

  // Insurance handlers
  const openInsuranceModal = (record?: InsuranceRecord) => {
    if (record) {
      setEditingInsuranceId(record.id);
      setInsProvider(record.provider);
      setInsPolicyNumber(record.policyNumber || '');
      setInsStartDate(record.startDate);
      setInsExpiryDate(record.expiryDate);
      setInsCost(record.cost.toString());
      setInsCoverageType(record.coverageType || '');
    } else {
      setEditingInsuranceId(null);
      setInsProvider('');
      setInsPolicyNumber('');
      setInsStartDate('');
      setInsExpiryDate('');
      setInsCost('');
      setInsCoverageType('');
    }
    setInsuranceModalVisible(true);
  };

  const handleSaveInsurance = () => {
    if (!insProvider || !insStartDate || !insExpiryDate || !insCost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InsuranceRecord = {
      id: editingInsuranceId || generateId(),
      provider: insProvider,
      policyNumber: insPolicyNumber || undefined,
      startDate: insStartDate,
      expiryDate: insExpiryDate,
      cost: parseFloat(insCost),
      coverageType: insCoverageType || undefined,
    };
    if (editingInsuranceId) {
      updateInsuranceRecord(id as string, editingInsuranceId, record);
    } else {
      addInsuranceRecord(id as string, record);
    }
    setInsuranceModalVisible(false);
  };

  const handleDeleteInsurance = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteInsuranceRecord(id as string, recordId) },
    ]);
  };

  // Inspection handlers
  const openInspectionModal = (record?: InspectionRecord) => {
    if (record) {
      setEditingInspectionId(record.id);
      setInspType(record.type);
      setInspDate(record.date);
      setInspExpiryDate(record.expiryDate || '');
      setInspResult(record.result);
      setInspMileage(record.mileage?.toString() || '');
      setInspCost(record.cost?.toString() || '');
      setInspLocation(record.location || '');
    } else {
      setEditingInspectionId(null);
      setInspType('technical');
      setInspDate('');
      setInspExpiryDate('');
      setInspResult('pass');
      setInspMileage('');
      setInspCost('');
      setInspLocation('');
    }
    setInspectionModalVisible(true);
  };

  const handleSaveInspection = () => {
    if (!inspDate) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InspectionRecord = {
      id: editingInspectionId || generateId(),
      type: inspType,
      date: inspDate,
      expiryDate: inspExpiryDate || undefined,
      result: inspResult,
      mileage: inspMileage ? parseInt(inspMileage, 10) : undefined,
      cost: inspCost ? parseFloat(inspCost) : undefined,
      location: inspLocation || undefined,
    };
    if (editingInspectionId) {
      updateInspectionRecord(id as string, editingInspectionId, record);
    } else {
      addInspectionRecord(id as string, record);
    }
    setInspectionModalVisible(false);
  };

  const handleDeleteInspection = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteInspectionRecord(id as string, recordId) },
    ]);
  };

  // Running cost handlers
  const openCostModal = (record?: RunningCostRecord) => {
    if (record) {
      setEditingCostId(record.id);
      setCostType(record.type);
      setCostDate(record.date);
      setCostAmount(record.amount.toString());
      setCostMileage(record.mileage?.toString() || '');
      setCostDescription(record.description || '');
      setCostVendor(record.vendor || '');
      setCostLiters(record.liters?.toString() || '');
      setCostPricePerLiter(record.pricePerLiter?.toString() || '');
    } else {
      setEditingCostId(null);
      setCostType('fuel');
      setCostDate('');
      setCostAmount('');
      setCostMileage('');
      setCostDescription('');
      setCostVendor('');
      setCostLiters('');
      setCostPricePerLiter('');
    }
    setCostModalVisible(true);
  };

  const handleSaveCost = () => {
    if (!costDate || !costAmount) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: RunningCostRecord = {
      id: editingCostId || generateId(),
      type: costType,
      date: costDate,
      amount: parseFloat(costAmount),
      mileage: costMileage ? parseInt(costMileage, 10) : undefined,
      description: costDescription || undefined,
      vendor: costVendor || undefined,
      liters: costLiters ? parseFloat(costLiters) : undefined,
      pricePerLiter: costPricePerLiter ? parseFloat(costPricePerLiter) : undefined,
    };
    if (editingCostId) {
      updateRunningCostRecord(id as string, editingCostId, record);
    } else {
      addRunningCostRecord(id as string, record);
    }
    setCostModalVisible(false);
  };

  const handleDeleteCost = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRunningCostRecord(id as string, recordId) },
    ]);
  };

  // Maintenance handlers
  const openMaintenanceModal = (record?: MaintenanceRecord) => {
    if (record) {
      setEditingMaintenanceId(record.id);
      setMaintDate(record.date);
      setMaintMileage(record.mileage.toString());
      setMaintType(record.type);
      setMaintDescription(record.description);
      setMaintCost(record.cost.toString());
      setMaintServiceProvider(record.serviceProvider || '');
      setMaintNextServiceDate(record.nextServiceDate || '');
      setMaintNextServiceMileage(record.nextServiceMileage?.toString() || '');
    } else {
      setEditingMaintenanceId(null);
      setMaintDate('');
      setMaintMileage('');
      setMaintType('scheduled');
      setMaintDescription('');
      setMaintCost('');
      setMaintServiceProvider('');
      setMaintNextServiceDate('');
      setMaintNextServiceMileage('');
    }
    setMaintenanceModalVisible(true);
  };

  const handleSaveMaintenance = () => {
    if (!maintDate || !maintMileage || !maintDescription || !maintCost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: MaintenanceRecord = {
      id: editingMaintenanceId || generateId(),
      date: maintDate,
      mileage: parseInt(maintMileage, 10),
      type: maintType,
      description: maintDescription,
      cost: parseFloat(maintCost),
      serviceProvider: maintServiceProvider || undefined,
      nextServiceDate: maintNextServiceDate || undefined,
      nextServiceMileage: maintNextServiceMileage ? parseInt(maintNextServiceMileage, 10) : undefined,
    };
    if (editingMaintenanceId) {
      updateMaintenanceRecord(id as string, editingMaintenanceId, record);
    } else {
      addMaintenanceRecord(id as string, record);
    }
    setMaintenanceModalVisible(false);
  };

  const handleDeleteMaintenance = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMaintenanceRecord(id as string, recordId) },
    ]);
  };

  const inspectionTypes: InspectionRecord['type'][] = ['technical', 'registration', 'emissions', 'safety', 'custom', 'ITP'];
  const costTypes: RunningCostRecord['type'][] = ['fuel', 'maintenance', 'repair', 'insurance', 'tax', 'parking', 'toll', 'other'];
  const maintenanceTypes: MaintenanceRecord['type'][] = ['scheduled', 'unscheduled', 'recall'];

  // Tab content renderers
  const renderInsuranceTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Insurance Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openInsuranceModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {car.insuranceHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{record.provider}</Text>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => openInsuranceModal(record)}>
                <Ionicons name="pencil" size={18} color="#7142CD" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteInsurance(record.id)}>
                <Ionicons name="trash" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordSubtitle}>
            Expires: {new Date(record.expiryDate).toLocaleDateString()} - €{record.cost}
          </Text>
          {record.coverageType && <Text style={styles.recordDescription}>{record.coverageType}</Text>}
        </View>
      ))}
      {(!car.insuranceHistory || car.insuranceHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No insurance records. Tap + to add one.</Text>
      )}
    </View>
  );

  const renderInspectionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Inspection Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openInspectionModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {car.inspectionHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordTitleRow}>
              <View style={[styles.typeBadge, record.result === 'pass' ? styles.passBadge : styles.failBadge]}>
                <Text style={styles.typeBadgeText}>{record.type.toUpperCase()}</Text>
              </View>
              <Text style={[styles.resultText, { color: record.result === 'pass' ? '#4CAF50' : '#FF4444' }]}>
                {record.result.toUpperCase()}
              </Text>
            </View>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => openInspectionModal(record)}>
                <Ionicons name="pencil" size={18} color="#7142CD" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteInspection(record.id)}>
                <Ionicons name="trash" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordSubtitle}>
            Date: {new Date(record.date).toLocaleDateString()}
            {record.expiryDate && ` • Expires: ${new Date(record.expiryDate).toLocaleDateString()}`}
          </Text>
        </View>
      ))}
      {(!car.inspectionHistory || car.inspectionHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No inspection records. Tap + to add one.</Text>
      )}
    </View>
  );

  const renderCostsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Running Costs</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openCostModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {car.runningCosts?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordTitleRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{record.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.costAmount}>€{record.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => openCostModal(record)}>
                <Ionicons name="pencil" size={18} color="#7142CD" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCost(record.id)}>
                <Ionicons name="trash" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordSubtitle}>{new Date(record.date).toLocaleDateString()}</Text>
          {record.description && <Text style={styles.recordDescription}>{record.description}</Text>}
        </View>
      ))}
      {(!car.runningCosts || car.runningCosts.length === 0) && (
        <Text style={styles.noRecordsText}>No cost records. Tap + to add one.</Text>
      )}
    </View>
  );

  const renderMaintenanceTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Maintenance Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openMaintenanceModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {car.maintenanceHistory?.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle} numberOfLines={1}>{record.description}</Text>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => openMaintenanceModal(record)}>
                <Ionicons name="pencil" size={18} color="#7142CD" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteMaintenance(record.id)}>
                <Ionicons name="trash" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordSubtitle}>
            {new Date(record.date).toLocaleDateString()} • €{record.cost} • {record.mileage.toLocaleString()} km
          </Text>
          <View style={[styles.typeBadge, styles.maintenanceTypeBadge]}>
            <Text style={styles.typeBadgeText}>{record.type}</Text>
          </View>
        </View>
      ))}
      {(!car.maintenanceHistory || car.maintenanceHistory.length === 0) && (
        <Text style={styles.noRecordsText}>No maintenance records. Tap + to add one.</Text>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insurance':
        return renderInsuranceTab();
      case 'inspection':
        return renderInspectionTab();
      case 'costs':
        return renderCostsTab();
      case 'maintenance':
        return renderMaintenanceTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Basic Info Section - Always Visible */}
        <View style={styles.basicInfoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Basic Info</Text>
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
              <Text style={[styles.optionButtonText, transmission === 'manual' && styles.optionButtonTextActive]}>
                Manual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, transmission === 'automatic' && styles.optionButtonActive]}
              onPress={() => setTransmission('automatic')}
            >
              <Text style={[styles.optionButtonText, transmission === 'automatic' && styles.optionButtonTextActive]}>
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

          <TouchableOpacity style={styles.saveBasicButton} onPress={handleSaveBasicInfo}>
            <Ionicons name="save" size={16} color="#fff" />
            <Text style={styles.saveBasicButtonText}>Save Basic Info</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeTab === tab.key ? '#7142CD' : '#8A8A8C'}
              />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Tab Content */}
        {renderTabContent()}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Insurance Modal */}
      <Modal visible={insuranceModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingInsuranceId ? 'Edit' : 'Add'} Insurance</Text>
            <ScrollView>
              <Text style={styles.label}>Provider *</Text>
              <TextInput style={styles.input} value={insProvider} onChangeText={setInsProvider} placeholder="e.g., Grawe" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Policy Number</Text>
              <TextInput style={styles.input} value={insPolicyNumber} onChangeText={setInsPolicyNumber} placeholder="Policy number" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={insStartDate} onChangeText={setInsStartDate} placeholder="2024-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Expiry Date * (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={insExpiryDate} onChangeText={setInsExpiryDate} placeholder="2025-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Cost * (€)</Text>
              <TextInput style={styles.input} value={insCost} onChangeText={setInsCost} placeholder="400" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
              <Text style={styles.label}>Coverage Type</Text>
              <TextInput style={styles.input} value={insCoverageType} onChangeText={setInsCoverageType} placeholder="comprehensive" placeholderTextColor="#8A8A8C" />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setInsuranceModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveInsurance}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Inspection Modal */}
      <Modal visible={inspectionModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingInspectionId ? 'Edit' : 'Add'} Inspection</Text>
            <ScrollView>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtonsWrap}>
                {inspectionTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, inspType === t && styles.typeButtonActive]}
                    onPress={() => setInspType(t)}
                  >
                    <Text style={[styles.typeButtonText, inspType === t && styles.typeButtonTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={inspDate} onChangeText={setInspDate} placeholder="2024-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={inspExpiryDate} onChangeText={setInspExpiryDate} placeholder="2025-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Result</Text>
              <View style={styles.buttonRow}>
                {(['pass', 'fail', 'pending'] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.optionButton, inspResult === r && styles.optionButtonActive]}
                    onPress={() => setInspResult(r)}
                  >
                    <Text style={[styles.optionButtonText, inspResult === r && styles.optionButtonTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Mileage (km)</Text>
              <TextInput style={styles.input} value={inspMileage} onChangeText={setInspMileage} placeholder="125000" placeholderTextColor="#8A8A8C" keyboardType="number-pad" />
              <Text style={styles.label}>Cost (€)</Text>
              <TextInput style={styles.input} value={inspCost} onChangeText={setInspCost} placeholder="50" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} value={inspLocation} onChangeText={setInspLocation} placeholder="Service center" placeholderTextColor="#8A8A8C" />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setInspectionModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveInspection}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Running Cost Modal */}
      <Modal visible={costModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCostId ? 'Edit' : 'Add'} Cost</Text>
            <ScrollView>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtonsWrap}>
                {costTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, costType === t && styles.typeButtonActive]}
                    onPress={() => setCostType(t)}
                  >
                    <Text style={[styles.typeButtonText, costType === t && styles.typeButtonTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={costDate} onChangeText={setCostDate} placeholder="2024-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Amount * (€)</Text>
              <TextInput style={styles.input} value={costAmount} onChangeText={setCostAmount} placeholder="50" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
              <Text style={styles.label}>Mileage (km)</Text>
              <TextInput style={styles.input} value={costMileage} onChangeText={setCostMileage} placeholder="125000" placeholderTextColor="#8A8A8C" keyboardType="number-pad" />
              <Text style={styles.label}>Description</Text>
              <TextInput style={styles.input} value={costDescription} onChangeText={setCostDescription} placeholder="Fuel fill-up" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Vendor</Text>
              <TextInput style={styles.input} value={costVendor} onChangeText={setCostVendor} placeholder="Shell" placeholderTextColor="#8A8A8C" />
              {costType === 'fuel' && (
                <>
                  <Text style={styles.label}>Liters</Text>
                  <TextInput style={styles.input} value={costLiters} onChangeText={setCostLiters} placeholder="45" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
                  <Text style={styles.label}>Price per Liter (€)</Text>
                  <TextInput style={styles.input} value={costPricePerLiter} onChangeText={setCostPricePerLiter} placeholder="1.45" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
                </>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCostModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveCost}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Maintenance Modal */}
      <Modal visible={maintenanceModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMaintenanceId ? 'Edit' : 'Add'} Maintenance</Text>
            <ScrollView>
              <Text style={styles.label}>Type</Text>
              <View style={styles.buttonRow}>
                {maintenanceTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.optionButton, maintType === t && styles.optionButtonActive]}
                    onPress={() => setMaintType(t)}
                  >
                    <Text style={[styles.optionButtonText, maintType === t && styles.optionButtonTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={maintDate} onChangeText={setMaintDate} placeholder="2024-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Mileage * (km)</Text>
              <TextInput style={styles.input} value={maintMileage} onChangeText={setMaintMileage} placeholder="125000" placeholderTextColor="#8A8A8C" keyboardType="number-pad" />
              <Text style={styles.label}>Description *</Text>
              <TextInput style={[styles.input, styles.textArea]} value={maintDescription} onChangeText={setMaintDescription} placeholder="Oil change..." placeholderTextColor="#8A8A8C" multiline numberOfLines={3} textAlignVertical="top" />
              <Text style={styles.label}>Cost * (€)</Text>
              <TextInput style={styles.input} value={maintCost} onChangeText={setMaintCost} placeholder="150" placeholderTextColor="#8A8A8C" keyboardType="decimal-pad" />
              <Text style={styles.label}>Service Provider</Text>
              <TextInput style={styles.input} value={maintServiceProvider} onChangeText={setMaintServiceProvider} placeholder="BMW Service" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Next Service Date (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={maintNextServiceDate} onChangeText={setMaintNextServiceDate} placeholder="2025-01-01" placeholderTextColor="#8A8A8C" />
              <Text style={styles.label}>Next Service Mileage (km)</Text>
              <TextInput style={styles.input} value={maintNextServiceMileage} onChangeText={setMaintNextServiceMileage} placeholder="135000" placeholderTextColor="#8A8A8C" keyboardType="number-pad" />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setMaintenanceModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveMaintenance}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1643' },
  scrollView: { flex: 1 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#E1E1E2', fontSize: 18, marginBottom: 20 },
  backButton: { backgroundColor: '#7142CD', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Basic Info Section
  basicInfoSection: { backgroundColor: '#2C1F5E', margin: 16, marginBottom: 12, borderRadius: 15, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#E1E1E2' },
  basicInfoGrid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2C1F5E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#3D2F6E',
  },
  tabLabel: {
    fontSize: 10,
    color: '#8A8A8C',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#7142CD',
    fontWeight: '600',
  },

  // Tab Content
  tabContent: {
    backgroundColor: '#2C1F5E',
    margin: 16,
    marginTop: 12,
    borderRadius: 15,
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1E1E2',
  },

  // Form Elements
  label: { fontSize: 12, color: '#B0B0B2', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#1C1643', borderRadius: 8, padding: 10, fontSize: 14, color: '#E1E1E2', borderWidth: 1, borderColor: '#3D2F6E' },
  textArea: { minHeight: 60, paddingTop: 10 },
  buttonRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionButton: { flex: 1, minWidth: 70, backgroundColor: '#1C1643', borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 2, borderColor: '#3D2F6E' },
  optionButtonActive: { borderColor: '#7142CD', backgroundColor: '#7142CD' },
  optionButtonText: { fontSize: 13, color: '#B0B0B2', fontWeight: '500' },
  optionButtonTextActive: { color: '#fff', fontWeight: '600' },

  // Buttons
  saveBasicButton: { flexDirection: 'row', backgroundColor: '#7142CD', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 6 },
  saveBasicButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  addButton: { backgroundColor: '#7142CD', borderRadius: 16, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },

  // Record Cards
  recordCard: { backgroundColor: '#1C1643', padding: 12, borderRadius: 10, marginBottom: 8 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  recordTitle: { fontSize: 14, color: '#E1E1E2', fontWeight: '600', flex: 1 },
  recordActions: { flexDirection: 'row', gap: 10 },
  recordSubtitle: { fontSize: 12, color: '#B0B0B2', marginTop: 4 },
  recordDescription: { fontSize: 11, color: '#8A8A8C', marginTop: 2 },
  noRecordsText: { color: '#8A8A8C', fontSize: 13, fontStyle: 'italic', textAlign: 'center', paddingVertical: 16 },

  // Badges
  typeBadge: { backgroundColor: '#3D2F6E', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  typeBadgeText: { fontSize: 9, color: '#E1E1E2', fontWeight: '600' },
  passBadge: { backgroundColor: '#4CAF50' },
  failBadge: { backgroundColor: '#FF4444' },
  maintenanceTypeBadge: { alignSelf: 'flex-start', marginTop: 4 },
  resultText: { fontSize: 11, fontWeight: '600' },
  costAmount: { fontSize: 14, color: '#7142CD', fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#2C1F5E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#E1E1E2', marginBottom: 12, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, backgroundColor: '#3D2F6E', padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#E1E1E2', fontSize: 15, fontWeight: '600' },
  modalSaveButton: { flex: 1, backgroundColor: '#7142CD', padding: 12, borderRadius: 10, alignItems: 'center' },
  modalSaveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  typeButtonsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeButton: { backgroundColor: '#1C1643', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#3D2F6E' },
  typeButtonActive: { borderColor: '#7142CD', backgroundColor: '#7142CD' },
  typeButtonText: { fontSize: 11, color: '#B0B0B2' },
  typeButtonTextActive: { color: '#fff', fontWeight: '600' },
});

export default EditCarDetailScreen;
