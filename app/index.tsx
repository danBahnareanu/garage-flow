import { Car } from '@/database/car.types';
import useCarStore from '@/store/carList.store';

import React, { useState } from 'react';
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type ItemProps = {
  item: Car;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color:textColor}]}>{item.make}</Text>
  </TouchableOpacity>
);

const App = () => {
  const carList = useCarStore(state => state.cars);
  const addCar = useCarStore(state => state.addCar);
  const removeCar = useCarStore(state => state.removeCar);
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({item}: {item: Car}) => {
    const backgroundColor = item.id === selectedId ? '#7142CD' : '#2C1F5E';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor='#E1E1E2'
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={{color: '#E1E1E2', fontSize: 24, padding: 20}}>
          Car List ({carList.length} cars)
        </Text>
        <FlatList
          data={carList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
        <Button  
          title="Add Car"
          onPress={() => {
            const newCar: Car = {
              id: (carList.length + 1).toString(),
              make: 'NewCar',
              model: 'Model',
              year: 2023,
              licensePlate: 'NEW1234',
              fuel: 'electric',
              engineCode: 'NEWCODE',
              imageUrl: ''
            };
            addCar(newCar);
          }}
        ></Button>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1643',
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 32,
  },
});

export default App;