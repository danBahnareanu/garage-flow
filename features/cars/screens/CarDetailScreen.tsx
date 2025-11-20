import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import useCarStore from '@/features/cars/store/carList.store';
import { Car } from '@/features/cars/types/car.types';

const CarDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getCarById = useCarStore((state) => state.getCarById);

  const car = getCarById(id as string);

  if (!car) {
    return (
      <SafeAreaView style={styles.container}>
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
    if (daysRemaining === null) return '#7142CD';
    if (daysRemaining < 0) return '#FF4444'; // expired - red
    if (daysRemaining <= 30) return '#FFA500'; // expiring soon - orange
    return '#4CAF50'; // valid - green
  };

  const insuranceDays = calculateDaysRemaining(car.insuranceExpiryDate);
  const inspectionDays = calculateDaysRemaining(car.technicalInspectionExpiry);
  const registrationDays = calculateDaysRemaining(car.registrationExpiry);

  const costData = {
    labels: ['Fuel', 'Maintenance', 'Repairs'],
    datasets: [
      {
        data: [
          car.fuelCosts || 0,
          car.maintenanceCosts || 0,
          car.repairCosts || 0,
        ],
      },
    ],
  };

  const hasCostData = (car.fuelCosts || 0) + (car.maintenanceCosts || 0) + (car.repairCosts || 0) > 0;

  return (
    <SafeAreaView style={styles.container}>
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
              <Ionicons name="car-sport" size={80} color="#7142CD" />
            </View>
          )}
        </View>

        {/* Car Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.carTitle}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.carSubtitle}>
            {car.year} " {car.licensePlate} " {car.fuel}
          </Text>
          {car.vin && (
            <Text style={styles.vinText}>VIN: {car.vin}</Text>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/cars/edit/${id}`)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>

        {/* Insurance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Insurance</Text>
          </View>
          <View style={styles.sectionContent}>
            {car.insuranceProvider || car.insuranceExpiryDate ? (
              <>
                {car.insuranceProvider && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Provider:</Text>
                    <Text style={styles.infoValue}>{car.insuranceProvider}</Text>
                  </View>
                )}
                {car.insurancePolicyNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Policy Number:</Text>
                    <Text style={styles.infoValue}>{car.insurancePolicyNumber}</Text>
                  </View>
                )}
                {car.insuranceExpiryDate && (
                  <>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Expiry Date:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(car.insuranceExpiryDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.expiryBadge, { backgroundColor: getExpiryColor(insuranceDays) }]}>
                      <Text style={styles.expiryText}>
                        {insuranceDays !== null
                          ? insuranceDays < 0
                            ? `Expired ${Math.abs(insuranceDays)} days ago`
                            : `${insuranceDays} days remaining`
                          : 'N/A'}
                      </Text>
                    </View>
                  </>
                )}
                {car.insuranceCost !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Annual Cost:</Text>
                    <Text style={styles.infoValue}>${car.insuranceCost.toFixed(2)}</Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noDataText}>No insurance information available</Text>
            )}
          </View>
        </View>

        {/* Technical Inspection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-done-circle" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Technical Inspection</Text>
          </View>
          <View style={styles.sectionContent}>
            {car.technicalInspectionExpiry ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expiry Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(car.technicalInspectionExpiry).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.expiryBadge, { backgroundColor: getExpiryColor(inspectionDays) }]}>
                  <Text style={styles.expiryText}>
                    {inspectionDays !== null
                      ? inspectionDays < 0
                        ? `Expired ${Math.abs(inspectionDays)} days ago`
                        : `${inspectionDays} days remaining`
                      : 'N/A'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>No inspection information available</Text>
            )}
          </View>
        </View>

        {/* Registration Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Registration</Text>
          </View>
          <View style={styles.sectionContent}>
            {car.registrationExpiry ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expiry Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(car.registrationExpiry).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.expiryBadge, { backgroundColor: getExpiryColor(registrationDays) }]}>
                  <Text style={styles.expiryText}>
                    {registrationDays !== null
                      ? registrationDays < 0
                        ? `Expired ${Math.abs(registrationDays)} days ago`
                        : `${registrationDays} days remaining`
                      : 'N/A'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>No registration information available</Text>
            )}
          </View>
        </View>

        {/* Running Costs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Running Costs</Text>
          </View>
          <View style={styles.sectionContent}>
            {hasCostData ? (
              <>
                <BarChart
                  data={costData}
                  width={Dimensions.get('window').width - 80}
                  height={220}
                  yAxisLabel="$"
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#2C1F5E',
                    backgroundGradientFrom: '#2C1F5E',
                    backgroundGradientTo: '#2C1F5E',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(113, 66, 205, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(225, 225, 226, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForLabels: {
                      fontSize: 12,
                    },
                  }}
                  style={styles.chart}
                />
                <View style={styles.costBreakdown}>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Fuel Costs:</Text>
                    <Text style={styles.costValue}>${(car.fuelCosts || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Maintenance Costs:</Text>
                    <Text style={styles.costValue}>${(car.maintenanceCosts || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Repair Costs:</Text>
                    <Text style={styles.costValue}>${(car.repairCosts || 0).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.costRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Running Costs:</Text>
                    <Text style={styles.totalValue}>
                      ${((car.fuelCosts || 0) + (car.maintenanceCosts || 0) + (car.repairCosts || 0)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>No cost data available</Text>
            )}
          </View>
        </View>

        {/* Maintenance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="build" size={24} color="#7142CD" />
            <Text style={styles.sectionTitle}>Maintenance</Text>
          </View>
          <View style={styles.sectionContent}>
            {car.currentMileage !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Mileage:</Text>
                <Text style={styles.infoValue}>{car.currentMileage.toLocaleString()} km</Text>
              </View>
            )}
            {car.lastServiceDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Service:</Text>
                <Text style={styles.infoValue}>
                  {new Date(car.lastServiceDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            {car.nextServiceDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Next Service:</Text>
                <Text style={styles.infoValue}>
                  {new Date(car.nextServiceDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            {car.nextServiceMileage !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Next Service Mileage:</Text>
                <Text style={styles.infoValue}>{car.nextServiceMileage.toLocaleString()} km</Text>
              </View>
            )}

            {/* Service History */}
            {car.serviceHistory && car.serviceHistory.length > 0 ? (
              <View style={styles.serviceHistory}>
                <Text style={styles.serviceHistoryTitle}>Service History</Text>
                {car.serviceHistory.map((record) => (
                  <View key={record.id} style={styles.serviceRecord}>
                    <View style={styles.serviceRecordHeader}>
                      <Text style={styles.serviceDate}>
                        {new Date(record.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.serviceCost}>${record.cost.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.serviceDescription}>{record.description}</Text>
                    <View style={styles.serviceRecordFooter}>
                      <Text style={styles.serviceMileage}>{record.mileage.toLocaleString()} km</Text>
                      <View style={[styles.serviceTypeBadge, styles[`${record.type}Badge`]]}>
                        <Text style={styles.serviceTypeText}>{record.type}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              car.currentMileage === undefined &&
              !car.lastServiceDate &&
              !car.nextServiceDate && (
                <Text style={styles.noDataText}>No maintenance information available</Text>
              )
            )}
          </View>
        </View>

        {/* Additional Details */}
        {(car.color || car.transmission || car.notes) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#7142CD" />
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
    backgroundColor: '#1C1643',
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
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#2C1F5E',
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
    backgroundColor: '#2C1F5E',
    borderBottomWidth: 1,
    borderBottomColor: '#3D2F6E',
  },
  carTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E1E1E2',
    marginBottom: 8,
  },
  carSubtitle: {
    fontSize: 16,
    color: '#B0B0B2',
  },
  vinText: {
    fontSize: 14,
    color: '#8A8A8C',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7142CD',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#2C1F5E',
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
    color: '#E1E1E2',
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
    color: '#B0B0B2',
  },
  infoValue: {
    fontSize: 15,
    color: '#E1E1E2',
    fontWeight: '500',
  },
  expiryBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  expiryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: '#8A8A8C',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  costBreakdown: {
    marginTop: 16,
    gap: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  costLabel: {
    fontSize: 15,
    color: '#B0B0B2',
  },
  costValue: {
    fontSize: 15,
    color: '#E1E1E2',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3D2F6E',
  },
  totalLabel: {
    fontSize: 16,
    color: '#E1E1E2',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: '#7142CD',
    fontWeight: '700',
  },
  serviceHistory: {
    marginTop: 16,
  },
  serviceHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1E1E2',
    marginBottom: 12,
  },
  serviceRecord: {
    backgroundColor: '#1C1643',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  serviceRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceDate: {
    fontSize: 14,
    color: '#B0B0B2',
    fontWeight: '500',
  },
  serviceCost: {
    fontSize: 14,
    color: '#7142CD',
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: 15,
    color: '#E1E1E2',
    marginBottom: 8,
  },
  serviceRecordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceMileage: {
    fontSize: 13,
    color: '#8A8A8C',
  },
  serviceTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  maintenanceBadge: {
    backgroundColor: '#4CAF50',
  },
  repairBadge: {
    backgroundColor: '#FFA500',
  },
  inspectionBadge: {
    backgroundColor: '#2196F3',
  },
  serviceTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  notesContainer: {
    gap: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#E1E1E2',
    lineHeight: 20,
  },
});

export default CarDetailScreen;
