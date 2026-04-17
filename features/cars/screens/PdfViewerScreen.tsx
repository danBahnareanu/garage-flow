import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewerScreen()  {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        trustAllCerts={false}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
