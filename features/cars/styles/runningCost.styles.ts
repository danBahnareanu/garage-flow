import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // Header
  headerSection: {
    backgroundColor: '#2C1F5E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E1E1E2',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B0B0B2',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7142CD',
    marginTop: 12,
  },

  // Pie Chart Section
  chartSection: {
    backgroundColor: '#2C1F5E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E1E1E2',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },

  // Legend
  legendContainer: {
    marginTop: 16,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 14,
    color: '#E1E1E2',
    textTransform: 'capitalize',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E1E1E2',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#B0B0B2',
    marginLeft: 8,
  },

  // List Section
  listSection: {
    backgroundColor: '#2C1F5E',
    borderRadius: 15,
    padding: 16,
  },

  // Cost Card
  costCard: {
    backgroundColor: '#1C1643',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  costCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  costCardLeft: {
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  costAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E1E1E2',
  },
  costCardBody: {
    gap: 4,
  },
  costDate: {
    fontSize: 13,
    color: '#B0B0B2',
  },
  costDescription: {
    fontSize: 14,
    color: '#E1E1E2',
    marginTop: 4,
  },
  costVendor: {
    fontSize: 12,
    color: '#8A8A8C',
  },
  costMileage: {
    fontSize: 12,
    color: '#8A8A8C',
  },
  fuelDetails: {
    fontSize: 12,
    color: '#8A8A8C',
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E1E1E2',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8A8A8C',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Error state
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
});

// Color mapping for cost types
export const costTypeColors: Record<string, string> = {
  fuel: '#4CAF50',
  maintenance: '#7142CD',
  repair: '#FF6B6B',
  insurance: '#2196F3',
  tax: '#FFA726',
  parking: '#26C6DA',
  toll: '#AB47BC',
  other: '#78909C',
  aquisition: '#FF7043',
  performance: '#8D6E63',
};
