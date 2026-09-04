export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface Article {
  id: string;
  title: string;
  originalTitle?: string;
  source: string;
  region: string;
  topic: string;
  country: string;
  language: string;
  sourceUrl: string;
  publishedAt: string;
  sourceTimezone: string;
  summary: string;
  biasScore: number; // -100 to +100
  biasDirection: 'left_multilateral' | 'right_nationalist' | 'center_factual';
  detectedKeywords: string[];
  aheadDaHora: boolean;
  hasInconsistencyStamp?: boolean;
  inconsistencyDetails?: {
    date: string;
    agency: string;
    verdict: string;
    historicalWarning: string;
  };
  capyMatrix?: {
    factualConsensus: string;
    narrativeA: {
      source: string;
      stance: string;
      quote: string;
    };
    narrativeB: {
      source: string;
      stance: string;
      quote: string;
    };
    gsScore: number;
  };
}

export interface UserProfile {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  role: 'admin' | 'editor' | 'reader' | 'guest';
  tier: 'Guest' | 'Free' | 'Premium';
  verified?: boolean;
  status?: string;
  location?: {
    country: string;
    city?: string;
    region?: string;
    code?: string;
    timezone: string;
    isUtcNegative?: boolean;
  };
  device: 'mobile' | 'desktop' | 'tablet';
  preferredTopics?: string[];
  preferredRegions?: string[];
  readCount?: number;
  communityNotesCount?: number;
  joinedAt?: string;
  lastActive?: string;
}

export interface WeatherForecastDay {
  day: string;
  min: number;
  max: number;
  code: string;
  label: string;
}

export interface WeatherCity {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  apparentTemperature?: number;
  unit: string;
  condition: string;
  conditionCode: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
  humidity: number;
  windSpeed: string;
  windDirection?: number;
  pressure?: number;
  uvIndex?: number;
  elevation?: number;
  timezone: string;
  weatherCode?: number;
  imageTheme?: 'hot_tropical' | 'polar_freeze' | 'mild_temperate' | 'rain_storm' | 'cloudy_overcast';
  themeBadge?: string;
  themeDescription?: string;
  forecast?: WeatherForecastDay[];
}

export interface BiasScanResult {
  biasScore: number;
  direction: string;
  leftMagnitude: number;
  rightMagnitude: number;
  centerMagnitude: number;
  detectedKeywords: { word: string; weight: number; category: string }[];
  confidence: number;
}

export interface DemandGap {
  country: string;
  userCount: number;
  activeSources: number;
  recommendedSources: string[];
  gapScore: 'High' | 'Medium' | 'Low';
  notes: string;
}
