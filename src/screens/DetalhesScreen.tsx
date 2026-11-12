import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video'; // <-- Nova biblioteca
import { excluirMeuPet, atualizarMeuPet } from '../services/storage';

// Componente separado para o Vídeo
const MidiaVideo = ({ url }: { url: string }) => {
  const player = useVideoPlayer(url, player => {
    player.loop = true;
  });

  return (
    <VideoView 
      style={styles.imagem} 
      player={player} 
      nativeControls 
      contentFit="cover"
    />
  );
};
export default function DetalhesScreen({ route, navigation }: any) {
  const { pet } = route.params;
  const isMeuPet = !pet.id.startsWith('api-');

  const abrirMapa = () => {
    if (pet.latitude && pet.longitude) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${pet.latitude},${pet.longitude}`);
    }
  };

  const handleExcluir = () => {
    Alert.alert('Excluir Pet', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await excluirMeuPet(pet.id);
        navigation.goBack();
      }}
    ]);
  };

  const handleMarcarAdotado = async () => {
    await atualizarMeuPet({ ...pet, situacao: 'Adotado' });
    navigation.goBack();
  };

  const estiloBotaoVoltar = Platform.select({
    ios: { backgroundColor: '#1976d2' },
    android: { backgroundColor: '#388e3c' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Carrossel de Mídias */}
        <FlatList
          horizontal
          data={pet.midias || [{ url: pet.fotoUrl, tipo: 'imagem' }]}
          keyExtractor={(item: any, index: number) => index.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => (
            <View style={{ width: 400, height: 300 }}>
              {item.tipo === 'video' ? (
                <MidiaVideo url={item.url} /> // <-- Usa o componente novo
              ) : (
                <Image source={{ uri: item.url }} style={styles.imagem} />
              )}
            </View>
          )}
        />

        <View style={styles.content}>
          <Text style={styles.nome}>{pet.nome}</Text>
          <Text style={styles.situacao}>{pet.situacao}</Text>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.texto}>{pet.descricao}</Text>
          <Text style={styles.label}>Contato:</Text>
          <Text style={styles.texto}>{pet.contato}</Text>

          {pet.latitude && (
            <TouchableOpacity style={styles.btnMapa} onPress={abrirMapa}>
              <Text style={styles.btnMapaText}>📍 Ver Localização no Mapa</Text>
            </TouchableOpacity>
          )}

          {isMeuPet && (
            <View style={styles.areaAdmin}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => navigation.navigate('Editar', { pet })}>
                <Text style={styles.btnAdminText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAdotado} onPress={handleMarcarAdotado}>
                <Text style={styles.btnAdminText}>✅ Marcar como Adotado</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
                <Text style={styles.btnAdminText}>🗑️ Excluir</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={[styles.btnVoltar, estiloBotaoVoltar]} onPress={() => navigation.goBack()}>
            <Text style={styles.btnVoltarText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagem: { width: 400, height: 300 },
  content: { padding: 20 },
  nome: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  situacao: { fontSize: 16, color: '#1976d2', fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 15, marginBottom: 5 },
  texto: { fontSize: 16, color: '#666' },
  btnMapa: { backgroundColor: '#e3f2fd', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  btnMapaText: { color: '#1976d2', fontWeight: 'bold' },
  areaAdmin: { marginTop: 30, paddingTop: 20, borderTopWidth: 1, borderColor: '#eee' },
  btnEditar: { backgroundColor: '#f57c00', padding: 15, borderRadius: 8, marginBottom: 10 },
  btnAdotado: { backgroundColor: '#388e3c', padding: 15, borderRadius: 8, marginBottom: 10 },
  btnExcluir: { backgroundColor: '#d32f2f', padding: 15, borderRadius: 8, marginBottom: 20 },
  btnAdminText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  btnVoltar: { padding: 15, borderRadius: 8, alignItems: 'center' },
  btnVoltarText: { color: '#fff', fontWeight: 'bold' },
});