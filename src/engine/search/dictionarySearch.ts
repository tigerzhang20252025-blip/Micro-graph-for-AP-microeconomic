import { ECONOMIC_DICTIONARY, EconomicTermDefinition } from '../../data/economicDictionary';

export interface SearchOptions {
  unit?: number; // 1 to 6
  category?: string; // 'all' or specific category
}

export interface ScoredTerm {
  term: EconomicTermDefinition;
  score: number;
  matchField: 'abbreviation' | 'en' | 'zh' | 'alias' | 'formula' | 'definition';
}

/**
 * Searches the economic dictionary with smart multi-field ranking.
 * Acronym/abbreviation exact and prefix matches are prioritized highest.
 */
export function searchDictionary(query: string, options?: SearchOptions): EconomicTermDefinition[] {
  const cleanQuery = query.trim().toLowerCase();

  let pool = ECONOMIC_DICTIONARY;

  // Filter by Unit
  if (options?.unit && options.unit >= 1 && options.unit <= 6) {
    pool = pool.filter((item) => item.unit === options.unit);
  }

  // Filter by Category
  if (options?.category && options.category !== 'all') {
    pool = pool.filter((item) => item.category === options.category);
  }

  // If query is empty, return pool sorted by unit and id
  if (!cleanQuery) {
    return [...pool].sort((a, b) => a.unit - b.unit || a.en.localeCompare(b.en));
  }

  const scored: ScoredTerm[] = [];

  for (const item of pool) {
    let score = 0;
    let matchField: ScoredTerm['matchField'] = 'definition';

    const abbr = item.abbreviation?.toLowerCase() || '';
    const en = item.en.toLowerCase();
    const zh = item.zh.toLowerCase();
    const aliases = (item.aliases || []).map((a) => a.toLowerCase());
    const formula = item.formula?.toLowerCase() || '';
    const defEn = item.definition.en.toLowerCase();
    const defZh = item.definition.zh.toLowerCase();

    // 1. Exact abbreviation match: Highest Priority (Score: 1000)
    // Supports compound abbreviations like "PPC / PPF", "MFC / MRC"
    const abbrList = abbr.split('/').map((s) => s.trim());
    if (abbrList.includes(cleanQuery)) {
      score = 1000;
      matchField = 'abbreviation';
    }
    // 2. Abbreviation starts with query (Score: 800)
    else if (abbrList.some((s) => s.startsWith(cleanQuery))) {
      score = 800;
      matchField = 'abbreviation';
    }
    // 3. Abbreviation contains query (Score: 600)
    else if (abbr.includes(cleanQuery)) {
      score = 600;
      matchField = 'abbreviation';
    }
    // 4. Exact English name match or exact alias (Score: 500)
    else if (en === cleanQuery || aliases.includes(cleanQuery)) {
      score = 500;
      matchField = en === cleanQuery ? 'en' : 'alias';
    }
    // 5. Exact Chinese name match (Score: 500)
    else if (zh.includes(cleanQuery) && cleanQuery.length >= 2) {
      score = 450;
      matchField = 'zh';
    }
    // 6. English name starts with query (Score: 400)
    else if (en.startsWith(cleanQuery)) {
      score = 400;
      matchField = 'en';
    }
    // 7. English name contains query as word or substring (Score: 300)
    else if (en.includes(cleanQuery)) {
      score = 300;
      matchField = 'en';
    }
    // 8. Aliases contain query (Score: 250)
    else if (aliases.some((a) => a.includes(cleanQuery))) {
      score = 250;
      matchField = 'alias';
    }
    // 9. Chinese name contains query (Score: 200)
    else if (zh.includes(cleanQuery)) {
      score = 200;
      matchField = 'zh';
    }
    // 10. Formula contains query (Score: 150)
    else if (formula.includes(cleanQuery)) {
      score = 150;
      matchField = 'formula';
    }
    // 11. Definition text contains query (Score: 100)
    else if (defEn.includes(cleanQuery) || defZh.includes(cleanQuery)) {
      score = 100;
      matchField = 'definition';
    }

    if (score > 0) {
      scored.push({ term: item, score, matchField });
    }
  }

  // Sort descending by score; if tied, sort by unit ascending then alphabet
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.term.unit !== b.term.unit) {
      return a.term.unit - b.term.unit;
    }
    return a.term.en.localeCompare(b.term.en);
  });

  return scored.map((s) => s.term);
}

/**
 * Returns a specific term by ID
 */
export function getTermById(termId: string): EconomicTermDefinition | undefined {
  return ECONOMIC_DICTIONARY.find((t) => t.id === termId);
}
