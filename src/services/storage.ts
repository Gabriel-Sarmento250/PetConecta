import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/Pet';

const FAVORITOS_KEY = '@petconecta:favoritos';
const MEUS_PETS_KEY = '@petconecta:meus_pets';

export const salvarFavoritos = async (favoritos: Pet[]) => {
  await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
};

export const obterFavoritos = async (): Promise<Pet[]> => {
  const data = await AsyncStorage.getItem(FAVORITOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const salvarMeusPets = async (pets: Pet[]) => {
  await AsyncStorage.setItem(MEUS_PETS_KEY, JSON.stringify(pets));
};

export const obterMeusPets = async (): Promise<Pet[]> => {
  const data = await AsyncStorage.getItem(MEUS_PETS_KEY);
  return data ? JSON.parse(data) : [];
};

// --- NOVAS FUNÇÕES ADICIONADAS ---

export const excluirMeuPet = async (petId: string) => {
  const meusPets = await obterMeusPets();
  const petsAtualizados = meusPets.filter(pet => pet.id !== petId);
  await salvarMeusPets(petsAtualizados);
};

export const atualizarMeuPet = async (petAtualizado: Pet) => {
  const meusPets = await obterMeusPets();
  const petsAtualizados = meusPets.map(pet => 
    pet.id === petAtualizado.id ? petAtualizado : pet
  );
  await salvarMeusPets(petsAtualizados);
};