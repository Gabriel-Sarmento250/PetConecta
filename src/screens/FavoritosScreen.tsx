import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { obterFavoritos, salvarFavoritos } from '../services/storage';
import { Pet } from '../types/Pet';
import { PetCard } from '../components/PetCard';

export default function FavoritosScreen({ navigation }: any) {
  const [favoritos, setFavoritos] = useState<Pet[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  async function carregarFavoritos() {
    const favs = await obterFavoritos();
    setFavoritos(favs);
  }

  async function removerFavorito(pet: Pet) {
    const novosFavoritos = favoritos.filter(f => f.id !== pet.id);
    await salvarFavoritos(novosFavoritos);
    setFavoritos(novosFavoritos);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Meus Favoritos ❤️</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard 
            pet={item} 
            onPress={() => navigation.navigate('Detalhes', { pet: item })}
            onFavoritar={() => removerFavorito(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Você ainda não tem pets favoritos.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', padding: 16, color: '#333' },
  vazio: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
});