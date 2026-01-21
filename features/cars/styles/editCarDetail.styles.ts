import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container
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
  input: {
    backgroundColor: '#1C1643',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#E1E1E2',
    borderWidth: 1,
    borderColor: '#3D2F6E',
  },
  textArea: { minHeight: 60, paddingTop: 10 },
  buttonRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#1C1643',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3D2F6E',
  },
  optionButtonActive: { borderColor: '#7142CD', backgroundColor: '#7142CD' },
  optionButtonText: { fontSize: 13, color: '#B0B0B2', fontWeight: '500' },
  optionButtonTextActive: { color: '#fff', fontWeight: '600' },

  // Buttons
  saveBasicButton: {
    flexDirection: 'row',
    backgroundColor: '#7142CD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  saveBasicButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  addButton: {
    backgroundColor: '#7142CD',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Record Cards
  recordCard: { backgroundColor: '#1C1643', padding: 12, borderRadius: 10, marginBottom: 8 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  recordTitle: { fontSize: 14, color: '#E1E1E2', fontWeight: '600', flex: 1 },
  recordActions: { flexDirection: 'row', gap: 10 },
  recordSubtitle: { fontSize: 12, color: '#B0B0B2', marginTop: 4 },
  recordDescription: { fontSize: 11, color: '#8A8A8C', marginTop: 2 },
  noRecordsText: {
    color: '#8A8A8C',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },

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
  modalContent: {
    backgroundColor: '#2C1F5E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#E1E1E2', marginBottom: 12, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, backgroundColor: '#3D2F6E', padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#E1E1E2', fontSize: 15, fontWeight: '600' },
  modalSaveButton: { flex: 1, backgroundColor: '#7142CD', padding: 12, borderRadius: 10, alignItems: 'center' },
  modalSaveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  typeButtonsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeButton: {
    backgroundColor: '#1C1643',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3D2F6E',
  },
  typeButtonActive: { borderColor: '#7142CD', backgroundColor: '#7142CD' },
  typeButtonText: { fontSize: 11, color: '#B0B0B2' },
  typeButtonTextActive: { color: '#fff', fontWeight: '600' },
});
