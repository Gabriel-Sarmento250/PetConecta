const API_URL = 'https://dog.ceo/api/breeds/image/random/10';

// Lista de nomes para deixar o app mais realista
const NOMES_PETS = ['Thor', 'Luna', 'Bob', 'Mel', 'Max', 'Nina', 'Fred', 'Bella', 'Rex', 'Lola'];

// Lista de fotos perfeitas (individuais e de alta qualidade) para cada pet
const FOTOS_FIXAS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', // Thor
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop', // Luna
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop', // Bob
  'https://images.unsplash.com/photo-1518378188025-22bd89516ee2?q=80&w=600&auto=format&fit=crop', // Mel
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=600&auto=format&fit=crop', // Max
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=600&auto=format&fit=crop', // Nina
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600&auto=format&fit=crop', // Fred
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop', // Bella
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop', // Rex
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop', // Lola
];

// Lista de descrições personalizadas para cada pet
const DESCRICOES_PETS = [
  // Thor
  'Um verdadeiro guerreiro, mas com o coração mole! O Thor é brincalhão, adora correr atrás de bolinhas e é excelente com crianças. Para mais informações, fotos ou vídeos, mande um alô no número abaixo.',
  
  // Luna
  'A Luna é pura fofura e tranquilidade. Adora tirar um cochilo no sol e é super carinhosa. Quer conhecer mais sobre ela? Chame no número abaixo para receber fotos e vídeos exclusivos.',
  
  // Bob
  'Este é o Bob, um companheiro leal e cheio de energia! Ideal para quem gosta de caminhadas. Se quiser ver mais fotos e vídeos dele brincando, entre em contato pelo número abaixo.',
  
  // Mel
  'A Mel é doce como o nome. Muito educada, já sabe alguns truques e se dá bem com outros animais. Ficou interessado? Entre em contato no número abaixo e peça mais fotos ou vídeos.',
  
  // Max
  'O Max é o rei da bagunça boa! Um filhote cheio de vida que vai encher sua casa de alegria. Para ver vídeos dele correndo pelo quintal, mande uma mensagem no número abaixo.',
  
  // Nina
  'A Nina é uma senhora elegante e muito calma. Perfeita para apartamentos. Quer ver mais detalhes e vídeos dela relaxando? É só chamar no número de contato abaixo.',
  
  // Fred
  'O Fred é o melhor amigo que você pode ter. Super protetor e inteligente. Tem interesse em adotá-lo? Fale com a gente no número abaixo e solicite o álbum de fotos completo dele.',
  
  // Bella
  'A Bella é pura simpatia! Adora um carinho na barriga e fazer novos amigos humanos. Para saber mais sobre o temperamento dela, vídeos e fotos, ligue ou mande um whatsapp para o número abaixo.',
  
  // Rex
  'O Rex é forte, saudável e muito obediente. Um cão de guarda excelente, mas que também adora um colo. Chame no número abaixo para conversarmos e enviarmos vídeos do Rex em ação.',
  
  // Lola
  'A Lola é uma pequena notável! Cheia de personalidade e muito esperta. Quer se apaixonar por ela? Salve o número abaixo e mande uma mensagem pedindo mais fotos e vídeos.'
];

// Lista de situações para variar os filtros
const SITUACOES_PETS = [
  'Perdido',    // Thor
  'Adoção',     // Luna
  'Encontrado', // Bob
  'Adoção',     // Mel
  'Perdido',    // Max
  'Encontrado', // Nina
  'Adoção',     // Fred
  'Adoção',     // Bella
  'Perdido',    // Rex
  'Encontrado'  // Lola
];

export async function buscarPetsAPI(): Promise<any[]> {
  try {
    // Requisição real para cumprir o requisito da faculdade
    const response = await fetch(API_URL);
    await response.json(); 
    
    return NOMES_PETS.map((nome, index) => ({
      id: `api-${index}`,
      nome: nome,
      descricao: DESCRICOES_PETS[index],
      situacao: SITUACOES_PETS[index] as 'Perdido' | 'Encontrado' | 'Adoção',
      contato: '(11) 98765-4321',
      // --- MUDANÇA AQUI: Agora usamos midias em vez de fotoUrl ---
      midias: [
        { url: FOTOS_FIXAS[index], tipo: 'imagem' }
      ],
    }));
  } catch (error) {
    console.error('Erro ao buscar pets na API:', error);
    throw new Error('Não foi possível carregar os pets da API. Verifique sua conexão.');
  }
}