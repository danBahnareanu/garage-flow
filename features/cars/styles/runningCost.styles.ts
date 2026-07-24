import { Colors } from '@/constants/colors';
import { CategoriesType } from '@/features/cars/types/car.types';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 12,
  },

  // Pie Chart Section
  chartSection: {
    backgroundColor: Colors.surface,
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  legendPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },

  // List Section
  listSection: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },

  // Cost Card
  costCard: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    // padding: 12,
    marginBottom: 10,
  },
  costCardContainer: {
    paddingBottom: 12,
    paddingHorizontal: 12, 
  },
  costCardBadgeContainer: {
    flexDirection: 'row',
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
    borderTopStartRadius: 10,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  costAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingRight: 12,
    marginTop: 6,
  },
  costCardBody: {
    gap: 4,
  },
  costDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  costDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  costVendor: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  costMileage: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  fuelDetails: {
    fontSize: 12,
    color: Colors.textMuted,
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
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textMuted,
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
    color: Colors.textPrimary,
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

// Color mapping for cost types
export const costTypeColors: Record<CategoriesType, string> = {
    'Oils & Filters': Colors.success,        // Green — universal "go/fuel"
    'Engine': '#ca8b78', // Teal — steady, mechanical
    'Brakes': '#E05C5C',      // Muted red — urgent/attention
    'Suspension': '#4A9EE0',   // Steel blue — trust/security
    'Steering': '#F0A500',         // Amber gold — financial obligation
    'Heating & AC': '#00B4C8',     // Cyan — spatial, light
    'Car Body: External': '#EF6C00',        // Deep orange — transactional, road
    'other': '#8A9BB0',       // Cool grey-blue — neutral
    'Car Body: Internal': '#26A69A',  // Coral orange — significant purchase
    'Electrical': '#4c6eb3',
    'Tires & Wheels': '#524cb3', // Warm tan/gold — premium, mechanical
    'Transmission': '#9c27b0', // Purple — complex, significant
};