import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TopicLibrary } from './components/registry/TopicLibrary';
import { GraphWorkspace } from './components/graph/GraphWorkspace';
import { LearningMode } from './components/modes/LearningMode';
import { PracticeMode } from './components/modes/PracticeMode';
import { ReferenceMode } from './components/modes/ReferenceMode';

const MainContent: React.FC = () => {
  const { currentView } = useAppState();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {currentView === 'library' && <TopicLibrary />}
      {currentView === 'graph' && <GraphWorkspace />}
      {currentView === 'learning' && <LearningMode />}
      {currentView === 'practice' && <PracticeMode />}
      {currentView === 'reference' && <ReferenceMode />}
    </main>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <div className="flex-1">
            <MainContent />
          </div>
          <Footer />
        </div>
      </AppStateProvider>
    </LanguageProvider>
  );
}

export default App;
