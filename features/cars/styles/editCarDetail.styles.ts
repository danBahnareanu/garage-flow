import { Colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: Colors.textPrimary, fontSize: 18, marginBottom: 20 },
  backButton: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },

  // Basic Info Section
  basicInfoSection: { backgroundColor: Colors.surface, margin: 16, marginBottom: 12, borderRadius: 15, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  basicInfoGrid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },
  soldToggle:{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    marginTop: 20, 
    paddingTop:16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid', },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabBarContent: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.border,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Tab Content
  tabContent: {
    backgroundColor: Colors.surface,
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
    color: Colors.textPrimary,
  },

  // Form Elements
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  textArea: { minHeight: 60, paddingTop: 10 },
  buttonRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionButton: {
    minWidth: 70,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionButtonActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  optionButtonText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  optionButtonTextActive: { color: Colors.white, fontWeight: '600' },

  // Buttons
  saveBasicButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  saveBasicButtonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Record Cards
  recordCard: { backgroundColor: Colors.background, padding: 12, borderRadius: 10, marginBottom: 8 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  recordTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  recordActions: { flexDirection: 'row', gap: 10 },
  recordSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  recordDescription: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  noRecordsText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Badges
  typeBadge: { backgroundColor: Colors.border, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  typeBadgeText: { fontSize: 9, color: Colors.textPrimary, fontWeight: '600' },
  passBadge: { backgroundColor: Colors.success },
  failBadge: { backgroundColor: Colors.danger },
  maintenanceTypeBadge: { alignSelf: 'flex-start', marginTop: 4 },
  resultText: { fontSize: 11, fontWeight: '600' },
  costAmount: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, backgroundColor: Colors.border, padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  modalSaveButton: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  modalSaveButtonText: { color: Colors.white, fontSize: 15, fontWeight: '600' },
  typeButtonsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeButton: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButtonActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  typeButtonText: { fontSize: 11, color: Colors.textSecondary },
  typeButtonTextActive: { color: Colors.white, fontWeight: '600' },

  // Parts Replaced
  partsInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  partNameInput: { flex: 2 },
  partCostInput: { flex: 1 },
  partAddButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partsBreakdown: { marginTop: 6 },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  partItemText: { color: Colors.textPrimary, fontSize: 13, flex: 1, flexShrink: 1 },
  partItemCost: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  partRemoveText: { color: Colors.danger, fontSize: 16 },
  partsTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  partsTotalText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },

  // PDF Attachment
  pdfPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  pdfPickerText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  pdfAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pdfFileName: { fontSize: 13, color: Colors.textPrimary, flex: 1 },
});
