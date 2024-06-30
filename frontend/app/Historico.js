import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

export default function Historico({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    fetch('http://ip:8000/logging', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setHistorico(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => {
    const umidadePercent = ((item.umidade / 1024) * 100).toFixed(2);
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.label}>UMIDADE: <Text style={styles.value}>{umidadePercent}%</Text></Text>
        <Text style={styles.label}>DATA: <Text style={styles.value}>{item.data}</Text></Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgb(0, 175, 154)' }]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'normal',
  },
  button: {
    padding: 15,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  }
});