import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const App = () => {
  const [desiredMoisture, setDesiredMoisture] = useState(50);
  const [currentMoisture, setCurrentMoisture] = useState(null);
  const [canWater, setCanWater] = useState(false);

  // Função simulada para obter a umidade atual da planta
  const getCurrentMoisture = () => {
    // Simula a obtenção de umidade com um valor aleatório entre 0 e 100
    const moisture = Math.floor(Math.random() * 101);
    setCurrentMoisture(moisture);
    setCanWater(moisture < desiredMoisture);
  };

  // Função simulada para regar a planta
  const waterPlant = () => {
    // Lógica para regar a planta
    console.log('Regando a planta...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Defina o nível de umidade desejado:</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={desiredMoisture}
        onValueChange={setDesiredMoisture}
      />
      <Text>Umidade desejada: {desiredMoisture}%</Text>

      <Button title="Verificar umidade atual" onPress={getCurrentMoisture} />

      {currentMoisture !== null && (
        <Text>Umidade atual da planta: {currentMoisture}%</Text>
      )}

      <Button
        title="Regar planta"
        onPress={waterPlant}
        disabled={!canWater}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: 300,
    height: 40,
    marginBottom: 16,
  },
});

export default App;