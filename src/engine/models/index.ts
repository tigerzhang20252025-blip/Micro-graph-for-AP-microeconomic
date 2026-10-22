import { EconomicModel } from '../../types/graph';
import { marketEquilibriumModel } from './marketEquilibriumModel';
import { ppcModel } from './ppcModel';

export const ECONOMIC_MODELS: Record<string, EconomicModel> = {
  'market-equilibrium-welfare': marketEquilibriumModel,
  'ppc-model': ppcModel,
  // Additional models in Part 2 will be registered here (Monopoly, Oligopoly, Factor Markets, Externalities, etc.)
};

export function getModelById(modelId: string): EconomicModel | undefined {
  return ECONOMIC_MODELS[modelId];
}
