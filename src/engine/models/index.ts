import { EconomicModel } from '../../types/graph';
import { marketEquilibriumModel } from './marketEquilibriumModel';
import { ppcModel } from './ppcModel';
import { comparativeAdvantageModel } from './comparativeAdvantageModel';
import { elasticityModel } from './elasticityModel';

export const ECONOMIC_MODELS: Record<string, EconomicModel> = {
  // Batch 1: Basic Economic Concepts & Core Supply and Demand
  'ppc-model': ppcModel,
  'comparative-advantage': comparativeAdvantageModel,
  'market-equilibrium-welfare': marketEquilibriumModel,
  'price-elasticity-demand': elasticityModel,
  'gov-intervention-taxes-deadweight': marketEquilibriumModel,
  'price-controls-ceilings-floors': marketEquilibriumModel,
};

export function getModelById(modelId: string): EconomicModel | undefined {
  return ECONOMIC_MODELS[modelId];
}
