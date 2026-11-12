import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { atualizarMeuPet } from '../services/storage';
import { Midia } from '../types/Pet';

export default function EditarScreen({ route, navigation }: any) {
  const { pet } = route.params;

  const [nome, setNome] = useState(pet.nome);
  const [descricao, setDescricao] = useState(pet.descricao);
  const [contato, setContato] = useState(pet.contato);
  const [situacao, setSituacao] = useState(pet.situacao);
  const [midias, setMidias] = useState<Midia[]>(pet.midias || []);

  async function escolherMidia() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });

    if (!result.canceled) {
      const novasMidias: Midia[] = result.assets.map(asset => ({
        url: asset.uri,
        tipo: asset.type === 'video' ? 'video' : 'imagem',
      }));
      setMidias([...midias, ...novasMidias]);
    }
  }

  function removerMidia(index: number) {
    setMidias(midias.filter((_, i) => i !== index));
  }

  function validarContato(texto: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (emailRegex.test(texto)) return 'email';
    if (telefoneRegex.test(texto)) return 'telefone';
    return 'invalido';
  }

  async function salvarEdicao() {
    if (!nome.trim() || !descricao.trim() || !contato.trim() || midias.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (validarContato(contato) === 'invalido') {
      Alert.alert('Contato Inválido', 'Digite um telefone válido com DDD ou um e-mail válido.');
      return;
    }

    const petAtualizado = {
      ...pet,
      nome, descricao, contato, situacao, midias
    };

    try {
      await atualizarMeuPet(petAtualizado);
      Alert.alert('Sucesso', 'Pet atualizado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Editar Pet</Text>

        <TouchableOpacity style={styles.fotoContainer} onPress={escolherMidia}>
          <Text style={styles.fotoTexto}>➕ Adicionar mais fotos/vídeos</Text>
        </TouchableOpacity>

        {midias.length > 0 && (
          <FlatList
            horizontal
            data={midias}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
            renderItem={({ item, index }) => (
              <View style={styles.fotoPreviewContainer}>
                {item.tipo === 'imagem' ? (
                  <Image source={{ uri: item.url }} style={styles.fotoPreview} />
                ) : (
                  <View style={[styles.fotoPreview, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' }]}>
                    <Text style={{ color: '#fff', fontSize: 30 }}>▶</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.btnRemoverFoto} onPress={() => removerMidia(index)}>
                  <Text style={styles.btnRemoverFotoText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
        <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Descrição" multiline />
        <TextInput style={styles.input} value={contato} onChangeText={setContato} placeholder="Contato" />

        <Text style={styles.label}>Situação:</Text>
        <View style={styles.row}>
          {['Perdido', 'Encontrado', 'Adoção', 'Adotado'].map((s) => (
            <TouchableOpacity key={s} style={[styles.btnSituacao, situacao === s && styles.btnSituacaoAtivo]} onPress={() => setSituacao(s as any)}>
              <Text style={{ color: situacao === s ? '#fff' : '#333', fontSize: 12 }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnSalvar} onPress={salvarEdicao}>
          <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  fotoContainer: { height: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 15 },
  fotoTexto: { color: '#1976d2', fontSize: 16, fontWeight: 'bold' },
  fotoPreviewContainer: { marginRight: 10, position: 'relative' },
  fotoPreview: { width: 100, height: 100, borderRadius: 8 },
  btnRemoverFoto: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  btnRemoverFotoText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  btnSituacao: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, marginHorizontal: 2 },
  btnSituacaoAtivo: { backgroundColor: '#1976d2' },
  btnSalvar: { backgroundColor: '#1976d2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnSalvarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});