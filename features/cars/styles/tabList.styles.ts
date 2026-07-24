import { Colors } from '@/constants/colors';
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
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card styles
  card: {
    backgroundColor: Colors.surface,
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
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardCost: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: Colors.textMuted,
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
    backgroundColor: Colors.border,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.textPrimary,
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
    color: Colors.white,
    fontWeight: '600',
  },

  // Empty state
  emptyText: {
    color: Colors.textMuted,
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
    borderTopColor: Colors.border,
  },
  partsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
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
  },
});
