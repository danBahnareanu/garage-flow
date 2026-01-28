import useCarStore from '@/features/cars/store/carList.store';
import { DonutChart } from '@/features/cars/components/DonutChart';
import { costTypeColors, styles } from '@/features/cars/styles/runningCost.styles';
import { Car, RunningCostRecord } from '@/features/cars/types/car.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RunningCostScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useCarStore((state: { cars: Car[] }) => state.cars.find((c: Car) => c.id === id));

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

  const runningCosts = car.runningCosts || [];

  // Aggregate costs by type
  const costsByType = runningCosts.reduce((acc: Record<string, number>, cost: RunningCostRecord) => {
    acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalCosts: number = (Object.values(costsByType) as number[]).reduce((sum, val) => sum + val, 0);
  const hasCostData = totalCosts > 0;

  // Track selected slice for animation
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Prepare pie chart data - memoized to prevent re-renders
  const pieChartData = useMemo(() =>
    (Object.entries(costsByType) as [string, number][])
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => ({
        value: amount as number,
        color: costTypeColors[type] || costTypeColors.other,
        name: type
      })),
    [runningCosts]
  );

  // Sort costs by date (newest first)
  const sortedCosts = [...runningCosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeBadgeStyle = (type: string) => ({
    backgroundColor: costTypeColors[type] || costTypeColors.other,
  });

  const renderCostCard = (cost: RunningCostRecord) => (
    <View key={cost.id} style={styles.costCard}>
      <View style={styles.costCardHeader}>
        <View style={styles.costCardLeft}>
          <View style={[styles.typeBadge, getTypeBadgeStyle(cost.type)]}>
            <Text style={styles.typeBadgeText}>{cost.type}</Text>
          </View>
        </View>
        <Text style={styles.costAmount}>€{cost.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.costCardBody}>
        <Text style={styles.costDate}>{formatDate(cost.date)}</Text>
        {cost.description && (
          <Text style={styles.costDescription}>{cost.description}</Text>
        )}
        {cost.vendor && (
          <Text style={styles.costVendor}>Vendor: {cost.vendor}</Text>
        )}
        {cost.mileage && (
          <Text style={styles.costMileage}>
            Mileage: {cost.mileage.toLocaleString()} km
          </Text>
        )}
        {cost.type === 'fuel' && cost.liters && (
          <Text style={styles.fuelDetails}>
            {cost.liters.toFixed(2)}L @ €{cost.pricePerLiter?.toFixed(3)}/L
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="receipt-outline" size={64} color="#3D2F6E" />
      </View>
      <Text style={styles.emptyStateTitle}>No Running Costs</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your expenses by adding fuel, maintenance, repairs, and
        other costs in the edit screen.
      </Text>
    </View>
  );

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {pieChartData.map((item, index) => {
        const percentage = ((item.value / totalCosts) * 100).toFixed(1);
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.legendRow, isSelected && { backgroundColor: '#3D2F6E', borderRadius: 8 }]}
            onPress={() => setSelectedIndex(isSelected ? null : index)}
            activeOpacity={0.7}
          >
            <View style={styles.legendLeft}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.legendValue}>€{item.value.toFixed(2)}</Text>
              <Text style={styles.legendPercentage}>({percentage}%)</Text>
            </View>
          </TouchableOpacity>
        );
      })}
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

        {hasCostData ? (
          <>
            {/* Pie Chart Section */}
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pie-chart" size={24} color="#7142CD" />
                <Text style={styles.sectionTitle}>Cost Breakdown</Text>
              </View>
              <View style={styles.chartContainer}>
                <DonutChart
                  data={pieChartData}
                  size={220}
                  strokeWidth={30}
                  selectedIndex={selectedIndex}
                  onSlicePress={(index) =>
                    setSelectedIndex(selectedIndex === index ? null : index)
                  }
                  centerLabel={
                    selectedIndex !== null && pieChartData[selectedIndex] ? (
                      <>
                        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
                          {((pieChartData[selectedIndex].value / totalCosts) * 100).toFixed(1)}%
                        </Text>
                        <Text style={{ fontSize: 14, color: '#B0B0B2', textTransform: 'capitalize' }}>
                          {pieChartData[selectedIndex].name}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
                          €{totalCosts.toFixed(0)}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#B0B0B2' }}>
                          Total
                        </Text>
                      </>
                    )
                  }
                />
              </View>
              {renderLegend()}
            </View>

            {/* Cost Records List */}
            <View style={styles.listSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={24} color="#7142CD" />
                <Text style={styles.sectionTitle}>
                  All Records ({sortedCosts.length})
                </Text>
              </View>
              {sortedCosts.map(renderCostCard)}
            </View>
          </>
        ) : (
          <View style={styles.listSection}>{renderEmptyState()}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RunningCostScreen;
