export type APUnitId = 1 | 2 | 3 | 4 | 5 | 6 | 0; // 0 for foundational/extensions

export type ScopeClassification = 
  | 'core'       // Core AP Content
  | 'extension'  // Optional Extension
  | 'excluded';  // Not in Current AP Exam Scope

export type TopicStatus = 
  | 'ready'      // Fully interactive in Part 1
  | 'planned'    // Architectural foundation ready, graph engine planned for Part 2
  | 'reference'; // Reference / comparative context only

export interface BilingualText {
  en: string;
  zh: string;
}

export interface APTopic {
  id: string;
  unit: APUnitId;
  topicCode: string; // e.g. "1.3", "2.6", "4.2"
  title: BilingualText;
  subtitle: BilingualText;
  description: BilingualText;
  scope: ScopeClassification;
  officialRef: string; // Official AP CED Learning Objective or reference
  status: TopicStatus;
  graphModelId?: string; // If model is implemented
  examWeight?: string; // e.g., "20-25%"
  keywords: string[];
  keyTerms: BilingualText[];
  primaryCurves: BilingualText[];
}

export interface APUnitMeta {
  unit: APUnitId;
  title: BilingualText;
  examWeight: string;
  description: BilingualText;
}
