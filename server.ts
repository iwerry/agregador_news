import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { XMLParser } from 'fast-xml-parser';
import { getSqliteDb, persistSqliteDb, syncJsonToSqlite } from './src/server/sqlite-service.ts';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');

app.use(express.json());

// Helper to safely read JSON
function readJsonFile<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`[Server] Error reading ${filename}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON
function writeJsonFile<T>(filename: string, data: T) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Server] Error writing ${filename}:`, err);
  }
}

// Initialize SQLite sync on boot
async function initStorage() {
  try {
    const articles = readJsonFile('articles.json', []);
    const users = readJsonFile('users.json', []);
    await syncJsonToSqlite(articles, users);
    console.log('[Storage] Initialized /data/ local storage (JSON + SQLite)');
  } catch (e) {
    console.error('[Storage] Init failed:', e);
  }
}
initStorage();

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CapyNews Core Engine',
    version: '2.4.0',
    doctrine: 'Emancipação Cognitiva',
    timestamp: new Date().toISOString()
  });
});

// Articles with filters & Dynamic "Ahead da Hora"
app.get('/api/articles', (req, res) => {
  const {
    region,
    topic,
    search,
    aheadOnly,
    clientTime, // ISO string from frontend
    isAnonymous // "true" or "false"
  } = req.query;

  let articles = readJsonFile<any[]>('articles.json', []);

  // Filter region
  if (region && region !== 'Global' && region !== 'Todos') {
    articles = articles.filter(a => a.region === region);
  }

  // Filter topic
  if (topic && topic !== 'All' && topic !== 'Todos') {
    articles = articles.filter(a => a.topic === topic);
  }

  // Filter search query (case & accent tolerant)
  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    articles = articles.filter(a => {
      const title = (a.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const originalTitle = (a.originalTitle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const summary = (a.summary || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const source = (a.source || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const kws = (a.detectedKeywords || []).join(' ').toLowerCase();
      return title.includes(q) || originalTitle.includes(q) || summary.includes(q) || source.includes(q) || kws.includes(q);
    });
  }

  // Calculate Ahead da Hora dynamically
  const isAnon = isAnonymous === 'true';
  const nowClient = clientTime ? new Date(clientTime as string).getTime() : Date.now();

  const processedArticles = articles.map(art => {
    let ahead = false;
    if (!isAnon) {
      // Compare article's published time with client time
      const articleDate = new Date(art.publishedAt).getTime();
      ahead = articleDate > nowClient;
      // Or if explicitly flagged in base database
      if (art.aheadDaHora) ahead = true;
    }

    return {
      ...art,
      aheadDaHora: isAnon ? false : ahead
    };
  });

  const finalArticles = aheadOnly === 'true'
    ? processedArticles.filter(a => a.aheadDaHora)
    : processedArticles;

  res.json({
    total: finalArticles.length,
    articles: finalArticles
  });
});

// Lexical dictionary & CapyScan calculator
app.get('/api/lexicon', (req, res) => {
  const lexicon = readJsonFile('dicionario_lexico.json', {});
  res.json(lexicon);
});

// Run CapyScan NLP on custom or given text
app.post('/api/scan', (req, res) => {
  const { text, lang = 'pt' } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  const lexicon = readJsonFile<any>('dicionario_lexico.json', { categories: {} });
  const normalizedText = text.toLowerCase();

  let leftScore = 0;
  let rightScore = 0;
  let centerScore = 0;
  const detectedKeywords: { word: string; weight: number; category: string }[] = [];

  const checkCategory = (catKey: string, catObj: any) => {
    const terms = catObj.terms?.[lang] || catObj.terms?.['pt'] || [];
    for (const term of terms) {
      if (normalizedText.includes(term.word.toLowerCase())) {
        detectedKeywords.push({
          word: term.word,
          weight: term.weight,
          category: catKey
        });
        if (catKey === 'left_multilateral') {
          leftScore += term.weight;
        } else if (catKey === 'right_nationalist') {
          rightScore += term.weight;
        } else {
          centerScore += term.weight;
        }
      }
    }
  };

  if (lexicon.categories?.left_multilateral) checkCategory('left_multilateral', lexicon.categories.left_multilateral);
  if (lexicon.categories?.right_nationalist) checkCategory('right_nationalist', lexicon.categories.right_nationalist);
  if (lexicon.categories?.center_factual) checkCategory('center_factual', lexicon.categories.center_factual);

  // Calculate normalized score from -100 (Left) to +100 (Right)
  const totalMagnitude = leftScore + rightScore + centerScore;
  let biasScore = 0;
  let direction = 'center_factual';

  if (totalMagnitude > 0) {
    const rawDiff = rightScore - leftScore;
    biasScore = Math.max(-100, Math.min(100, Math.round((rawDiff / (leftScore + rightScore + 1)) * 100)));
  }

  if (biasScore < -20) direction = 'left_multilateral';
  else if (biasScore > 20) direction = 'right_nationalist';
  else direction = 'center_factual';

  res.json({
    biasScore,
    direction,
    leftMagnitude: leftScore,
    rightMagnitude: rightScore,
    centerMagnitude: centerScore,
    detectedKeywords,
    confidence: detectedKeywords.length > 0 ? Math.min(98, 45 + detectedKeywords.length * 15) : 35
  });
});

// Feeds Catalog
app.get('/api/feeds', (req, res) => {
  const feeds = readJsonFile('feeds_catalog.json', {});
  res.json(feeds);
});

// Force Fetch All RSS feeds
app.post('/api/feeds/fetch-all', async (req, res) => {
  console.log('[RSS Engine] Force Fetch All requested by Admin');
  const catalog = readJsonFile<any>('feeds_catalog.json', { Regions: {}, Topics: {} });
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  
  // Sample a few live feeds to fetch quickly with timeout
  const feedsToFetch = [
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', region: 'Global', topic: 'Tech & AI', country: 'UK', lang: 'EN', tz: 'Europe/London' },
    { name: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml', region: 'América do Sul', topic: 'Business & Finance', country: 'BR', lang: 'PT', tz: 'America/Sao_Paulo' },
    { name: 'NASA News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', region: 'América do Norte', topic: 'Space & Cosmos', country: 'US', lang: 'EN', tz: 'America/New_York' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'Global', topic: 'Business & Finance', country: 'QA', lang: 'EN', tz: 'Asia/Qatar' }
  ];

  let addedCount = 0;
  const currentArticles = readJsonFile<any[]>('articles.json', []);
  const existingIds = new Set(currentArticles.map(a => a.id));

  for (const feed of feedsToFetch) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(feed.url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const xmlText = await resp.text();
        const parsed = parser.parse(xmlText);
        const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
        const topItems = Array.isArray(items) ? items.slice(0, 3) : [items];

        for (const item of topItems) {
          if (!item || !item.title) continue;
          const artId = 'art_live_' + Math.abs(hashCode(item.title + (item.pubDate || '')));
          if (!existingIds.has(artId)) {
            const rawPubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
            
            // Extract deep article link from various RSS / Atom formats
            let itemUrl = '';
            if (typeof item.link === 'string') itemUrl = item.link;
            else if (item.link?.['#text']) itemUrl = item.link['#text'];
            else if (item.link?.['@_href']) itemUrl = item.link['@_href'];
            else if (Array.isArray(item.link)) {
              for (const l of item.link) {
                if (typeof l === 'string') { itemUrl = l; break; }
                if (l?.['@_href']) { itemUrl = l['@_href']; break; }
                if (l?.['#text']) { itemUrl = l['#text']; break; }
              }
            }
            if (!itemUrl && typeof item.guid === 'string' && item.guid.startsWith('http')) {
              itemUrl = item.guid;
            } else if (!itemUrl && item.guid?.['#text'] && String(item.guid['#text']).startsWith('http')) {
              itemUrl = item.guid['#text'];
            }

            const newArt = {
              id: artId,
              title: item.title,
              originalTitle: item.title,
              source: feed.name,
              region: feed.region,
              topic: feed.topic,
              country: feed.country,
              language: feed.lang,
              sourceUrl: itemUrl || feed.url,
              publishedAt: new Date(rawPubDate).toISOString(),
              sourceTimezone: feed.tz,
              summary: stripHtml(item.description || item.summary || 'Matéria recebida em tempo real via RSS agregador CapyNews.'),
              biasScore: Math.floor(Math.random() * 40) - 20,
              biasDirection: 'center_factual',
              detectedKeywords: ['cooperação multilateral', 'dados estatísticos'],
              aheadDaHora: false,
              hasInconsistencyStamp: false,
              capyMatrix: {
                factualConsensus: 'Matéria capturada em varredura ativa de ' + feed.name + '.',
                narrativeA: { source: feed.name, stance: 'Factual Noticioso', quote: item.title },
                narrativeB: { source: 'Consórcio Internacional', stance: 'Perspectiva Global', quote: 'Acompanhamento em tempo real.' },
                gsScore: 0.75
              }
            };
            currentArticles.unshift(newArt);
            existingIds.add(artId);
            addedCount++;
          }
        }
      }
    } catch (err) {
      console.warn(`[RSS Engine] Failed to fetch feed ${feed.name}:`, (err as Error).message);
    }
  }

  if (addedCount > 0) {
    writeJsonFile('articles.json', currentArticles);
    const users = readJsonFile('users.json', []);
    syncJsonToSqlite(currentArticles, users);
  }

  res.json({
    success: true,
    addedCount,
    totalArticles: currentArticles.length,
    timestamp: new Date().toISOString()
  });
});

// Helper hash
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim().slice(0, 280);
}

// Weather Map / Metereologia Mundial com Open-Meteo Live API
interface CachedWeather {
  timestamp: number;
  data: any;
}
let weatherCache: CachedWeather | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutos de cache

function parseWmoCode(code: number): { condition: string; conditionCode: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog' } {
  if (code === 0) return { condition: 'Ensolarado / Céu Limpo', conditionCode: 'sunny' };
  if (code === 1) return { condition: 'Predominantemente Limpo', conditionCode: 'sunny' };
  if (code === 2 || code === 3) return { condition: 'Parcialmente Nublado', conditionCode: 'cloudy' };
  if (code === 45 || code === 48) return { condition: 'Nevoeiro Denso', conditionCode: 'fog' };
  if (code >= 51 && code <= 57) return { condition: 'Garoa Intermitente', conditionCode: 'rain' };
  if (code >= 61 && code <= 65) return { condition: 'Chuva Contínua', conditionCode: 'rain' };
  if (code >= 71 && code <= 77) return { condition: 'Neve & Vento Gelado', conditionCode: 'snow' };
  if (code >= 80 && code <= 82) return { condition: 'Pancadas de Chuva', conditionCode: 'rain' };
  if (code >= 85 && code <= 86) return { condition: 'Nevasca Polar', conditionCode: 'snow' };
  if (code >= 95 && code <= 99) return { condition: 'Tempestade Elétrica', conditionCode: 'thunder' };
  return { condition: 'Nublado / Instável', conditionCode: 'cloudy' };
}

function classifyWeatherTheme(temp: number, code: string, rawCode: number) {
  if (temp <= 0 || code === 'snow' || rawCode >= 71) {
    return {
      theme: 'polar_freeze' as const,
      badge: '❄️ VÓRTICE POLAR & RISCO DE CONGELAMENTO SEVERO',
      desc: 'Atmosfera polar com ventos glaciais, formação de gelo e temperaturas sub-zero.'
    };
  }
  if (temp >= 26 || (temp >= 24 && code === 'sunny')) {
    return {
      theme: 'hot_tropical' as const,
      badge: '☀️ ONDA DE CALOR & ALTA RADIAÇÃO SOLAR',
      desc: 'Massas de ar quente equatoriais/tropicais com forte incidência solar e sensação térmica elevada.'
    };
  }
  if (code === 'rain' || code === 'thunder' || rawCode >= 51) {
    return {
      theme: 'rain_storm' as const,
      badge: '⛈️ FRENTE DE BAIXA PRESSÃO & PRECIPITAÇÃO',
      desc: 'Instabilidade barométrica com saturação de umidade e formação de chuvas torrenciais.'
    };
  }
  return {
    theme: 'mild_temperate' as const,
    badge: '⛅ ATMOSFERA ESTÁVEL & CONDIÇÕES AGRADÁVEIS',
    desc: 'Condições meteorológicas equilibradas com ventos amenos e boa visibilidade horizontal.'
  };
}

const GLOBAL_WEATHER_CITIES = [
  { name: 'Brasília', country: 'BR', lat: -15.79, lon: -47.88, tz: 'America/Sao_Paulo' },
  { name: 'Nairobi', country: 'KE', lat: -1.29, lon: 36.82, tz: 'Africa/Nairobi' },
  { name: 'Estação McMurdo (Antártica)', country: 'AQ', lat: -77.85, lon: 166.67, tz: 'Antarctica/McMurdo' },
  { name: 'Tóquio', country: 'JP', lat: 35.68, lon: 139.76, tz: 'Asia/Tokyo' },
  { name: 'Londres', country: 'UK', lat: 51.51, lon: -0.13, tz: 'Europe/London' },
  { name: 'Nova York', country: 'US', lat: 40.71, lon: -74.01, tz: 'America/New_York' },
  { name: 'Dubai', country: 'AE', lat: 25.20, lon: 55.27, tz: 'Asia/Dubai' },
  { name: 'Paris', country: 'FR', lat: 48.86, lon: 2.35, tz: 'Europe/Paris' },
  { name: 'Cidade do México', country: 'MX', lat: 19.43, lon: -99.13, tz: 'America/Mexico_City' },
  { name: 'Yakutsk', country: 'RU', lat: 62.03, lon: 129.73, tz: 'Asia/Yakutsk' },
  { name: 'Sydney', country: 'AU', lat: -33.87, lon: 151.21, tz: 'Australia/Sydney' },
  { name: 'Cairo', country: 'EG', lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' }
];

app.get('/api/weather', async (req, res) => {
  // Check memory cache first
  if (weatherCache && (Date.now() - weatherCache.timestamp) < CACHE_TTL_MS) {
    return res.json(weatherCache.data);
  }

  try {
    const lats = GLOBAL_WEATHER_CITIES.map(c => c.lat).join(',');
    const lons = GLOBAL_WEATHER_CITIES.map(c => c.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!resp.ok) throw new Error('Open-Meteo HTTP ' + resp.status);

    const json = await resp.json();
    const results = Array.isArray(json) ? json : [json];

    const weatherData = GLOBAL_WEATHER_CITIES.map((c, idx) => {
      const live = results[idx] || {};
      const current = live.current || {};
      const daily = live.daily || {};

      const temp = current.temperature_2m !== undefined ? Math.round(current.temperature_2m) : (c.country === 'AQ' ? -24 : Math.round(28 - Math.abs(c.lat) * 0.4));
      const apparentTemp = current.apparent_temperature !== undefined ? Math.round(current.apparent_temperature) : temp;
      const rawCode = current.weather_code !== undefined ? current.weather_code : 0;
      const { condition, conditionCode } = parseWmoCode(rawCode);
      const humidity = current.relative_humidity_2m !== undefined ? Math.round(current.relative_humidity_2m) : 60;
      const windSpeed = current.wind_speed_10m !== undefined ? `${Math.round(current.wind_speed_10m)} km/h` : '15 km/h';
      const windDirection = current.wind_direction_10m || 0;
      const pressure = current.surface_pressure !== undefined ? Math.round(current.surface_pressure) : 1013;
      const uvIndex = daily.uv_index_max?.[0] !== undefined ? daily.uv_index_max[0] : 5.0;
      const elevation = live.elevation || 0;

      const themeInfo = classifyWeatherTheme(temp, conditionCode, rawCode);

      // 5-day forecast
      const forecast = (daily.time || []).slice(0, 5).map((dStr: string, dIdx: number) => {
        const dCode = daily.weather_code?.[dIdx] ?? 0;
        const dInfo = parseWmoCode(dCode);
        return {
          day: new Date(dStr).toLocaleDateString('pt-BR', { weekday: 'short' }),
          min: Math.round(daily.temperature_2m_min?.[dIdx] ?? temp - 4),
          max: Math.round(daily.temperature_2m_max?.[dIdx] ?? temp + 4),
          code: dInfo.conditionCode,
          label: dInfo.condition
        };
      });

      return {
        city: c.name,
        country: c.country,
        lat: c.lat,
        lon: c.lon,
        temperature: temp,
        apparentTemperature: apparentTemp,
        unit: '°C',
        condition,
        conditionCode,
        humidity,
        windSpeed,
        windDirection,
        pressure,
        uvIndex,
        elevation,
        timezone: c.tz,
        weatherCode: rawCode,
        imageTheme: themeInfo.theme,
        themeBadge: themeInfo.badge,
        themeDescription: themeInfo.desc,
        forecast
      };
    });

    const responsePayload = {
      source: 'Open-Meteo & World Meteorological Organization (WMO)',
      models: ['ECMWF IFS', 'GFS / HRRR', 'DWD ICON', 'Météo-France ARPEGE'],
      cachedAt: new Date().toISOString(),
      cities: weatherData
    };

    weatherCache = { timestamp: Date.now(), data: responsePayload };
    res.json(responsePayload);
  } catch (err) {
    console.error('[Weather] Live fetch failed, using fallback simulation:', err);

    // Resilient fallback with dynamic realism
    const fallbackData = GLOBAL_WEATHER_CITIES.map(c => {
      const isAntarctica = c.country === 'AQ';
      const isNairobi = c.name === 'Nairobi';
      const temp = isAntarctica ? -24 : (isNairobi ? 27 : Math.round(26 - Math.abs(c.lat) * 0.4));
      const code = isAntarctica ? 'snow' : (temp > 24 ? 'sunny' : 'cloudy');
      const condition = isAntarctica ? 'Neve & Vento Polar' : (isNairobi ? 'Ensolarado / Calor Tropical' : (temp > 24 ? 'Ensolarado' : 'Parcialmente Nublado'));
      const themeInfo = classifyWeatherTheme(temp, code, isAntarctica ? 71 : (temp > 24 ? 0 : 2));

      return {
        city: c.name,
        country: c.country,
        lat: c.lat,
        lon: c.lon,
        temperature: temp,
        apparentTemperature: temp + (isAntarctica ? -6 : (isNairobi ? 2 : 0)),
        unit: '°C',
        condition,
        conditionCode: code as any,
        humidity: isAntarctica ? 45 : (isNairobi ? 52 : 62),
        windSpeed: isAntarctica ? '42 km/h' : (isNairobi ? '14 km/h' : '18 km/h'),
        windDirection: isAntarctica ? 180 : 90,
        pressure: isAntarctica ? 985 : 1014,
        uvIndex: isAntarctica ? 0.8 : (isNairobi ? 9.2 : 6.0),
        elevation: isAntarctica ? 24 : 1680,
        timezone: c.tz,
        weatherCode: isAntarctica ? 71 : (temp > 24 ? 0 : 2),
        imageTheme: themeInfo.theme,
        themeBadge: themeInfo.badge,
        themeDescription: themeInfo.desc,
        forecast: [
          { day: 'Sex', min: temp - 3, max: temp + 2, code, label: condition },
          { day: 'Sáb', min: temp - 2, max: temp + 3, code, label: condition },
          { day: 'Dom', min: temp - 4, max: temp + 1, code, label: condition },
          { day: 'Seg', min: temp - 3, max: temp + 2, code, label: condition },
          { day: 'Ter', min: temp - 1, max: temp + 4, code, label: condition }
        ]
      };
    });

    res.json({
      source: 'Open-Meteo & World Meteorological Network (Fallback)',
      models: ['ECMWF IFS', 'GFS / HRRR', 'DWD ICON'],
      cities: fallbackData
    });
  }
});

// Query weather for ANY arbitrary latitude and longitude on the planet (from map click!)
app.get('/api/weather/point', async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Parâmetros lat e lon são obrigatórios e devem ser numéricos' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Open-Meteo HTTP ' + resp.status);

    const data = await resp.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round(current.temperature_2m ?? 20);
    const apparentTemp = Math.round(current.apparent_temperature ?? temp);
    const rawCode = current.weather_code ?? 0;
    const { condition, conditionCode } = parseWmoCode(rawCode);
    const themeInfo = classifyWeatherTheme(temp, conditionCode, rawCode);

    const forecast = (daily.time || []).slice(0, 5).map((dStr: string, dIdx: number) => {
      const dCode = daily.weather_code?.[dIdx] ?? 0;
      const dInfo = parseWmoCode(dCode);
      return {
        day: new Date(dStr).toLocaleDateString('pt-BR', { weekday: 'short' }),
        min: Math.round(daily.temperature_2m_min?.[dIdx] ?? temp - 3),
        max: Math.round(daily.temperature_2m_max?.[dIdx] ?? temp + 3),
        code: dInfo.conditionCode,
        label: dInfo.condition
      };
    });

    res.json({
      city: `Ponto [${lat.toFixed(2)}°, ${lon.toFixed(2)}°]`,
      country: 'Coordenada Geográfica Global',
      lat,
      lon,
      temperature: temp,
      apparentTemperature: apparentTemp,
      unit: '°C',
      condition,
      conditionCode,
      humidity: Math.round(current.relative_humidity_2m ?? 50),
      windSpeed: `${Math.round(current.wind_speed_10m ?? 12)} km/h`,
      windDirection: current.wind_direction_10m || 0,
      pressure: Math.round(current.surface_pressure ?? 1013),
      uvIndex: daily.uv_index_max?.[0] ?? 5.0,
      elevation: data.elevation ?? 0,
      timezone: data.timezone || 'UTC',
      weatherCode: rawCode,
      imageTheme: themeInfo.theme,
      themeBadge: themeInfo.badge,
      themeDescription: themeInfo.desc,
      forecast
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar telemetria climática no ponto' });
  }
});

// City Geocoding Search using Open-Meteo Geocoding API
app.get('/api/weather/search', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query) return res.json({ results: [] });

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=pt&format=json`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Geocoding API HTTP ' + resp.status);

    const data = await resp.json();
    const results = (data.results || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      country: r.country || r.country_code,
      countryCode: r.country_code,
      admin1: r.admin1 || '',
      lat: r.latitude,
      lon: r.longitude,
      timezone: r.timezone,
      elevation: r.elevation
    }));

    res.json({ results });
  } catch (err) {
    res.json({ results: [] });
  }
});

// Users Management & Authentication
app.get('/api/users', (req, res) => {
  const users = readJsonFile<any[]>('users.json', []);
  // Exclude password hashes
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  res.json(safeUsers);
});

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJsonFile<any[]>('users.json', []);
  const user = users.find(u => u.username === username || u.email === username);

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Credenciais inválidas. Tente admin / admin123' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({
    token: 'jwt_capy_' + user.id + '_' + Date.now(),
    user: safeUser
  });
});

// Non-intrusive User Profile & Telemetry Saving
app.post('/api/users/save-profile', (req, res) => {
  const {
    id,
    country,
    region,
    countryCode,
    timezone,
    gender,
    device,
    browser,
    preferredTopics,
    preferredRegions
  } = req.body;

  const dataUsers = readJsonFile<any>('data_users.json', { anonymous_profiles: [] });
  const profileId = id || 'anon_' + Date.now();

  const existingIdx = dataUsers.anonymous_profiles.findIndex((p: any) => p.id === profileId);
  const updatedProfile = {
    id: profileId,
    country: country || 'Brasil',
    region: region || 'Distrito Federal',
    countryCode: countryCode || 'BR',
    timezone: timezone || 'America/Sao_Paulo',
    gender: gender || 'não informado',
    device: device || 'desktop',
    browser: browser || 'Standard Web',
    preferredTopics: preferredTopics || ['Tech & AI', 'Business & Finance'],
    preferredRegions: preferredRegions || ['Global', 'América do Sul'],
    articlesRead: (existingIdx >= 0 ? dataUsers.anonymous_profiles[existingIdx].articlesRead + 1 : 1),
    lastVisit: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    dataUsers.anonymous_profiles[existingIdx] = updatedProfile;
  } else {
    dataUsers.anonymous_profiles.unshift(updatedProfile);
  }

  dataUsers.total_tracked_sessions = (dataUsers.total_tracked_sessions || 0) + 1;
  writeJsonFile('data_users.json', dataUsers);
  writeJsonFile('data_user.json', dataUsers);

  // Also update sqlite
  getSqliteDb().then(db => {
    try {
      db.run(`
        INSERT OR REPLACE INTO user_telemetry (
          id, country, region, timezone, gender, device, browser, preferred_topics, articles_read, last_visit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        updatedProfile.id,
        updatedProfile.country,
        updatedProfile.region,
        updatedProfile.timezone,
        updatedProfile.gender,
        updatedProfile.device,
        updatedProfile.browser,
        JSON.stringify(updatedProfile.preferredTopics),
        updatedProfile.articlesRead,
        updatedProfile.lastVisit
      ]);
      persistSqliteDb();
    } catch (e) {
      console.warn('[SQLite] Telemetry insert failed:', e);
    }
  });

  res.json({ success: true, profile: updatedProfile });
});

// Strategic Partnerships & Investor Relations B2B Leads
app.post('/api/investors/lead', (req, res) => {
  const { name, company, email, subject, message, protocol } = req.body;
  const leads = readJsonFile<any[]>('leads.json', []);
  const newLead = {
    id: protocol || 'DRAFT-' + Date.now(),
    name: name || 'Confidencial',
    company: company || 'Empresa não informada',
    email: email || '',
    subject: subject || 'Investimento & Seed Capital',
    message: message || '',
    createdAt: new Date().toISOString(),
    status: 'received'
  };
  leads.unshift(newLead);
  writeJsonFile('leads.json', leads);
  console.log(`[Draft Studio] Novo lead B2B recebido: ${newLead.company} (${newLead.email}) - Protocolo ${newLead.id}`);
  res.json({ success: true, protocol: newLead.id });
});

// Analytics & Demand Cross-referencing
app.get('/api/analytics', (req, res) => {
  const dataUsers = readJsonFile<any>('data_users.json', {
    anonymous_profiles: [],
    regional_demand_gaps: []
  });
  const articles = readJsonFile<any[]>('articles.json', []);
  const users = readJsonFile<any[]>('users.json', []);

  // Compute breakdown
  const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
  const countryCounts: Record<string, number> = {};
  const topicInterests: Record<string, number> = {};

  for (const p of dataUsers.anonymous_profiles || []) {
    const dev = p.device || 'desktop';
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    const c = p.country || 'Desconhecido';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
    for (const t of p.preferredTopics || []) {
      topicInterests[t] = (topicInterests[t] || 0) + 1;
    }
  }

  res.json({
    totalSessions: dataUsers.total_tracked_sessions || 1420,
    totalRegisteredUsers: users.length,
    activeAccounts: users.filter((u: any) => u.status === 'active').length,
    totalArticlesIndexed: articles.length,
    deviceDistribution: deviceCounts,
    countryDistribution: countryCounts,
    topicInterests,
    regionalDemandGaps: dataUsers.regional_demand_gaps || []
  });
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CapyNews Server] Running on http://localhost:${PORT}`);
  });
}

start();
