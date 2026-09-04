import { Language } from '../types.ts';

export interface TranslationDict {
  appTitle: string;
  tagline: string;
  subTagline: string;
  aheadBadge: string;
  aheadSubtitle: string;
  capyScanBtn: string;
  capyMatrixBtn: string;
  readSourceBtn: string;
  searchPlaceholder: string;
  noResults: string;
  weatherTitle: string;
  weatherSubtitle: string;
  weatherClose: string;
  allRegions: string;
  allTopics: string;
  filterAheadOnly: string;
  filterAll: string;
  aboutUs: string;
  manifestoBtn: string;
  adminDashboard: string;
  logout: string;
  login: string;
  speedometerLeft: string;
  speedometerCenter: string;
  speedometerRight: string;
  detectedTerms: string;
  factualConsensus: string;
  exclusiveNarrativeA: string;
  exclusiveNarrativeB: string;
  close: string;
  guestStatus: string;
  anonymousWarning: string;
  inconsistencyAlert: string;
  initiativeDraft: string;
  regions: Record<string, string>;
  topics: Record<string, string>;
}

export const translations: Record<Language, TranslationDict> = {
  pt: {
    appTitle: 'CapyNews',
    tagline: 'CapyNews — Agregador de Notícias',
    subTagline: 'Desarmando bolhas, cruzando narrativas e quebrando o "shitty flow" com análise factual independente.',
    aheadBadge: 'AHEAD DA HORA',
    aheadSubtitle: 'Notícia publicada em fuso adiantado (Ásia / Oceania)',
    capyScanBtn: 'CapyScan Viés',
    capyMatrixBtn: 'Ver Cruzamentos CapyMatrix',
    readSourceBtn: 'Fonte Original',
    searchPlaceholder: 'Buscar fatos, veículos, tópicos ou palavras-chave...',
    noResults: 'Nenhuma matéria encontrada com os filtros selecionados.',
    weatherTitle: 'Radar Meteorológico Global',
    weatherSubtitle: 'Condições atmosféricas e climáticas nos principais centros mundiais',
    weatherClose: 'Fechar Mapa',
    allRegions: 'Todas as Regiões',
    allTopics: 'Todos os Tópicos',
    filterAheadOnly: 'Somente Ahead da Hora',
    filterAll: 'Todas as Notícias',
    aboutUs: 'Quem Somos / Manifesto',
    manifestoBtn: 'Doutrina de Autonomia',
    adminDashboard: 'Painel Admin',
    logout: 'Sair',
    login: 'Entrar',
    speedometerLeft: 'Multilateral / Progressista (Azul)',
    speedometerCenter: 'Consenso Factual (Centro)',
    speedometerRight: 'Nacionalista / Soberanista (Vermelho)',
    detectedTerms: 'Termos Léxicos Detectados',
    factualConsensus: 'Consenso Factual (Dados Validados Simultaneamente)',
    exclusiveNarrativeA: 'Veículo A (Narrativa Exclusiva)',
    exclusiveNarrativeB: 'Veículo B (Narrativa Exclusiva)',
    close: 'Fechar',
    guestStatus: 'Modo Anônimo',
    anonymousWarning: 'Identificação de fuso horário desativada para manter anonimato.',
    inconsistencyAlert: 'Selo Retroativo Permanente de Inconsistência',
    initiativeDraft: 'Uma iniciativa Draft Creative Studio Ltda',
    regions: {
      'Global': 'Global',
      'Europe': 'Europa',
      'América do Norte': 'América do Norte',
      'América do Sul': 'América do Sul',
      'Ásia & Oriente Médio': 'Ásia & Oriente Médio',
      'Oceania': 'Oceania',
      'África': 'África',
      'Antártica': 'Antártica'
    },
    topics: {
      'Business & Finance': 'Negócios & Finanças',
      'Tech & AI': 'Tech & IA',
      'Space & Cosmos': 'Espaço & Cosmos',
      'Science': 'Ciência',
      'Green & Planet': 'Planeta & Meio Ambiente',
      'Health & Wellness': 'Saúde & Bem-Estar',
      'Culture & Arts': 'Cultura & Artes',
      'Design & Architecture': 'Design & Arquitetura',
      'Lifestyle': 'Estilo de Vida',
      'Gaming & Sports': 'Games & Esportes',
      'Mobility & Auto': 'Mobilidade & Automotivo'
    }
  },
  en: {
    appTitle: 'CapyNews',
    tagline: 'CapyNews — Global News Aggregator',
    subTagline: 'Disarming bubbles, cross-referencing narratives and shattering the "shitty flow" through independent data.',
    aheadBadge: 'AHEAD OF TIME',
    aheadSubtitle: 'Article published in advanced timezone (Asia / Oceania)',
    capyScanBtn: 'CapyScan Bias',
    capyMatrixBtn: 'Explore CapyMatrix Crossings',
    readSourceBtn: 'Original Source',
    searchPlaceholder: 'Search facts, publishers, topics, or keywords...',
    noResults: 'No news articles found matching your criteria.',
    weatherTitle: 'Global Meteorological Radar',
    weatherSubtitle: 'Atmospheric and temperature conditions across worldwide hubs',
    weatherClose: 'Close Map',
    allRegions: 'All Regions',
    allTopics: 'All Topics',
    filterAheadOnly: 'Ahead of Time Only',
    filterAll: 'All News',
    aboutUs: 'About Us / Manifesto',
    manifestoBtn: 'Doctrine of Autonomy',
    adminDashboard: 'Admin Panel',
    logout: 'Sign Out',
    login: 'Sign In',
    speedometerLeft: 'Multilateral / Progressive (Blue)',
    speedometerCenter: 'Factual Consensus (Center)',
    speedometerRight: 'Nationalist / Sovereign (Red)',
    detectedTerms: 'Detected Lexical Markers',
    factualConsensus: 'Factual Consensus (Cross-Validated Data)',
    exclusiveNarrativeA: 'Outlet A (Exclusive Framing)',
    exclusiveNarrativeB: 'Outlet B (Exclusive Framing)',
    close: 'Close',
    guestStatus: 'Anonymous Mode',
    anonymousWarning: 'Timezone identification paused to maintain privacy.',
    inconsistencyAlert: 'Permanent Retroactive Inconsistency Stamp',
    initiativeDraft: 'An initiative by Draft Creative Studio Ltda',
    regions: {
      'Global': 'Global',
      'Europe': 'Europe',
      'América do Norte': 'North America',
      'América do Sul': 'South America',
      'Ásia & Oriente Médio': 'Asia & Middle East',
      'Oceania': 'Oceania',
      'África': 'Africa',
      'Antártica': 'Antarctica'
    },
    topics: {
      'Business & Finance': 'Business & Finance',
      'Tech & AI': 'Tech & AI',
      'Space & Cosmos': 'Space & Cosmos',
      'Science': 'Science',
      'Green & Planet': 'Green & Planet',
      'Health & Wellness': 'Health & Wellness',
      'Culture & Arts': 'Culture & Arts',
      'Design & Architecture': 'Design & Architecture',
      'Lifestyle': 'Lifestyle',
      'Gaming & Sports': 'Gaming & Sports',
      'Mobility & Auto': 'Mobility & Auto'
    }
  },
  es: {
    appTitle: 'CapyNews',
    tagline: 'CapyNews — Agregador de Noticias',
    subTagline: 'Desarmando burbujas, cruzando narrativas y rompiendo el "shitty flow" con análisis factual independiente.',
    aheadBadge: 'ADELANTO HORARIO',
    aheadSubtitle: 'Noticia publicada en huso horario adelantado (Asia / Oceanía)',
    capyScanBtn: 'CapyScan Sesgo',
    capyMatrixBtn: 'Ver Cruces CapyMatrix',
    readSourceBtn: 'Fuente Original',
    searchPlaceholder: 'Buscar hechos, medios, temas o palabras clave...',
    noResults: 'No se encontraron artículos con los filtros seleccionados.',
    weatherTitle: 'Radar Meteorológico Global',
    weatherSubtitle: 'Condiciones climáticas en los principales nodos mundiales',
    weatherClose: 'Cerrar Mapa',
    allRegions: 'Todas las Regiones',
    allTopics: 'Todos los Temas',
    filterAheadOnly: 'Solo Adelanto Horario',
    filterAll: 'Todas las Noticias',
    aboutUs: 'Quiénes Somos / Manifiesto',
    manifestoBtn: 'Doctrina de Autonomía',
    adminDashboard: 'Panel Admin',
    logout: 'Salir',
    login: 'Ingresar',
    speedometerLeft: 'Multilateral / Progresista (Azul)',
    speedometerCenter: 'Consenso Factual (Centro)',
    speedometerRight: 'Nacionalista / Soberanista (Rojo)',
    detectedTerms: 'Términos Léxicos Detectados',
    factualConsensus: 'Consenso Factual (Datos Validados Simultáneamente)',
    exclusiveNarrativeA: 'Medio A (Narrativa Exclusiva)',
    exclusiveNarrativeB: 'Medio B (Narrativa Exclusiva)',
    close: 'Cerrar',
    guestStatus: 'Modo Anónimo',
    anonymousWarning: 'Identificación horaria desactivada para preservar privacidad.',
    inconsistencyAlert: 'Sello Retroactivo Permanente de Inconsistencia',
    initiativeDraft: 'Una iniciativa de Draft Creative Studio Ltda',
    regions: {
      'Global': 'Global',
      'Europe': 'Europa',
      'América do Norte': 'Norteamérica',
      'América do Sul': 'Sudamérica',
      'Ásia & Oriente Médio': 'Asia y Medio Oriente',
      'Oceania': 'Oceanía',
      'África': 'África',
      'Antártica': 'Antártida'
    },
    topics: {
      'Business & Finance': 'Negocios y Finanzas',
      'Tech & AI': 'Tecnología e IA',
      'Space & Cosmos': 'Espacio y Cosmos',
      'Science': 'Ciencia',
      'Green & Planet': 'Planeta y Ecología',
      'Health & Wellness': 'Salud y Bienestar',
      'Culture & Arts': 'Cultura y Artes',
      'Design & Architecture': 'Diseño y Arquitectura',
      'Lifestyle': 'Estilo de Vida',
      'Gaming & Sports': 'Videojuegos y Deportes',
      'Mobility & Auto': 'Movilidad y Autos'
    }
  },
  fr: {
    appTitle: 'CapyNews',
    tagline: 'CapyNews — Agrégateur d’Actualités',
    subTagline: 'Désarmer les bulles, croiser les récits et briser le "shitty flow" grâce aux données factuelles.',
    aheadBadge: 'EN AVANCE',
    aheadSubtitle: 'Article publié sur un fuseau horaire avancé (Asie / Océanie)',
    capyScanBtn: 'Biais CapyScan',
    capyMatrixBtn: 'Croisements CapyMatrix',
    readSourceBtn: 'Source Originale',
    searchPlaceholder: 'Rechercher des faits, médias, thématiques...',
    noResults: 'Aucun article trouvé avec les filtres actuels.',
    weatherTitle: 'Radar Météorologique Mondial',
    weatherSubtitle: 'Conditions atmosphériques et thermiques des métropoles',
    weatherClose: 'Fermer la Carte',
    allRegions: 'Toutes les Régions',
    allTopics: 'Tous les Sujets',
    filterAheadOnly: 'Uniquement en Avance',
    filterAll: 'Toutes les Nouvelles',
    aboutUs: 'À Propos / Manifeste',
    manifestoBtn: 'Doctrine d’Autonomie',
    adminDashboard: 'Panneau Admin',
    logout: 'Déconnexion',
    login: 'Connexion',
    speedometerLeft: 'Multilatéral / Progressiste (Bleu)',
    speedometerCenter: 'Consensus Factuel (Centre)',
    speedometerRight: 'Nationaliste / Souverainiste (Rouge)',
    detectedTerms: 'Marqueurs Lexicaux Détectés',
    factualConsensus: 'Consensus Factuel (Données Validées par Croisement)',
    exclusiveNarrativeA: 'Média A (Cadrage Exclusif)',
    exclusiveNarrativeB: 'Média B (Cadrage Exclusif)',
    close: 'Fermer',
    guestStatus: 'Mode Anonyme',
    anonymousWarning: 'Identification horaire suspendue pour préserver l’anonymat.',
    inconsistencyAlert: 'Sceau Rétroactif Permanent d’Incohérence',
    initiativeDraft: 'Une initiative de Draft Creative Studio Ltda',
    regions: {
      'Global': 'Global',
      'Europe': 'Europe',
      'América do Norte': 'Amérique du Nord',
      'América do Sul': 'Amérique du Sud',
      'Ásia & Oriente Médio': 'Asie & Moyen-Orient',
      'Oceania': 'Océanie',
      'África': 'Afrique',
      'Antártica': 'Antarctique'
    },
    topics: {
      'Business & Finance': 'Économie & Finance',
      'Tech & AI': 'Tech & IA',
      'Space & Cosmos': 'Espace & Cosmos',
      'Science': 'Sciences',
      'Green & Planet': 'Planète & Écologie',
      'Health & Wellness': 'Santé & Bien-être',
      'Culture & Arts': 'Culture & Arts',
      'Design & Architecture': 'Design & Architecture',
      'Lifestyle': 'Mode de Vie',
      'Gaming & Sports': 'Jeux Vidéo & Sports',
      'Mobility & Auto': 'Mobilité & Auto'
    }
  }
};
