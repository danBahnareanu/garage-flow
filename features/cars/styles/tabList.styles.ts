import { StyleSheet } from 'react-native';

export const tabListStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E1E1E2',
  },
  addButton: {
    backgroundColor: '#7142CD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card styles
  card: {
    backgroundColor: '#2C1F5E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: '#B0B0B2',
    fontWeight: '500',
  },
  cardCost: {
    fontSize: 14,
    color: '#7142CD',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    color: '#E1E1E2',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: '#8A8A8C',
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#3D2F6E',
  },
  badgeText: {
    fontSize: 11,
    color: '#E1E1E2',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },

  // Empty state
  emptyText: {
    color: '#8A8A8C',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Parts section (used by MaintenanceTab)
  partsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3D2F6E',
  },
  partsLabel: {
    fontSize: 12,
    color: '#B0B0B2',
    marginBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  partName: {
    fontSize: 13,
    color: '#E1E1E2',
    flex: 1,
    flexShrink: 1,
  },
  partCost: {
    fontSize: 13,
    color: '#7142CD',
    fontWeight: '600',
  },
});
