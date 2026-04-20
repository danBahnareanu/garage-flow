import { InsuranceTab } from '@/features/cars/components/tabs/InsuranceTab';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditInsuranceScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useCarStore((state) => state.cars.find(c => c.id === id));

  if (!car) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Car not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView}>
          <InsuranceTab carId={id as string} carName={`${car.make} ${car.model}`} insuranceHistory={car.insuranceHistory} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditInsuranceScreen;
