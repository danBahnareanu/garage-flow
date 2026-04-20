import { ContextMenu } from '@/features/cars/components/ContextMenu';
import { useDatePicker } from '@/features/cars/hooks/useDatePicker';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { tabListStyles as ls } from '@/features/cars/styles/tabList.styles';
import { InsuranceRecord } from '@/features/cars/types/car.types';
import { generateId } from '@/features/cars/types/editCarDetail.types';
import {
  cancelScheduledNotifications,
  requestPermissions,
  scheduleInsuranceNotifications,
} from '@/features/cars/utils/notificationService';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface InsuranceTabProps {
  carId: string;
  carName: string;
  insuranceHistory?: InsuranceRecord[];
}

export const InsuranceTab: React.FC<InsuranceTabProps> = ({ carId, carName, insuranceHistory }) => {
  const router = useRouter();
  const { addInsuranceRecord, updateInsuranceRecord, deleteInsuranceRecord } = useCarStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextRecord, setContextRecord] = useState<InsuranceRecord | null>(null);

  // Form fields
  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [cost, setCost] = useState('');
  const [coverageType, setCoverageType] = useState('');
  const [pdfUri, setPdfUri] = useState<string | undefined>(undefined);

  const { dates, pickerVisible, showPicker, hidePicker, onConfirm, setDate, formatDate } =
    useDatePicker(['startDate', 'expiryDate']);

  const openModal = (record?: InsuranceRecord) => {
    if (record) {
      setEditingId(record.id);
      setProvider(record.provider);
      setPolicyNumber(record.policyNumber || '');
      setDate('startDate', new Date(record.startDate));
      setDate('expiryDate', new Date(record.expiryDate));
      setCost(record.cost.toString());
      setCoverageType(record.coverageType || '');
      setPdfUri(record.pdfUri);
    } else {
      setEditingId(null);
      setProvider('');
      setPolicyNumber('');
      setDate('startDate', null);
      setDate('expiryDate', null);
      setCost('');
      setCoverageType('');
      setPdfUri(undefined);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!provider || !dates.startDate || !dates.expiryDate || !cost) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const record: InsuranceRecord = {
      id: editingId || generateId(),
      provider,
      policyNumber: policyNumber || undefined,
      startDate: dates.startDate.toISOString(),
      expiryDate: dates.expiryDate.toISOString(),
      cost: parseFloat(cost),
      coverageType: coverageType || undefined,
      pdfUri,
    };

    const granted = await requestPermissions();
    if (granted) {
      if (editingId) {
        const oldRecord = insuranceHistory?.find((r) => r.id === editingId);
        if (oldRecord?.notificationIds) {
          await cancelScheduledNotifications(oldRecord.notificationIds);
        }
      }
      record.notificationIds = await scheduleInsuranceNotifications(carName, record);
    }

    if (editingId) {
      updateInsuranceRecord(carId, editingId, record);
    } else {
      addInsuranceRecord(carId, record);
    }
    setModalVisible(false);
  };

  const handleDelete = (recordId: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const record = insuranceHistory?.find((r) => r.id === recordId);
          if (record?.notificationIds) {
            await cancelScheduledNotifications(record.notificationIds);
          }
          deleteInsuranceRecord(carId, recordId);
        },
      },
    ]);
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    const sourceUri = result.assets[0].uri;
    const originalName = result.assets[0].name || `${Date.now()}.pdf`;
    const fileName = `insurance-${Date.now()}-${originalName}`;

    const dest = new File(Paths.document, fileName);
    if (dest.exists) {
      dest.delete();
    }
    const source = new File(sourceUri);
    source.copy(dest);
    setPdfUri(dest.uri);
  };

  return (
    <View style={ls.container}>
      <View style={ls.header}>
        <Text style={ls.headerTitle}>Insurance Records</Text>
        <TouchableOpacity style={ls.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {insuranceHistory
        ?.slice()
        .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())
        .map((record) => {
          const daysRemaining = Math.ceil(
            (new Date(record.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const isExpired = daysRemaining < 0;
          const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 30;
          return (
            <TouchableOpacity
              key={record.id}
              style={ls.card}
              onPress={() => {
                if (record.pdfUri) {
                  router.push({
                    pathname: '/cars/pdf-viewer' as any,
                    params: { uri: record.pdfUri },
                  });
                }
              }}
              onLongPress={() => setContextRecord(record)}
              activeOpacity={0.8}
            >
              <View style={ls.cardHeader}>
                <Text style={ls.cardDate}>
                  {new Date(record.startDate).toLocaleDateString()} – {new Date(record.expiryDate).toLocaleDateString()}
                </Text>
                <Text style={ls.cardCost}>€{record.cost.toFixed(2)}</Text>
              </View>
              <Text style={ls.cardTitle}>{record.provider}</Text>
              {record.policyNumber && (
                <Text style={ls.cardMeta}>Policy: {record.policyNumber}</Text>
              )}
              <View style={ls.cardFooter}>
                <Text style={ls.cardMeta}>
                  {isExpired
                    ? `Expired ${Math.abs(daysRemaining)} days ago`
                    : `${daysRemaining} days remaining`}
                </Text>
                <View style={ls.badgeRow}>
                  {record.coverageType && (
                    <View style={ls.badge}>
                      <Text style={ls.badgeText}>{record.coverageType}</Text>
                    </View>
                  )}
                  {record.pdfUri && (
                    <Ionicons name="document-text" size={16} color="#7142CD" />
                  )}
                  <View
                    style={[
                      ls.statusBadge,
                      {
                        backgroundColor: isExpired
                          ? '#FF4444'
                          : isExpiringSoon
                            ? '#FFA500'
                            : '#4CAF50',
                      },
                    ]}
                  >
                    <Text style={ls.statusBadgeText}>
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Soon' : 'Valid'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      {(!insuranceHistory || insuranceHistory.length === 0) && (
        <Text style={ls.emptyText}>No insurance records. Tap + to add one.</Text>
      )}

      <ContextMenu
        visible={contextRecord !== null}
        onClose={() => setContextRecord(null)}
        title={
          contextRecord
            ? `${contextRecord.provider}${contextRecord.policyNumber ? ` — ${contextRecord.policyNumber}` : ''}`
            : ''
        }
        actions={[
          {
            label: 'Edit Insurance',
            icon: 'create-outline',
            onPress: () => {
              const rec = contextRecord;
              setContextRecord(null);
              if (rec) openModal(rec);
            },
          },
          {
            label: 'Remove Insurance',
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Insurance</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Provider *</Text>
              <TextInput
                style={styles.input}
                value={provider}
                onChangeText={setProvider}
                placeholder="e.g., Grawe"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Policy Number</Text>
              <TextInput
                style={styles.input}
                value={policyNumber}
                onChangeText={setPolicyNumber}
                placeholder="Policy number"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity style={styles.input} onPress={() => showPicker('startDate')}>
                <Text style={dates.startDate ? styles.inputText : styles.placeholderText}>
                  {dates.startDate ? formatDate('startDate') : 'Select start date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.startDate}
                mode="date"
                onConfirm={(d) => onConfirm('startDate', d)}
                onCancel={() => hidePicker('startDate')}
              />
              <Text style={styles.label}>Expiry Date *</Text>
              <TouchableOpacity style={styles.input} onPress={() => showPicker('expiryDate')}>
                <Text style={dates.expiryDate ? styles.inputText : styles.placeholderText}>
                  {dates.expiryDate ? formatDate('expiryDate') : 'Select expiry date'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={pickerVisible.expiryDate}
                mode="date"
                onConfirm={(d) => onConfirm('expiryDate', d)}
                onCancel={() => hidePicker('expiryDate')}
              />
              <Text style={styles.label}>Cost * (€)</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="400"
                placeholderTextColor="#8A8A8C"
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>Coverage Type</Text>
              <TextInput
                style={styles.input}
                value={coverageType}
                onChangeText={setCoverageType}
                placeholder="comprehensive"
                placeholderTextColor="#8A8A8C"
              />
              <Text style={styles.label}>PDF Document</Text>
              {pdfUri ? (
                <View style={styles.pdfAttachment}>
                  <Ionicons name="document-text" size={20} color="#7142CD" />
                  <Text style={styles.pdfFileName} numberOfLines={1}>
                    {pdfUri.split('/').pop()}
                  </Text>
                  <TouchableOpacity onPress={() => setPdfUri(undefined)}>
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.pdfPickerButton} onPress={pickPdf}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#7142CD" />
                  <Text style={styles.pdfPickerText}>Attach PDF</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
