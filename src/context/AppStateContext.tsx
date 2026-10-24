import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AP_TOPICS } from '../data/topicRegistry';

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

  // Navigation helpers
  navigateToTopic: (topicId: string) => void;
  navigateToGraph: (modelId: string, topicId?: string) => void;
}

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

  const toggleLayer = (layer: 'showSurplus' | 'showDropLines' | 'showGrid') => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
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
      setSelectedModelId(topic.graphModelId);
      setCurrentView('graph');
    } else {
      setCurrentView('library');
    }
  };

  const navigateToGraph = (modelId: string, topicId?: string) => {
    setSelectedModelId(modelId);
    if (topicId) {
      setSelectedTopicId(topicId);
    } else {
      const matchingTopic = AP_TOPICS.find((t) => t.graphModelId === modelId || t.id === modelId);
      if (matchingTopic) {
        setSelectedTopicId(matchingTopic.id);
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
