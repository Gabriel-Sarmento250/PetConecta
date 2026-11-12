export type TipoMidia = 'imagem' | 'video';

export interface Midia {
  url: string;
  tipo: TipoMidia;
}

export interface Pet {
  id: string;
  nome: string;
  descricao: string;
  situacao: 'Perdido' | 'Encontrado' | 'Adoção' | 'Adotado';
  contato: string;
  midias: Midia[]; 
  latitude?: number;
  longitude?: number;
  isFavorito?: boolean;
}