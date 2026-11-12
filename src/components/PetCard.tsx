import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '../types/Pet';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
  onFavoritar: () => void;
}

export function PetCard({ pet, onPress, onFavoritar }: PetCardProps) {
  // Verifica se tem mídia, se a primeira é vídeo, etc.
  const primeiraMidia = pet.midias && pet.midias.length > 0 ? pet.midias[0] : null;
  const isVideo = primeiraMidia?.tipo === 'video';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {isVideo ? (
        <View style={[styles.imagem, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#fff', fontSize: 40 }}>▶</Text>
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 10 }}>Vídeo</Text>
        </View>
      ) : (
        <Image source={{ uri: primeiraMidia?.url }} style={styles.imagem} />
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{pet.nome}</Text>
        <Text style={styles.situacao}>{pet.situacao}</Text>
        <TouchableOpacity onPress={onFavoritar} style={styles.botaoFavorito}>
          <Text style={{ fontSize: 20 }}>{pet.isFavorito ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  imagem: { width: '100%', height: 180 },
  infoContainer: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  situacao: { fontSize: 14, color: '#666', backgroundColor: '#e0e0e0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  botaoFavorito: { padding: 8 },
});