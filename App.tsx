import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import CadastrarScreen from './src/screens/CadastrarScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import EditarScreen from './src/screens/EditarScreen'; // <-- TEM QUE ESTAR AQUI

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do Pet' }} />
          
          {/* TEM QUE ESTAR AQUI */}
          <Stack.Screen name="Editar" component={EditarScreen} options={{ title: 'Editar Pet' }} />
          
          <Stack.Screen name="Cadastrar" component={CadastrarScreen} options={{ title: 'Cadastrar Pet' }} />
          <Stack.Screen name="Favoritos" component={FavoritosScreen} options={{ title: 'Favoritos' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}