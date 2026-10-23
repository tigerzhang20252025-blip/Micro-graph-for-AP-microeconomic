import { EconomicModel } from '../../types/graph';
// Batch 1 Models: Basic Economic Concepts & Core Supply and Demand
import { ppcModel } from './ppcModel';
import { comparativeAdvantageModel } from './comparativeAdvantageModel';
import { marketEquilibriumModel } from './marketEquilibriumModel';
import { elasticityModel } from './elasticityModel';
import { utilityMaximizationModel } from './utilityMaximizationModel';

// Batch 2 Models: Production, Costs, and Market Structures
import { productionFunctionModel } from './productionFunctionModel';
import { costCurvesModel } from './costCurvesModel';
import { lratcModel } from './lratcModel';
import { perfectCompetitionModel } from './perfectCompetitionModel';
import { monopolyModel } from './monopolyModel';
import { gameTheoryModel } from './gameTheoryModel';

// Batch 3 Models: Trade, Factor Markets, Externalities, Inequality & Advanced Micro
import { internationalTradeModel } from './internationalTradeModel';
import { monopolisticCompModel } from './monopolisticCompModel';
import { factorMarketModel } from './factorMarketModel';
import { externalitiesModel } from './externalitiesModel';
import { publicGoodsModel } from './publicGoodsModel';
import { lorenzCurveModel } from './lorenzCurveModel';
import { indifferenceCurveModel } from './indifferenceCurveModel';
import { cournotDuopolyModel } from './cournotDuopolyModel';

export const ECONOMIC_MODELS: Record<string, EconomicModel> = {
  // Unit 1: Basic Economic Concepts
  'ppc-model': ppcModel,
  'comparative-advantage': comparativeAdvantageModel,
  'marginal-analysis-utility': utilityMaximizationModel,

  // Unit 2: Supply and Demand
  'market-equilibrium-welfare': marketEquilibriumModel,
  'price-elasticity-demand': elasticityModel,
  'gov-intervention-taxes-deadweight': marketEquilibriumModel,
  'price-controls-ceilings-floors': marketEquilibriumModel,
  'international-trade-tariffs': internationalTradeModel,

  // Unit 3: Production, Cost, and Perfect Competition
  'production-function-tp-mp-ap': productionFunctionModel,
  'cost-curves-short-run': costCurvesModel,
  'lratc-economies-of-scale': lratcModel,
  'shutdown-rule': costCurvesModel,
  'perfect-competition-side-by-side': perfectCompetitionModel,

  // Unit 4: Imperfect Competition
  'monopoly-single-price': monopolyModel,
  'monopoly-price-discrimination': monopolyModel,
  'monopolistic-competition': monopolisticCompModel,
  'oligopoly-game-theory': gameTheoryModel,

  // Unit 5: Factor Markets
  'factor-market-competitive': factorMarketModel,
  'monopsony-factor-market': factorMarketModel,

  // Unit 6: Market Failure & Role of Government
  'negative-externalities': externalitiesModel,
  'positive-externalities': externalitiesModel,
  'public-goods-provision': publicGoodsModel,
  'lorenz-curve-gini': lorenzCurveModel,

  // Optional Honors Extensions
  'indifference-curves-budget': indifferenceCurveModel,
  'cournot-duopoly': cournotDuopolyModel,
};

export function getModelById(modelId: string): EconomicModel | undefined {
  return ECONOMIC_MODELS[modelId];
}
