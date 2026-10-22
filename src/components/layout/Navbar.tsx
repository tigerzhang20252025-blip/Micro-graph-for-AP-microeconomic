import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState, AppView } from '../../context/AppStateContext';
import { LineChart, BookOpen, BrainCircuit, Globe, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentView, setCurrentView } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    {
      view: 'library',
      label: t.navTopicLibrary,
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      view: 'graph',
      label: t.navGraphLab,
      icon: <LineChart className="w-4 h-4" />
    },
    {
      view: 'practice',
      label: t.navPracticeMode,
      icon: <BrainCircuit className="w-4 h-4" />
    },
    {
      view: 'reference',
      label: t.navReferenceGlossary,
      icon: <ShieldCheck className="w-4 h-4" />
    }
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight group-hover:text-blue-600 transition-colors">
                  AP Micro Graph Lab
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  CED 2026–27
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {language === 'zh' ? 'AP微观经济学交互图表实验室' : 'Interactive AP Microeconomics'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switch Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-blue-600 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t.langSwitchButton}</span>
            </button>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
