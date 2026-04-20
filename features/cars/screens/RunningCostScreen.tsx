import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { DonutChart } from '@/features/cars/components/DonutChart';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { costTypeColors, styles } from '@/features/cars/styles/runningCost.styles';
import { Car, RUNNING_COST_TYPES, RunningCostRecord, RunningCostType } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native-safe-area-context';

const RunningCostScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useCarStore((state: { cars: Car[] }) => state.cars.find((c: Car) => c.id === id));
  const { addRunningCostRecord, updateRunningCostRecord, deleteRunningCostRecord } = useCarStore();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextRecord, setContextRecord] = useState<RunningCostRecord | null>(null);

  // Form fields
  const [costType, setCostType] = useState<RunningCostRecord['type']>('fuel');
  const [amount, setAmount] = useState('');
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['date']);
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');

  // Track selected slice for animation
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!car) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
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

  const runningCosts = car.runningCosts || [];

  // Aggregate costs by type
  const costsByType = runningCosts.reduce((acc: Record<string, number>, cost: RunningCostRecord) => {
    acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalCosts: number = (Object.values(costsByType) as number[]).reduce((sum, val) => sum + val, 0);
  const hasCostData = totalCosts > 0;

  // Prepare pie chart data - memoized to prevent re-renders
  const pieChartData = useMemo(() =>
    (Object.entries(costsByType) as [RunningCostType, number][])
      .filter(([_, amount]) => amount > 0)
      .sort(([typeA, amountA], [typeB, amountB]) => {
        if (typeA === 'other') return 1;
        if (typeB === 'other') return -1;
        return amountB - amountA;
      })
      .map(([type, amount]) => ({
        value: amount as number,
        color: costTypeColors[type] || costTypeColors.other,
        name: type
      })),
    [runningCosts]
  );

  // Sort costs by date (newest first)
  const sortedCosts = [...runningCosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDateStr = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeBadgeStyle = (type: RunningCostType) => ({
    backgroundColor: costTypeColors[type] || costTypeColors.other,
  });

  const openModal = (record?: RunningCostRecord) => {
    if (record) {
      setEditingId(record.id);
      setCostType(record.type);
      setDate('date', new Date(record.date));
      setAmount(record.amount.toString());
      setMileage(record.mileage?.toString() || '');
      setDescription(record.description || '');
      setVendor(record.vendor || '');
      setLiters(record.liters?.toString() || '');
      setPricePerLiter(record.pricePerLiter?.toString() || '');
    } else {
      setEditingId(null);
      setCostType('fuel');
      setDate('date', null);
      setAmount('');
      setMileage('');
      setDescription('');
      setVendor('');
      setLiters('');
      setPricePerLiter('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!dates.date || !amount) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: RunningCostRecord = {
      id: editingId || generateId(),
      type: costType,
      date: dates.date.toISOString(),
      amount: parseFloat(amount),
      mileage: mileage ? parseInt(mileage, 10) : undefined,
      description: description || undefined,
      vendor: vendor || undefined,
      liters: liters ? parseFloat(liters) : undefined,
      pricePerLiter: pricePerLiter ? parseFloat(pricePerLiter) : undefined,
    };
    if (editingId) {
      updateRunningCostRecord(id as string, editingId, record);
    } else {
      addRunningCostRecord(id as string, record);
    }
    setModalVisible(false);
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRunningCostRecord(id as string, recordId),
      },
    ]);
  };

  const renderCostCard = (cost: RunningCostRecord) => (
    <TouchableOpacity
      key={cost.id}
      style={styles.costCard}
      onLongPress={() => setContextRecord(cost)}
      activeOpacity={0.8}
    >
      <View style={styles.costCardHeader}>
        <View style={styles.costCardLeft}>
          <View style={[styles.typeBadge, getTypeBadgeStyle(cost.type)]}>
            <Text style={styles.typeBadgeText}>{cost.type}</Text>
          </View>
        </View>
        <Text style={styles.costAmount}>€{cost.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.costCardBody}>
        <Text style={styles.costDate}>{formatDateStr(cost.date)}</Text>
        {cost.description && (
          <Text style={styles.costDescription}>{cost.description}</Text>
        )}
        {cost.vendor && (
          <Text style={styles.costVendor}>Vendor: {cost.vendor}</Text>
        )}
        {cost.mileage != null && cost.mileage > 0 && (
          <Text style={styles.costMileage}>
            Mileage: {cost.mileage.toLocaleString()} km
          </Text>
        )}
        {cost.type === 'fuel' && cost.liters != null && cost.liters > 0 && (
          <Text style={styles.fuelDetails}>
            {cost.liters.toFixed(2)}L @ €{cost.pricePerLiter?.toFixed(3)}/L
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="receipt-outline" size={64} color="#3D2F6E" />
      </View>
      <Text style={styles.emptyStateTitle}>No Running Costs</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your expenses by tapping the + button above.
      </Text>
    </View>
  );

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {pieChartData.map((item, index) => {
        const percentage = ((item.value / totalCosts) * 100).toFixed(1);
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.legendRow, isSelected && { backgroundColor: '#3D2F6E', borderRadius: 8 }]}
            onPress={() => setSelectedIndex(isSelected ? null : index)}
            activeOpacity={0.7}
          >
            <View style={styles.legendLeft}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.legendValue}>€{item.value.toFixed(2)}</Text>
              <Text style={styles.legendPercentage}>({percentage}%)</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header with total */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.headerSubtitle}>
            {car.year} • {car.licensePlate}
          </Text>
          <Text style={styles.totalAmount}>€{totalCosts.toFixed(2)}</Text>
        </View>

        {hasCostData ? (
          <>
            {/* Pie Chart Section */}
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pie-chart" size={24} color="#7142CD" />
                <Text style={styles.sectionTitle}>Cost Breakdown</Text>
              </View>
              <View style={styles.chartContainer}>
                <DonutChart
                  data={pieChartData}
                  size={220}
                  strokeWidth={30}
                  selectedIndex={selectedIndex}
                  onSlicePress={(index) =>
                    setSelectedIndex(selectedIndex === index ? null : index)
                  }
                  centerLabel={
                    selectedIndex !== null && pieChartData[selectedIndex] ? (
                      <>
                        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
                          {((pieChartData[selectedIndex].value / totalCosts) * 100).toFixed(1)}%
                        </Text>
                        <Text style={{ fontSize: 14, color: '#B0B0B2', textTransform: 'capitalize' }}>
                          {pieChartData[selectedIndex].name}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
                          €{totalCosts.toFixed(0)}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#B0B0B2' }}>
                          Total
                        </Text>
                      </>
                    )
                  }
                />
              </View>
              {renderLegend()}
            </View>

            {/* Cost Records List */}
            <View style={styles.listSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={24} color="#7142CD" />
                <Text style={[styles.sectionTitle, { flex: 1 }]}>
                  All Records ({sortedCosts.length})
                </Text>
                <TouchableOpacity style={localStyles.addButton} onPress={() => openModal()}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {sortedCosts.map(renderCostCard)}
            </View>
          </>
        ) : (
          <View style={styles.listSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color="#7142CD" />
              <Text style={[styles.sectionTitle, { flex: 1 }]}>All Records</Text>
              <TouchableOpacity style={localStyles.addButton} onPress={() => openModal()}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            {renderEmptyState()}
          </View>
        )}
      </ScrollView>

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `€${contextRecord.amount.toFixed(2)} — ${contextRecord.type}${contextRecord.description ? ` — ${contextRecord.description}` : ''}`
            : ''
        }
        actions={[
          {
            label: 'Edit Cost',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Cost',
            icon: 'trash-outline',
            color: '#FF4444',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) handleDelete(rec.id);
            },
          },
        ]}
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={localStyles.modalOverlay} behavior="padding">
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>{editingId ? 'Edit' : 'Add'} Cost</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={localStyles.label}>Type</Text>
              <View style={localStyles.typeButtonsWrap}>
                {RUNNING_COST_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      localStyles.optionButton,
                      { borderColor: costTypeColors[t] },
                      costType === t && { backgroundColor: costTypeColors[t], borderColor: costTypeColors[t] },
                    ]}
                    onPress={() => setCostType(t)}
                  >
                    <Text
                      style={[localStyles.optionButtonText, costType === t && localStyles.optionButtonTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={localStyles.label}>Date *</Text>
              <TouchableOpacity
                style={localStyles.input}
                onPress={() => showPicker('date')}
              >
                <Text style={dates.date ? localStyles.inputText : localStyles.placeholderText}>
                  {dates.date ? formatDate('date') : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.date}
                mode="date"
                onConfirm={(d) => onConfirm('date', d)}
                onCancel={() => hidePicker('date')}
              />
              <Text style={localStyles.label}>Amount * (€)</Text>
              <TextInput
                style={localStyles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="50"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={localStyles.label}>Mileage (km)</Text>
              <TextInput
                style={localStyles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="125000"
                placeholderTextColor="#8A8A8C"
                keyboardType="number-pad"
              />
              <Text style={localStyles.label}>Description</Text>
              <TextInput
                style={localStyles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Short cost description"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={localStyles.label}>Vendor</Text>
              <TextInput
                style={localStyles.input}
                value={vendor}
                onChangeText={setVendor}
                placeholder="Shell"
                placeholderTextColor="#8A8A8C"
              />
              {costType === 'fuel' && (
                <>
                  <Text style={localStyles.label}>Liters</Text>
                  <TextInput
                    style={localStyles.input}
                    value={liters}
                    onChangeText={setLiters}
                    placeholder="45"
                    placeholderTextColor="#8A8A8C"
                    keyboardType="decimal-pad"
                  />
                  <Text style={localStyles.label}>Price per Liter (€)</Text>
                  <TextInput
                    style={localStyles.input}
                    value={pricePerLiter}
                    onChangeText={setPricePerLiter}
                    placeholder="1.45"
                    placeholderTextColor="#8A8A8C"
                    keyboardType="decimal-pad"
                  />
                </>
              )}
            </ScrollView>
            <View style={localStyles.modalButtons}>
              <TouchableOpacity style={localStyles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={localStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={localStyles.saveButton} onPress={handleSave}>
                <Text style={localStyles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  addButton: {
    backgroundColor: '#7142CD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C1F5E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E1E1E2',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#B0B0B2',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1C1643',
    borderRadius: 10,
    padding: 12,
    color: '#E1E1E2',
    fontSize: 15,
  },
  inputText: {
    color: '#E1E1E2',
    fontSize: 15,
  },
  placeholderText: {
    color: '#8A8A8C',
    fontSize: 15,
  },
  typeButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionButtonText: {
    color: '#E1E1E2',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  optionButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1C1643',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E1E1E2',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#7142CD',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RunningCostScreen;
