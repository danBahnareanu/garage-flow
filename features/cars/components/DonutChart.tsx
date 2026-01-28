import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  /** Array of data slices to display */
  data: DonutSlice[];
  /** Overall size (width and height) of the chart */
  size?: number;
  /** Thickness of the donut ring */
  strokeWidth?: number;
  /** Currently selected slice index (null for none) */
  selectedIndex?: number | null;
  /** Callback when a slice is pressed */
  onSlicePress?: (index: number) => void;
  /** Extra radius added to selected slice */
  selectedExpansion?: number;
  /** Opacity of non-selected slices when one is selected */
  unselectedOpacity?: number;
  /** Content to display in the center of the donut */
  centerLabel?: React.ReactNode;
  /** Style for the center label container */
  centerLabelStyle?: ViewStyle;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 30,
  selectedIndex = null,
  onSlicePress,
  selectedExpansion = 8,
  unselectedOpacity = 0.5,
  centerLabel,
  centerLabelStyle,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <View style={[styles.emptyContainer, { width: size, height: size }]}>
        <Text style={styles.emptyText}>No data</Text>
      </View>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Calculate path for each slice
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    // Handle full circle case (single slice with 100%)
    if (endAngle - startAngle >= 2 * Math.PI - 0.001) {
      // Draw two half circles to avoid SVG arc issues
      const midAngle = startAngle + Math.PI;

      const path1 = createHalfArcPath(startAngle, midAngle, innerRadius, outerRadius);
      const path2 = createHalfArcPath(midAngle, endAngle, innerRadius, outerRadius);

      return path1 + ' ' + path2;
    }

    const startOuter = {
      x: center + outerRadius * Math.cos(startAngle),
      y: center + outerRadius * Math.sin(startAngle),
    };
    const endOuter = {
      x: center + outerRadius * Math.cos(endAngle),
      y: center + outerRadius * Math.sin(endAngle),
    };
    const startInner = {
      x: center + innerRadius * Math.cos(endAngle),
      y: center + innerRadius * Math.sin(endAngle),
    };
    const endInner = {
      x: center + innerRadius * Math.cos(startAngle),
      y: center + innerRadius * Math.sin(startAngle),
    };

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  const createHalfArcPath = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    const startOuter = {
      x: center + outerRadius * Math.cos(startAngle),
      y: center + outerRadius * Math.sin(startAngle),
    };
    const endOuter = {
      x: center + outerRadius * Math.cos(endAngle),
      y: center + outerRadius * Math.sin(endAngle),
    };
    const startInner = {
      x: center + innerRadius * Math.cos(endAngle),
      y: center + innerRadius * Math.sin(endAngle),
    };
    const endInner = {
      x: center + innerRadius * Math.cos(startAngle),
      y: center + innerRadius * Math.sin(startAngle),
    };

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerRadius} ${outerRadius} 0 0 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerRadius} ${innerRadius} 0 0 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  // Build slices
  const slices: Array<{
    path: string;
    color: string;
    index: number;
    isSelected: boolean;
  }> = [];

  let currentAngle = -Math.PI / 2; // Start from top

  data.forEach((slice, index) => {
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const isSelected = selectedIndex === index;
    const baseInnerRadius = radius - strokeWidth;
    const outerRadius = isSelected ? radius + selectedExpansion : radius;
    const innerRadius = isSelected ? baseInnerRadius - (selectedExpansion / 2) : baseInnerRadius;

    const path = createArcPath(startAngle, endAngle, innerRadius, outerRadius);

    slices.push({
      path,
      color: slice.color,
      index,
      isSelected,
    });
  });

  return (
    <View style={{ position: 'relative', width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice) => (
            <Path
              key={slice.index}
              d={slice.path}
              fill={slice.color}
              opacity={selectedIndex !== null && !slice.isSelected ? unselectedOpacity : 1}
              onPress={() => onSlicePress?.(slice.index)}
            />
          ))}
        </G>
      </Svg>
      {centerLabel && (
        <View
          style={[styles.centerLabelContainer, centerLabelStyle]}
          pointerEvents="none"
        >
          {centerLabel}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C1F5E',
    borderRadius: 100,
  },
  emptyText: {
    color: '#8A8A8C',
    fontSize: 14,
  },
  centerLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DonutChart;
