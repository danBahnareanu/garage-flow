import { BasicInfoSection } from '@/features/cars/components/BasicInfoSection';
import { TabBar } from '@/features/cars/components/TabBar';
import { CostsTab } from '@/features/cars/components/tabs/CostsTab';
import { InspectionTab } from '@/features/cars/components/tabs/InspectionTab';
import { InsuranceTab } from '@/features/cars/components/tabs/InsuranceTab';
import { MaintenanceTab } from '@/features/cars/components/tabs/MaintenanceTab';
import { RoadTaxTab } from '@/features/cars/components/tabs/RoadTaxTab';
import useCarStore from '@/features/cars/store/carList.store';
import { styles } from '@/features/cars/styles/editCarDetail.styles';
import { Car } from '@/features/cars/types/car.types';
import { TabType } from '@/features/cars/types/editCarDetail.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditCarDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCarById, updateCar } = useCarStore();

  const car = getCarById(id as string);
  const [activeTab, setActiveTab] = useState<TabType>('insurance');

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

  const handleSaveBasicInfo = (updates: Partial<Car>) => {
    updateCar(id as string, updates);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insurance':
        return <InsuranceTab carId={id as string} carName={`${car.make} ${car.model}`} insuranceHistory={car.insuranceHistory} />;
      case 'inspection':
        return <InspectionTab carId={id as string} carName={`${car.make} ${car.model}`} inspectionHistory={car.inspectionHistory} />;
      case 'roadTax':
        return <RoadTaxTab carId={id as string} carName={`${car.make} ${car.model}`} vignetteHistory={car.vignetteHistory} />;
      case 'costs':
        return <CostsTab carId={id as string} runningCosts={car.runningCosts} />;
      case 'maintenance':
        return <MaintenanceTab carId={id as string} maintenanceHistory={car.maintenanceHistory} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
          <BasicInfoSection car={car} onSave={handleSaveBasicInfo} />
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          {renderTabContent()}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditCarDetailScreen;
