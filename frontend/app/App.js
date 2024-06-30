import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Historico from './Historico'
import HomeScreen from './Home'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Historico" component={Historico} />
     </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: '#ecf0f1',
  padding: 8,
  },
  paragraph: {
  margin: 24,
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  },
});