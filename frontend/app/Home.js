import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

export default function HomeScreen({ navigation }) {
  const [desiredMoisture, setDesiredMoisture] = useState(50); // Estado para armazenar a umidade desejada
  const [currentMoisture, setCurrentMoisture] = useState(null); // Estado para armazenar a umidade atual
  const [wateringMoisture, setWateringMoisture] = useState(null); // Estado para armazenar a umidade DE REGA atual

  useEffect(() => {
    // Função para buscar os dados de umidade atual
    fetch('http://ip:8000/logging/recente')
    .then(response => response.json())
    .then(data => {
      // Convertendo o valor da umidade atual para porcentagem
      const currentMoisturePercentage = Math.round((data.umidade / 1024) * 100);
      setCurrentMoisture(currentMoisturePercentage);
    })
    .catch(error => console.error('Erro ao buscar umidade atual:', error));
}, []);

    useEffect(() => {
        // Função para buscar os dados de umidade atual
        fetch('http://ip:8000/parametros/1')
        .then(response => response.json())
        .then(data => {
        // Convertendo o valor da umidade atual para porcentagem
        const wateringMoisturePercentage = Math.round((data.umidade_seco / 1024) * 100);
        setWateringMoisture(wateringMoisturePercentage);
        })
        .catch(error => console.error('Erro ao buscar umidade atual:', error));
    }, []);

  const handleSliderChange = (value) => {
    // Função para atualizar o estado da umidade desejada ao modificar o slider
    setDesiredMoisture(value);
  };

  const saveDesiredMoisture = () => {
    const desiredMoistureValue = Math.round((desiredMoisture / 100) * 1024);

    fetch('http://ip:8000/parametros/1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ umidade_seco: desiredMoistureValue }),
    })
    // Atualiza o estado de wateringMoisture com o novo valor salvo
    const newWateringMoisture = desiredMoisture;
    setWateringMoisture(newWateringMoisture);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Umidade</Text>

      <View style={styles.moistureContainer}>
        <Text style={styles.moistureLabel}>Umidade de Rega Atual</Text>
        <Text style={styles.moistureValue}>{wateringMoisture}%</Text>
      </View>

      <Text style={styles.label}>Defina o nível de umidade desejada para iniciar uma rega:</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={desiredMoisture}
        onValueChange={handleSliderChange}
      />
      <Text style={styles.sliderValue}>Nova umidade de rega: {desiredMoisture}%</Text>

      <TouchableOpacity style={styles.saveButton} onPress={saveDesiredMoisture}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      {currentMoisture !== null && (
        <Text style={styles.currentMoisture}>Umidade atual da planta: {currentMoisture}%</Text>
      )}

      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('Historico')}>
        <Text style={styles.buttonText}>Histórico</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moistureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moistureLabel: {
    fontSize: 18,
    marginRight: 8,
  },
  moistureValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'rgb(0, 175, 154)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  currentMoisture: {
    marginTop: 20,
    fontSize: 16,
  },
  historyButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
});