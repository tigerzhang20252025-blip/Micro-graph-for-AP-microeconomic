import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AP_TOPICS } from '../data/topicRegistry';
import { getModelById } from '../engine/models';

export type AppView = 'library' | 'graph' | 'learning' | 'practice' | 'reference';
export type AppMode = 'learning' | 'practice' | 'reference';

interface AppStateContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedTopicId: string;
  setSelectedTopicId: (topicId: string) => void;
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;

  // Active learning challenge
  activeLearningActivityId: string;
  setActiveLearningActivityId: (id: string) => void;
  
  // Model parameters preserved across language and view switching
  modelParams: Record<string, Record<string, any>>;
  updateModelParam: (modelId: string, paramKey: string, value: any) => void;
  setModelParams: (modelId: string, params: Record<string, any>) => void;
  resetModelParams: (modelId: string, defaultParams: Record<string, any>) => void;
  
  // Graph visibility layers
  layerVisibility: {
    showSurplus: boolean;
    showDropLines: boolean;
    showGrid: boolean;
  };
  toggleLayer: (layer: 'showSurplus' | 'showDropLines' | 'showGrid') => void;
  hiddenCurveIds: string[];
  toggleCurveVisibility: (curveId: string) => void;

  // Navigation helpers
  navigateToTopic: (topicId: string) => void;
  navigateToGraph: (modelId: string, topicId?: string) => void;
}

export const TOPIC_INITIAL_PARAMS: Record<string, Record<string, any>> = {
  'gov-intervention-taxes-deadweight': {
    demandShift: 0,
    supplyShift: 0,
    taxPerUnit: 14,
    subsidyPerUnit: 0,
    priceControlMode: 'none',
    controlledPrice: 40,
    showBaselineComparison: false
  },
  'price-controls-ceilings-floors': {
    demandShift: 0,
    supplyShift: 0,
    taxPerUnit: 0,
    subsidyPerUnit: 0,
    priceControlMode: 'ceiling',
    controlledPrice: 35,
    showBaselineComparison: false
  },
  'market-equilibrium-welfare': {
    demandShift: 0,
    supplyShift: 0,
    taxPerUnit: 0,
    subsidyPerUnit: 0,
    priceControlMode: 'none',
    controlledPrice: 40,
    showBaselineComparison: false
  },
  'shutdown-rule': {
    fixedCost: 120,
    perUnitTax: 0,
    chosenQuantity: 18,
    showMC: true,
    showATC: true,
    showAVC: true,
    showAFC: true
  },
  'cost-curves-short-run': {
    fixedCost: 120,
    perUnitTax: 0,
    chosenQuantity: 24,
    showMC: true,
    showATC: true,
    showAVC: true,
    showAFC: true
  },
  'monopoly-single-price': {
    demandIntercept: 100,
    fixedCost: 180,
    isPriceDiscrimination: false,
    regulationType: 'none'
  },
  'monopoly-price-discrimination': {
    demandIntercept: 100,
    fixedCost: 180,
    isPriceDiscrimination: true,
    regulationType: 'none'
  },
  'factor-market-competitive': {
    marketStructure: 'competitive_firm',
    laborProductPrice: 5,
    minWageRate: 0,
    laborSupplyBase: 35,
    laborSupplySlope: 0
  },
  'monopsony-factor-market': {
    marketStructure: 'monopsony',
    laborProductPrice: 5,
    minWageRate: 0,
    laborSupplyBase: 10,
    laborSupplySlope: 1.5
  },
  'negative-externalities': {
    externalityType: 'negative_production',
    externalityMagnitude: 24,
    correctivePolicyActive: false
  },
  'positive-externalities': {
    externalityType: 'positive_consumption',
    externalityMagnitude: 24,
    correctivePolicyActive: false
  },
  'international-trade-tariffs': {
    tradePolicy: 'tariff',
    tariffPerUnit: 12,
    worldPrice: 30
  }
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('library');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('market-equilibrium-welfare');
  const [selectedModelId, setSelectedModelId] = useState<string>('market-equilibrium-welfare');
  const [activeMode, setActiveMode] = useState<AppMode>('learning');
  const [activeLearningActivityId, setActiveLearningActivityId] = useState<string>('learn-ppc-capital-growth');

  const [modelParams, setModelParamsState] = useState<Record<string, Record<string, any>>>({});

  const [layerVisibility, setLayerVisibility] = useState({
    showSurplus: true,
    showDropLines: true,
    showGrid: true,
  });

  const [hiddenCurveIds, setHiddenCurveIds] = useState<string[]>([]);

  const toggleLayer = (layer: 'showSurplus' | 'showDropLines' | 'showGrid') => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const toggleCurveVisibility = (curveId: string) => {
    setHiddenCurveIds(prev =>
      prev.includes(curveId) ? prev.filter(id => id !== curveId) : [...prev, curveId]
    );
  };

  const updateModelParam = (modelId: string, paramKey: string, value: any) => {
    setModelParamsState(prev => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {}),
        [paramKey]: value
      }
    }));
  };

  const setModelParams = (modelId: string, params: Record<string, any>) => {
    setModelParamsState(prev => ({
      ...prev,
      [modelId]: { ...params }
    }));
  };

  const resetModelParams = (modelId: string, defaultParams: Record<string, any>) => {
    setModelParamsState(prev => ({
      ...prev,
      [modelId]: { ...defaultParams }
    }));
  };

  const navigateToTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    const topic = AP_TOPICS.find(t => t.id === topicId);
    if (topic?.graphModelId) {
      const model = getModelById(topic.graphModelId);
      const targetModelKey = model ? model.id : topic.graphModelId;
      setSelectedModelId(targetModelKey);
      // Auto-apply topic-specific preset params if defined
      if (TOPIC_INITIAL_PARAMS[topicId]) {
        setModelParamsState(prev => ({
          ...prev,
          [targetModelKey]: { ...TOPIC_INITIAL_PARAMS[topicId] }
        }));
      }
      setCurrentView('graph');
    } else {
      setCurrentView('library');
    }
  };

  const navigateToGraph = (modelId: string, topicId?: string) => {
    const model = getModelById(modelId);
    const targetModelKey = model ? model.id : modelId;
    setSelectedModelId(targetModelKey);
    const effectiveTopicId = topicId || AP_TOPICS.find((t) => t.graphModelId === modelId || t.id === modelId)?.id;
    if (effectiveTopicId) {
      setSelectedTopicId(effectiveTopicId);
      if (TOPIC_INITIAL_PARAMS[effectiveTopicId]) {
        setModelParamsState(prev => ({
          ...prev,
          [targetModelKey]: { ...TOPIC_INITIAL_PARAMS[effectiveTopicId] }
        }));
      }
    }
    setCurrentView('graph');
  };

  const value: AppStateContextType = {
    currentView,
    setCurrentView,
    selectedTopicId,
    setSelectedTopicId,
    selectedModelId,
    setSelectedModelId,
    activeMode,
    setActiveMode,
    activeLearningActivityId,
    setActiveLearningActivityId,
    modelParams,
    updateModelParam,
    setModelParams,
    resetModelParams,
    layerVisibility,
    toggleLayer,
    hiddenCurveIds,
    toggleCurveVisibility,
    navigateToTopic,
    navigateToGraph
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
