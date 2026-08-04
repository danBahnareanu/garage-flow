import { Colors } from '@/constants/colors';
import { CostBreakdownChart } from '@/features/cars/components/CostBreakdownChart';
import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper functions
const getLatestInsurance = (car: Car) =>
  car.insuranceHistory
    ?.slice()
    .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())[0];

const getValidVignettes = (car: Car) =>
  car.vignetteHistory
    ?.filter(v => new Date(v.expiryDate) >= new Date())
    .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()) || [];

const getLatestInspectionByType = (car: Car, types: string[]) =>
  car.inspectionHistory
    ?.filter(i => types.includes(i.type))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

const getLatestMaintenance = (car: Car) => {
  const records = car.maintenanceHistory?.filter(record => record.category === 'Oils & Filters') // Only consider maintenance category for "latest maintenance";
  if (!records?.length) return undefined;

  // Get the most recently added record for display (date, description, etc.)
  const latest = records[0];

  // Find the latest service date across all records
  const date = records
    .map(r => r.date)
    .filter((d): d is string => !!d)
    .sort()
    .pop() ?? latest.date;

  // Find the latest nextServiceDate across all records
  const nextServiceDate = records
    .map(r => r.nextServiceDate)
    .filter((d): d is string => !!d)
    .sort()
    .pop();

  // Find the highest nextServiceMileage across all records
  const nextServiceMileage = records.reduce<number | undefined>(
    (max, r) => r.nextServiceMileage !== undefined
      ? (max !== undefined ? Math.max(max, r.nextServiceMileage) : r.nextServiceMileage)
      : max,
    undefined
  );

  return { ...latest, date, nextServiceDate, nextServiceMileage };
};

const CarDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // const getCarById = useCarStore((state) => state.getCarById);

  // const car = getCarById(id as string);
  const car = useCarStore((state) => state.cars.find(c => c.id === id));
  const maintTypes = useCarStore((state) => state.maintTypes);
  const categories = useCarStore((state) => state.categories);

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

  const calculateDaysRemaining = (dateString?: string): number | null => {
    if (!dateString) return null;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (daysRemaining: number | null): string => {
    if (daysRemaining === null) return Colors.primary;
    if (daysRemaining < 0) return Colors.danger; // expired - red
    if (daysRemaining <= 30) return Colors.warning; // expiring soon - orange
    return Colors.success; // valid - green
  };

  // Flat status chip: colored dot + tinted background, shown in section headers
  const renderStatusPill = (daysRemaining: number | null) => {
    const color = getExpiryColor(daysRemaining);
    const label =
      daysRemaining === null
        ? 'N/A'
        : daysRemaining < 0
          ? `${Math.abs(daysRemaining)} days overdue`
          : `${daysRemaining} days left`;
    return (
      <View style={[styles.statusPill, { backgroundColor: `${color}22` }]}>
        <View style={[styles.statusPillDot, { backgroundColor: color }]} />
        <Text style={[styles.statusPillText, { color }]}>{label}</Text>
      </View>
    );
  };

  // Get data from arrays
  const latestInsurance = getLatestInsurance(car);
  const technicalInspection = getLatestInspectionByType(car, ['technical', 'ITP']);
  const registrationInspection = getLatestInspectionByType(car, ['registration']);
  const latestMaintenance = getLatestMaintenance(car);
  const validVignettes = getValidVignettes(car);

  // Calculate days remaining
  const insuranceDays = calculateDaysRemaining(latestInsurance?.expiryDate);
  const inspectionDays = calculateDaysRemaining(technicalInspection?.expiryDate);
  const registrationDays = calculateDaysRemaining(registrationInspection?.expiryDate);

  const hasCostData = (car.maintenanceHistory?.reduce((s, r) => s + r.cost, 0) ?? 0) > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        
        {/* Car Image */}
        <View style={styles.imageContainer}>
          
          {car.imageUrl ? (
            <Image
              source={{ uri: car.imageUrl }}
              style={styles.carImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="car-sport" size={80} color={Colors.primary} />
            </View>
          )}
        </View>

        {/* Car Header Info */}
        <View style={styles.headerInfo}>
          <TouchableOpacity
              onPress={() => router.push(`/cars/edit/${id}`)}>
            <Text style={styles.carTitle}>
              {car.make} {car.model}
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.white} />      
            </Text>
            <Text style={styles.carSubtitle}>
              {car.year} --- {car.licensePlate} --- {car.fuel}
            </Text>
          </TouchableOpacity>
          {car.vin && (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.vinText}>VIN: </Text>
              <Text selectable style={styles.vinText}>{car.vin}</Text>
            </View>
          )}
        </View>
        

        

        {/* Insurance Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push(`/cars/edit-insurance/${id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { flex: 1 }]}>Insurance</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            {latestInsurance ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Provider:</Text>
                  <Text style={styles.infoValue}>{latestInsurance.provider}</Text>
                </View>
                {latestInsurance.policyNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Policy Number:</Text>
                    <Text style={styles.infoValue}>{latestInsurance.policyNumber}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expiry Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(latestInsurance.expiryDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cost:</Text>
                  <Text style={styles.infoValue}>€{latestInsurance.cost.toFixed(2)}</Text>
                </View>
                {latestInsurance.coverageType && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Coverage:</Text>
                    <Text style={styles.infoValue}>{latestInsurance.coverageType}</Text>
                  </View>
                )}
                {renderStatusPill(insuranceDays)}
              </>
            ) : (
              <Text style={styles.noDataText}>No insurance information available</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Technical Inspection Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push(`/cars/edit-inspection/${id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-done-circle" size={24} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { flex: 1 }]}>Technical Inspection</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            {technicalInspection ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoValue}>{technicalInspection.type.toUpperCase()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(technicalInspection.date).toLocaleDateString()}
                  </Text>
                </View>
                {technicalInspection.expiryDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Expiry Date:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(technicalInspection.expiryDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Result:</Text>
                  <Text style={[styles.infoValue, { color: technicalInspection.result === 'pass' ? Colors.success : Colors.danger }]}>
                    {technicalInspection.result.toUpperCase()}
                  </Text>
                </View>
                {technicalInspection.expiryDate ? renderStatusPill(inspectionDays) : null}
              </>
            ) : (
              <Text style={styles.noDataText}>No inspection information available</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Road Tax Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push(`/cars/edit-road-tax/${id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={24} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { flex: 1 }]}>Road Tax</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            {validVignettes.length > 0 ? (
              validVignettes.map((vignette) => {
                const vignetteDays = calculateDaysRemaining(vignette.expiryDate);
                return (
                  <View key={vignette.id} style={styles.vignetteCard}>
                    <View style={styles.vignetteHeader}>
                      <Text style={styles.vignetteName} numberOfLines={1}>
                        {vignette.name}
                      </Text>
                    </View>
                    {vignette.country && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Country:</Text>
                        <Text style={styles.infoValue}>{vignette.country}</Text>
                      </View>
                    )}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Purchase Date:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(vignette.purchaseDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Expiry Date:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(vignette.expiryDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Cost:</Text>
                      <Text style={styles.infoValue}>€{vignette.cost.toFixed(2)}</Text>
                    </View>
                    {renderStatusPill(vignetteDays)}
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>No valid road tax information available</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Costs & Maintenance Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push(`/cars/running-costs/${id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { flex: 1 }]}>Costs & Maintenance</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            {hasCostData ? (
              <CostBreakdownChart
                maintenanceHistory={car.maintenanceHistory ?? []}
                categories={categories}
              />
            ) : (
              <Text style={styles.noDataText}>No cost data available</Text>
            )}
          </View>
          <View style={[styles.sectionHeader, styles.maintenanceSection]}>
            <Ionicons name="build" size={24} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { flex: 1 }]}>Maintenance History</Text>
          </View>
          <View style={styles.sectionContent}>
            {car.currentMileage !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Mileage:</Text>
                <Text style={styles.infoValue}>{car.currentMileage.toLocaleString()} km</Text>
              </View>
            )}
            {latestMaintenance && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Service:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(latestMaintenance.date).toLocaleDateString()}
                  </Text>
                </View>
                {latestMaintenance.nextServiceDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Next Service:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(latestMaintenance.nextServiceDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {latestMaintenance.nextServiceMileage !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Next Service Mileage:</Text>
                    <Text style={styles.infoValue}>{latestMaintenance.nextServiceMileage.toLocaleString()} km</Text>
                  </View>
                )}
              </>
            )}

            {/* Maintenance History */}
            {car.maintenanceHistory && car.maintenanceHistory.length > 0 ? (
              <View style={styles.maintenanceHistory}>
                <Text style={styles.maintenanceHistoryTitle}>Maintenance History</Text>
                {[...car.maintenanceHistory]
                  .filter(record => record.category === 'Oils & Filters') // Only maintenance category
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((record: any) => {
                  const recType = record.type ? maintTypes.find((t) => t.name === record.type) : undefined;
                  return (
                  <View key={record.id} style={styles.maintenanceRecord}>
                    <View style={styles.maintenanceRecordContainer}>
                      <View style={styles.maintenanceRecordHeader}>
                        <Text style={styles.maintenanceDate}>
                          {new Date(record.date).toLocaleDateString()}
                        </Text>
                        <Text style={styles.maintenanceCost}>€{record.cost.toFixed(2)}</Text>
                      </View>
                      <Text style={styles.maintenanceDescription}>{record.description}</Text>
                      <View style={styles.maintenanceRecordFooter}>
                        <Text style={styles.maintenanceMileage}>{record.mileage.toLocaleString()} km</Text>
                        
                      </View>
                      {record.partsReplaced && record.partsReplaced.length > 0 && (
                        <View style={styles.partsSection}>
                          <Text style={styles.partsLabel}>Parts replaced:</Text>
                          {record.partsReplaced.map((part: any, i: number) => (
                            <View key={i} style={styles.partRow}>
                              <Text style={styles.partName}>{part.name}</Text>
                              <Text style={styles.partCost}>€{part.cost.toFixed(2)}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    {recType && (
                        <View style={[styles.maintenanceTypeBadge, { backgroundColor: recType.color }]}>
                          <Text style={styles.maintenanceTypeText}>{recType.name}</Text>
                        </View>
                      )}
                  </View>
                  );
                })}
                {car.maintenanceHistory.length > 3 && (
                  <TouchableOpacity onPress={() => router.push(`/cars/running-costs/${id}`)}>
                    <Text style={styles.seeAllLink}>See All ({car.maintenanceHistory.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              car.currentMileage === undefined && (
                <Text style={styles.noDataText}>No maintenance information available</Text>
              )
            )}
          </View>
        </TouchableOpacity>

        {/* Additional Details */}
        {(car.color || car.transmission || car.notes) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Additional Details</Text>
            </View>
            <View style={styles.sectionContent}>
              {car.color && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Color:</Text>
                  <Text style={styles.infoValue}>{car.color}</Text>
                </View>
              )}
              {car.transmission && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Transmission:</Text>
                  <Text style={styles.infoValue}>
                    {car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}
                  </Text>
                </View>
              )}
              {car.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.infoLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{car.notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
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
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surface,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  carSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  vinText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    // marginHorizontal: 20,
    // marginTop: 20,
    padding: 5,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },
  statusPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noDataText: {
    color: Colors.textMuted,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  maintenanceSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
    marginTop: 20,
    paddingTop: 20,
  },
  maintenanceHistory: {
    marginTop: 16,
  },
  maintenanceHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  maintenanceRecord: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    marginBottom: 12,
  },
  maintenanceRecordContainer: {
    padding: 12,
  },
  maintenanceRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maintenanceDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  maintenanceCost: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  maintenanceDescription: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  maintenanceRecordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maintenanceMileage: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  notesContainer: {
    gap: 8,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
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
    paddingVertical: 2,
  },
  partName: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  partCost: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  vignetteCard: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  vignetteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  vignetteName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  seeAllLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  maintenanceTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    // borderRadius: 12,
  },
  maintenanceTypeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default CarDetailScreen;
