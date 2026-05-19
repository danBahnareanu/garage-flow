import { DonutChart } from '@/features/cars/components/DonutChart';
import { TAXONOMY_NEUTRAL } from '@/features/cars/constants/colors';
import { MaintenanceRecord } from '@/features/cars/types/car.types';
import { TaxonomyItem } from '@/features/cars/types/taxonomy.types';
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CostBreakdownChartProps {
  maintenanceHistory: MaintenanceRecord[];
  categories: TaxonomyItem[];
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({
  maintenanceHistory,
  categories,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { totalCosts, pieChartData } = useMemo(() => {
    const costsByCategory = maintenanceHistory.reduce((acc: Record<string, number>, record) => {
      const cat = record.category || 'maintenance';
      acc[cat] = (acc[cat] || 0) + record.cost;
      return acc;
    }, {});

    const total = Object.values(costsByCategory).reduce((sum, val) => sum + val, 0);

    const data = Object.entries(costsByCategory)
      .filter(([, amount]) => amount > 0)
      .sort(([keyA, amountA], [keyB, amountB]) => {
        if (keyA === 'other') return 1;
        if (keyB === 'other') return -1;
        return amountB - amountA;
      })
      .map(([key, amount]) => {
        const found = categories.find((c) => c.id === key);
        return {
          value: amount,
          color: found?.color ?? TAXONOMY_NEUTRAL,
          name: found?.name ?? 'Uncategorized',
        };
      });

    return { totalCosts: total, pieChartData: data };
  }, [maintenanceHistory, categories]);

  if (totalCosts === 0) return null;

  return (
    <View>
      <View style={styles.chartContainer}>
        <DonutChart
          data={pieChartData}
          size={220}
          strokeWidth={30}
          selectedIndex={selectedIndex}
          onSlicePress={(i) => setSelectedIndex((prev) => (prev === i ? null : i))}
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
                <Text style={{ fontSize: 14, color: '#B0B0B2' }}>Total</Text>
              </>
            )
          }
        />
      </View>
      <View style={styles.legendContainer}>
        {pieChartData.map((item, index) => {
          const percentage = ((item.value / totalCosts) * 100).toFixed(1);
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.legendRow, isSelected && styles.legendRowSelected]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendContainer: {
    marginTop: 16,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  legendRowSelected: {
    backgroundColor: '#3D2F6E',
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
});
