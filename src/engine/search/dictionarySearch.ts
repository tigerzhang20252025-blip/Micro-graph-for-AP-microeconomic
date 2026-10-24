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
 * Handles parenthetical acronyms seamlessly (e.g. "Comparative Advantage (CA)").
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

  // Extract stripped query and parenthetical acronym if present: e.g. "Comparative Advantage (CA)"
  const parenMatch = cleanQuery.match(/\(([^)]+)\)/);
  const parenAcronym = parenMatch ? parenMatch[1].trim().toLowerCase() : '';
  const strippedQuery = cleanQuery.replace(/\([^)]*\)/g, '').trim();

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

    const abbrList = abbr.split('/').map((s) => s.trim());

    // 0. Direct ID match
    if (item.id === cleanQuery || item.id === strippedQuery) {
      score = 2000;
      matchField = 'en';
    }
    // 1. Exact abbreviation match or parenthetical acronym match: Highest Priority (Score: 1000)
    // Supports compound abbreviations like "PPC / PPF", "MFC / MRC", and "Comparative Advantage (CA)"
    else if (abbrList.includes(cleanQuery) || (parenAcronym && abbrList.includes(parenAcronym))) {
      score = 1000;
      matchField = 'abbreviation';
    }
    // 2. Abbreviation starts with query (Score: 850)
    else if (abbrList.some((s) => s.startsWith(cleanQuery))) {
      score = 850;
      matchField = 'abbreviation';
    }
    // 3. Exact English name match or exact alias or stripped query equals English (Score: 700)
    else if (en === cleanQuery || en === strippedQuery || aliases.includes(cleanQuery)) {
      score = 700;
      matchField = en === cleanQuery || en === strippedQuery ? 'en' : 'alias';
    }
    // 4. Exact Chinese name match or stripped query equals Chinese (Score: 700)
    else if (zh === cleanQuery || zh === strippedQuery) {
      score = 700;
      matchField = 'zh';
    }
    // 5. English name contains query or query contains English name (Score: 600)
    else if (en.includes(cleanQuery) || (strippedQuery && en.includes(strippedQuery)) || (cleanQuery.includes(en) && en.length >= 4)) {
      score = 600;
      matchField = 'en';
    }
    // 6. Chinese name contains query or query contains Chinese name (Score: 550)
    else if (zh.includes(cleanQuery) || (strippedQuery && zh.includes(strippedQuery)) || (cleanQuery.includes(zh) && zh.length >= 2)) {
      score = 550;
      matchField = 'zh';
    }
    // 7. Abbreviation contains query or query contains abbreviation (Score: 500)
    else if (abbr && (abbr.includes(cleanQuery) || (cleanQuery.length <= 10 && cleanQuery.includes(abbr) && abbr.length >= 2))) {
      score = 500;
      matchField = 'abbreviation';
    }
    // 8. English name starts with query (Score: 400)
    else if (en.startsWith(cleanQuery) || (strippedQuery && en.startsWith(strippedQuery))) {
      score = 400;
      matchField = 'en';
    }
    // 9. Aliases contain query (Score: 300)
    else if (aliases.some((a) => a.includes(cleanQuery) || (strippedQuery && a.includes(strippedQuery)))) {
      score = 300;
      matchField = 'alias';
    }
    // 10. Formula contains query (Score: 200)
    else if (formula.includes(cleanQuery) || (strippedQuery && formula.includes(strippedQuery))) {
      score = 200;
      matchField = 'formula';
    }
    // 11. Definition text contains query (Score: 100)
    else if (defEn.includes(cleanQuery) || defZh.includes(cleanQuery) || (strippedQuery && (defEn.includes(strippedQuery) || defZh.includes(strippedQuery)))) {
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
