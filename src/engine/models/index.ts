import { EconomicModel } from '../../types/graph';
// Batch 1 Models
import { marketEquilibriumModel } from './marketEquilibriumModel';
import { ppcModel } from './ppcModel';
import { comparativeAdvantageModel } from './comparativeAdvantageModel';
import { elasticityModel } from './elasticityModel';

// Batch 2 Models
import { costCurvesModel } from './costCurvesModel';
import { perfectCompetitionModel } from './perfectCompetitionModel';
import { monopolyModel } from './monopolyModel';
import { gameTheoryModel } from './gameTheoryModel';

export const ECONOMIC_MODELS: Record<string, EconomicModel> = {
  // Batch 1: Basic Economic Concepts & Core Supply and Demand
  'ppc-model': ppcModel,
  'comparative-advantage': comparativeAdvantageModel,
  'market-equilibrium-welfare': marketEquilibriumModel,
  'price-elasticity-demand': elasticityModel,
  'gov-intervention-taxes-deadweight': marketEquilibriumModel,
  'price-controls-ceilings-floors': marketEquilibriumModel,

  // Batch 2: Production, Costs, and Market Structures
  'cost-curves-short-run': costCurvesModel,
  'shutdown-rule': costCurvesModel,
  'perfect-competition-side-by-side': perfectCompetitionModel,
  'monopoly-single-price': monopolyModel,
  'monopoly-price-discrimination': monopolyModel,
  'oligopoly-game-theory': gameTheoryModel,
};

export function getModelById(modelId: string): EconomicModel | undefined {
  return ECONOMIC_MODELS[modelId];
}
