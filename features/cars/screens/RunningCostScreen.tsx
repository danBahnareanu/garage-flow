import { Colors } from '@/constants/colors';
import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { CostBreakdownChart } from '@/features/cars/components/CostBreakdownChart';
import { ItemEditorModal } from '@/features/cars/components/ItemEditorModal';
import { PickerModal } from '@/features/cars/components/PickerModal';
import { TAXONOMY_NEUTRAL } from '@/features/cars/constants/colors';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/runningCost.styles';
import { Car, CATEGORIES, MaintenanceRecord, ReplacedPart } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaxonomyCard } from '../components/TaxonomyCard';
import { useTaxonomyItem } from '../hooks/useTaxonomyItem';
import { TaxonomyItem } from '../types/taxonomy.types';

const categoryIcons: Record<string, ReturnType<typeof require>> = {
  'Oils & Filters': require('@/assets/in-app-icons/oil-filter.png'),
  'Engine':         require('@/assets/in-app-icons/pistons.png'),
  'Transmission':    require('@/assets/in-app-icons/gears.png'),
  'Brakes':         require('@/assets/in-app-icons/disc-brake.png'),
  'Suspension':     require('@/assets/in-app-icons/spring.png'),
  'Steering':       require('@/assets/in-app-icons/steering-wheel.png'),
  'Heating & AC':   require('@/assets/in-app-icons/air-conditioning.png'),
  'Car Body: External': require('@/assets/in-app-icons/fender.png'),
  'Car Body: Internal': require('@/assets/in-app-icons/chassis.png'),
  'Electrical':     require('@/assets/in-app-icons/car-battery.png'),
  'Tires & Wheels': require('@/assets/in-app-icons/wheels.png'),
  'other':          require('@/assets/in-app-icons/car-parts.png'),
};

const RunningCostScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useCarStore((state: { cars: Car[] }) => state.cars.find((c: Car) => c.id === id));
  const {
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    categories,
    maintTypes,
  } = useCarStore();

  // Keyboard state
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextRecord, setContextRecord] = useState<MaintenanceRecord | null>(null);

  // Form fields
  const [maintType, setMaintType] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string>('maintenance');
  const [cost, setCost] = useState('');
  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['date', 'nextServiceDate']);
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [partsReplaced, setPartsReplaced] = useState<ReplacedPart[]>([]);
  const [partName, setPartName] = useState('');
  const [partCost, setPartCost] = useState('');
  const [nextServiceMileage, setNextServiceMileage] = useState('');

  // Picker / editor state
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [categoryEditor, setCategoryEditor] = useState<{ mode: 'add' | 'edit'; initial?: TaxonomyItem } | null>(null);
  const [typeEditor, setTypeEditor] = useState<{ mode: 'add' | 'edit'; initial?: TaxonomyItem } | null>(null);
  const [taxonomyContextMenu, setTaxonomyContextMenu] = useState<
    { kind: 'category' | 'type'; item: TaxonomyItem } | null
  >(null);

  const selectedCategory = categories.find((c) => c.name === category);
  const selectedType = maintType ? maintTypes.find((t) => t.name === maintType) : undefined;

  const { handleTaxonomySave, handleTaxonomyDelete } = useTaxonomyItem({
  onCategoryChange: (categoryId) => setCategory(categoryId),
  onTypeChange: (typeId) => setMaintType(typeId),
});

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  });
  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardHeight(0);
  });

  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);

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

  const maintenanceHistory = car.maintenanceHistory || [];

  const lookupCategory = (catId: string | undefined) => {
    const found = catId ? categories.find((c) => c.name === catId) : undefined;
    return {
      color: found?.color ?? TAXONOMY_NEUTRAL,
      name: found?.name ?? 'Uncategorized',
    };
  };

  const totalCosts = maintenanceHistory.reduce((sum, r) => sum + r.cost, 0);
  const hasCostData = totalCosts > 0;

  const sortedRecords = [...maintenanceHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const openModal = (record?: MaintenanceRecord, defaultCategory?: string) => {
    if (record) {
      setEditingId(record.id);
      setMaintType(record.type);
      setCategory(record.category || 'maintenance');
      setDate('date', new Date(record.date));
      setCost(record.cost.toString());
      setMileage(record.mileage.toString());
      setDescription(record.description);
      setServiceProvider(record.serviceProvider || '');
      setPartsReplaced(record.partsReplaced || []);
      setDate('nextServiceDate', record.nextServiceDate ? new Date(record.nextServiceDate) : null);
      setNextServiceMileage(record.nextServiceMileage?.toString() || '');
    } else {
      setEditingId(null);
      setMaintType(undefined);
      setCategory(defaultCategory ?? 'other');
      setDate('date', null);
      setCost('');
      setMileage('');
      setDescription('');
      setServiceProvider('');
      setPartsReplaced([]);
      setDate('nextServiceDate', null);
      setNextServiceMileage('');
    }
    setPartName('');
    setPartCost('');
    setModalVisible(true);
  };

  const totalPartsCost = partsReplaced.reduce((sum, p) => sum + p.cost, 0);

  const handleAddPart = () => {
    const name = partName.trim();
    const c = parseFloat(partCost);
    if (!name || isNaN(c)) {
      Alert.alert('Error', 'Please enter a part name and valid cost');
      return;
    }
    setPartsReplaced([...partsReplaced, { name, cost: c }]);
    setPartName('');
    setPartCost('');
  };

  const handleRemovePart = (index: number) => {
    setPartsReplaced(partsReplaced.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!dates.date || !mileage || !description) {
      Alert.alert('Error', 'Please fill required fields (date, mileage, description)');
      return;
    }
    const finalCost = partsReplaced.length > 0 ? totalPartsCost : (parseFloat(cost) || 0);
    const record: MaintenanceRecord = {
      id: editingId || generateId(),
      date: dates.date.toISOString(),
      mileage: parseInt(mileage, 10),
      category,
      description,
      cost: finalCost,
      partsReplaced: partsReplaced.length > 0 ? partsReplaced : undefined,
      serviceProvider: serviceProvider || undefined,
      nextServiceDate: dates.nextServiceDate ? dates.nextServiceDate.toISOString() : undefined,
      nextServiceMileage: nextServiceMileage ? parseInt(nextServiceMileage, 10) : undefined,
      ...(maintType ? { type: maintType } : {}),
    };
    if (editingId) {
      updateMaintenanceRecord(id as string, editingId, record);
    } else {
      addMaintenanceRecord(id as string, record);
    }
    setModalVisible(false);
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMaintenanceRecord(id as string, recordId),
      },
    ]);
  };

// Update handleDeleteTaxonomy calls to pass current state:
const handleDeleteTaxonomyWithContext = (kind: 'category' | 'type', item: TaxonomyItem) => {
  handleTaxonomyDelete(kind, item, {
    currentCategoryId: category,
    currentTypeId: maintType,
  });
};

  const renderRecordCard = (record: MaintenanceRecord) => {
    const cat = lookupCategory(record.category);
    const recType = record.type ? maintTypes.find((t) => t.name === record.type) : undefined;
    return (
      <TouchableOpacity
        key={record.id}
        style={styles.costCard}
        onLongPress={() => setContextRecord(record)}
        activeOpacity={0.8}
      >
        <View style={styles.costCardHeader}>
          <View style={styles.costCardLeft}>
            <View style={styles.costCardBadgeContainer}>
              <View style={[styles.typeBadge, { backgroundColor: cat.color }]}>
                <Text style={styles.typeBadgeText}>{cat.name}</Text>
              </View>
              {recType && (
              <View>
                <View style={[localStyles.maintTypeBadge, { backgroundColor: recType.color }]}>
                  <Text style={localStyles.maintTypeBadgeText}>{recType.name}</Text>
                </View>
              </View>
              )}
            </View>
          </View>
          <Text style={styles.costAmount}>€{record.cost.toFixed(2)}</Text>
        </View>
        <View style={styles.costCardContainer}>
          <View style={styles.costCardBody}>
            <Text style={styles.costDescription}>{record.description}</Text>
            <Text style={styles.costDate}>{new Date(record.date).toLocaleDateString()}</Text>
            {record.mileage > 0 && (
              <Text style={styles.costMileage}>
                {record.mileage.toLocaleString()} km
              </Text>
            )}
            {record.serviceProvider && (
              <Text style={styles.costVendor}>{record.serviceProvider}</Text>
            )}
          </View>
          {record.partsReplaced && record.partsReplaced.length > 0 && (
            <View style={localStyles.partsSection}>
              <Text style={localStyles.partsLabel}>Parts:</Text>
              {record.partsReplaced.map((part, i) => (
                <View key={i} style={localStyles.partRow}>
                  <Text style={localStyles.partName}>{part.name}</Text>
                  <Text style={localStyles.partCost}>€{part.cost.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="build-outline" size={64} color={Colors.border} />
      </View>
      <Text style={styles.emptyStateTitle}>No Records</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your maintenance and costs by tapping the + button above.
      </Text>
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

        {hasCostData && (
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pie-chart" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            </View>
            <CostBreakdownChart
              maintenanceHistory={maintenanceHistory}
              categories={categories}
            />
          </View>
        )}

        {CATEGORIES.map((catName) => {
          const catColor = categories.find((c) => c.name === catName)?.color ?? TAXONOMY_NEUTRAL;
          const nonOther = CATEGORIES.filter((c) => c !== 'other') as unknown as string[];
          const sectionRecords = catName === 'other'
            ? sortedRecords.filter((r) => !nonOther.includes(r.category))
            : sortedRecords.filter((r) => r.category === catName);

          return (
            <View key={catName} style={styles.listSection}>
              <View style={styles.sectionHeader}>
                <Image source={categoryIcons[catName]} style={[localStyles.categoryIcon, { tintColor: catColor }]} />
                <Text style={[styles.sectionTitle, { flex: 1, textTransform: 'capitalize' }]}>
                  {catName}{sectionRecords.length > 0 ? ` (${sectionRecords.length})` : ''}
                </Text>
                <TouchableOpacity
                  style={localStyles.addButton}
                  onPress={() => openModal(undefined, catName)}
                >
                  <Ionicons name="add" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              {sectionRecords.map(renderRecordCard)}
            </View>
          );
        })}
      </ScrollView>

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `${contextRecord.description} — ${new Date(contextRecord.date).toLocaleDateString()}`
            : ''
        }
        actions={[
          {
            label: 'Edit Record',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Record',
            icon: 'trash-outline',
            color: Colors.danger,
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
        <View style={{ flex: 1 }}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>{editingId ? 'Edit' : 'Add'} Record</Text>
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: keyboardHeight +20 }}
            >
              <TaxonomyCard
                label="Category"
                value={selectedCategory?.name ?? 'Maintenance'}
                color={selectedCategory?.color ?? TAXONOMY_NEUTRAL}
                onPress={() => setCategoryPickerOpen(true)}
              />
              <TaxonomyCard
                label="Type"
                value={selectedType?.name ?? 'None'}
                color={selectedType?.color ?? TAXONOMY_NEUTRAL}
                onPress={() => setTypePickerOpen(true)}
              />
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
              <Text style={localStyles.label}>Mileage * (km)</Text>
              <TextInput
                style={localStyles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="125000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
              <Text style={localStyles.label}>Description *</Text>
              <TextInput
                style={[localStyles.input, { minHeight: 60 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Oil change..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={localStyles.label}>Service Provider</Text>
              <TextInput
                style={localStyles.input}
                value={serviceProvider}
                onChangeText={setServiceProvider}
                placeholder="BMW Service"
                placeholderTextColor={Colors.textMuted}
              />
              <Text style={localStyles.label}>Parts Replaced</Text>
              <View style={localStyles.partsInputRow}>
                <TextInput
                  style={[localStyles.input, { flex: 1 }]}
                  value={partName}
                  onChangeText={setPartName}
                  placeholder="Part name"
                  placeholderTextColor={Colors.textMuted}
                />
                <TextInput
                  style={[localStyles.input, { width: 70 }]}
                  value={partCost}
                  onChangeText={setPartCost}
                  placeholder="€"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                />
                <Pressable style={localStyles.partAddButton} onPress={handleAddPart}>
                  <Ionicons name="add" size={18} color={Colors.white} />
                </Pressable>
              </View>
              {partsReplaced.map((part, index) => (
                <View key={index} style={localStyles.partItem}>
                  <Text style={localStyles.partItemText}>{part.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={localStyles.partItemCost}>€{part.cost.toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => handleRemovePart(index)}>
                      <Text style={{ color: Colors.danger, fontSize: 16 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {partsReplaced.length > 0 && (
                <View style={localStyles.partsTotalRow}>
                  <Text style={localStyles.partsTotalText}>Total</Text>
                  <Text style={localStyles.partsTotalText}>€{totalPartsCost.toFixed(2)}</Text>
                </View>
              )}
              {partsReplaced.length === 0 && (
                <>
                  <Text style={localStyles.label}>Cost (€)</Text>
                  <TextInput
                    style={localStyles.input}
                    value={cost}
                    onChangeText={setCost}
                    placeholder="50"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="decimal-pad"
                  />
                </>
              )}
              <Text style={localStyles.label}>Next Service Date</Text>
              <TouchableOpacity style={localStyles.input} onPress={() => showPicker('nextServiceDate')}>
                <Text style={dates.nextServiceDate ? localStyles.inputText : localStyles.placeholderText}>
                  {dates.nextServiceDate ? formatDate('nextServiceDate') : 'Select date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.nextServiceDate}
                mode="date"
                onConfirm={(d) => onConfirm('nextServiceDate', d)}
                onCancel={() => hidePicker('nextServiceDate')}
              />
              <Text style={localStyles.label}>Next Service Mileage (km)</Text>
              <TextInput
                style={localStyles.input}
                value={nextServiceMileage}
                onChangeText={setNextServiceMileage}
                placeholder="135000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
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
        </View>

        <PickerModal
          visible={categoryPickerOpen}
          onClose={() => setCategoryPickerOpen(false)}
          title="Select Category"
          items={categories}
          selectedId={category}
          onSelect={(catId) => setCategory(catId ?? 'maintenance')}
          onItemLongPress={(item) => setTaxonomyContextMenu({ kind: 'category', item })}
          onAddPress={() => {
            setCategoryPickerOpen(false);
            setCategoryEditor({ mode: 'add' });
          }}
        />

        <PickerModal
          visible={typePickerOpen}
          onClose={() => setTypePickerOpen(false)}
          title="Select Type"
          items={maintTypes}
          selectedId={maintType}
          showNoneOption
          onSelect={(tid) => setMaintType(tid)}
          onItemLongPress={(item) => setTaxonomyContextMenu({ kind: 'type', item })}
          onAddPress={() => {
            setTypePickerOpen(false);
            setTypeEditor({ mode: 'add' });
          }}
        />

        <ContextMenu
          visible={taxonomyContextMenu !== null}
          onClose={() => setTaxonomyContextMenu(null)}
          title={taxonomyContextMenu ? taxonomyContextMenu.item.name : ''}
          actions={[
            {
              label: 'Edit',
              icon: 'create-outline',
              onPress: () => {
                const ctx = taxonomyContextMenu;
                setTaxonomyContextMenu(null);
                if (!ctx) return;
                if (ctx.kind === 'category') {
                  setCategoryEditor({ mode: 'edit', initial: ctx.item });
                } else {
                  setTypeEditor({ mode: 'edit', initial: ctx.item });
                }
              },
            },
            {
              label: 'Delete',
              icon: 'trash-outline',
              color: Colors.danger,
              onPress: () => {
                const ctx = taxonomyContextMenu;
                setTaxonomyContextMenu(null);
                if (ctx) handleDeleteTaxonomyWithContext(ctx.kind, ctx.item);
              },
            },
          ]}
        />

        <ItemEditorModal
          visible={categoryEditor !== null}
          mode={categoryEditor?.mode ?? 'add'}
          initial={categoryEditor?.initial}
          title="Category"
          onClose={() => setCategoryEditor(null)}
          onSave={(data, context) => {
            handleTaxonomySave(data, context)
            setCategoryEditor(null)
          }}
        />

        <ItemEditorModal
          visible={typeEditor !== null}
          mode={typeEditor?.mode ?? 'add'}
          initial={typeEditor?.initial}
          title="Type"
          onClose={() => setTypeEditor(null)}
          onSave={(data, context) => {
            handleTaxonomySave(data, context)
            setTypeEditor(null)
          }}
        />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomEndRadius: 10,
  },
  maintTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  partsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  partsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 2,
    gap: 8,
  },
  partName: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  partCost: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    flexShrink: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  inputText: {
    color: Colors.textPrimary,
    fontSize: 15,
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  partsInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  partAddButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  partItemText: {
    color: Colors.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  partItemCost: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  partsTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  partsTotalText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RunningCostScreen;
