import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RecipeDiscovery } from './components/RecipeDiscovery';
import { CookingInspiration } from './components/CookingInspiration';
import { KitchenCompanionPreview } from './components/KitchenCompanionPreview';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { RecipeModal } from './components/RecipeModal';
import { Recipe } from './types/recipe';
import { Check } from 'lucide-react';

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    const discoverElement = document.getElementById('discover');
    if (discoverElement) {
      discoverElement.scrollIntoView({ behavior: 'smooth' });
      // Focus the input if present
      setTimeout(() => {
        const input = discoverElement.querySelector('input');
        if (input) input.focus();
      }, 300);
    }
  };

  const handleExploreClick = () => {
    const recipesElement = document.getElementById('recipes');
    if (recipesElement) {
      recipesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanClick = () => {
    const companionElement = document.getElementById('companion');
    if (companionElement) {
      companionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveToPlan = (recipe: Recipe) => {
    setSavedRecipesCount((c) => c + 1);
    setToastMessage(`"${recipe.title}" added to your weekly kitchen plan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F2E8] text-[#25241F] font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#281914] text-[#FFFDF8] px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-bold border border-[#E1B52A]/50 font-display"
        >
          <Check className="w-4 h-4 text-[#E1B52A]" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Navigation */}
      <Navbar onSearchClick={handleSearchClick} onPlanClick={handlePlanClick} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onExploreClick={handleExploreClick} onPlanClick={handlePlanClick} />

        {/* Recipe Discovery with Working Filters */}
        <RecipeDiscovery
          onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Video Cooking Sensory Inspiration */}
        <CookingInspiration onExploreClick={handleExploreClick} />

        {/* Kitchen Planner Interactive Preview */}
        <KitchenCompanionPreview />

        {/* Community Recipes & Memories Wall */}
        <CommunitySection />
      </main>

      {/* Recipe Reader Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onSaveToPlan={handleSaveToPlan}
      />

      {/* Footer with Mandatory Disclosure */}
      <Footer onNavClick={handleNavClick} />

    </div>
  );
}
