import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Pet } from '../types/Pet';
import { buscarPetsAPI } from '../services/api';
import { obterFavoritos, salvarFavoritos, obterMeusPets } from '../services/storage';
import { PetCard } from '../components/PetCard';

export default function HomeScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('');
  
  // --- NOVO ESTADO DO FILTRO DE SITUAÇÃO ---
  const [filtroSituacao, setFiltroSituacao] = useState<'Todos' | 'Perdido' | 'Encontrado' | 'Adoção'>('Todos');

  // --- ADICIONADO useFocusEffect ---
  // Ele substitui o useEffect para atualizar a lista sempre que voltar para a Home
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro('');
      const dadosAPI = await buscarPetsAPI();
      
      // --- NOVO: Busca os pets que o usuário cadastrou manualmente ---
      const meusPets = await obterMeusPets();
      
      const favoritos = await obterFavoritos();

      // --- NOVO: Junta os pets da API com os cadastrados ---
      const todosOsPets = [...dadosAPI, ...meusPets];

      const petsComFavoritos = todosOsPets.map(pet => ({
        ...pet,
        isFavorito: favoritos.some(fav => fav.id === pet.id)
      }));

      setPets(petsComFavoritos);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function toggleFavorito(pet: Pet) {
    let favoritos = await obterFavoritos();
    
    if (pet.isFavorito) {
      favoritos = favoritos.filter(f => f.id !== pet.id);
    } else {
      favoritos.push({ ...pet, isFavorito: true });
    }
    
    await salvarFavoritos(favoritos);
    setPets(pets.map(p => p.id === pet.id ? { ...p, isFavorito: !p.isFavorito } : p));
  }

  // --- NOVA LÓGICA DE FILTRAGEM ---
  const petsFiltrados = pets.filter(pet => {
    // 1. Filtro por texto (nome)
    const matchBusca = pet.nome.toLowerCase().includes(filtro.toLowerCase());
    
    // 2. Filtro por situação (Perdido, Encontrado, Adoção)
    const matchSituacao = filtroSituacao === 'Todos' ? true : pet.situacao === filtroSituacao;
    
    return matchBusca && matchSituacao;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>PetConecta</Text>
        <View style={styles.botoesHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
            <Text style={styles.btnHeader}>❤️ Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastrar')}>
            <Text style={styles.btnHeader}>➕ Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput 
        style={styles.inputBusca} 
        placeholder="Buscar pet por nome..." 
        value={filtro}
        onChangeText={setFiltro}
      />

      {/* --- NOVA BARRA DE FILTROS --- */}
      <View style={{ marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosContainer}>
          {['Todos', 'Perdido', 'Encontrado', 'Adoção'].map((f) => (
            <TouchableOpacity 
              key={f}
              style={[styles.btnFiltro, filtroSituacao === f && styles.btnFiltroAtivo]}
              onPress={() => setFiltroSituacao(f as any)}
            >
              <Text style={[styles.filtroText, filtroSituacao === f && styles.filtroTextAtivo]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* --------------------------- */}

      {carregando ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1976d2" /></View>
      ) : erro ? (
        <View style={styles.center}><Text style={styles.erroText}>{erro}</Text></View>
      ) : (
        <FlatList
          data={petsFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard 
              pet={item} 
              onPress={() => navigation.navigate('Detalhes', { pet: item })}
              onFavoritar={() => toggleFavorito(item)}
            />
          )}
          ListEmptyComponent={<Text style={styles.center}>Nenhum pet encontrado com esses filtros.</Text>}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1976d2' },
  botoesHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnHeader: { fontSize: 16, color: '#1976d2', fontWeight: 'bold' },
  inputBusca: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, marginBottom: 10, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  
  // --- NOVOS ESTILOS DOS FILTROS ---
  filtrosContainer: { paddingHorizontal: 16, gap: 8 },
  btnFiltro: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', borderWidth: 1, borderColor: '#d0d0d0' },
  btnFiltroAtivo: { backgroundColor: '#1976d2', borderColor: '#1976d2' },
  filtroText: { fontSize: 14, color: '#555', fontWeight: '500' },
  filtroTextAtivo: { color: '#fff', fontWeight: 'bold' },
  // --------------------------------

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  erroText: { color: 'red', fontSize: 16, textAlign: 'center' }
});