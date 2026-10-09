import React, { useState, useEffect } from 'react';
import { X, Clock, Users, Flame, Check, Bookmark, Share2, Sparkles } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSaveToPlan?: (recipe: Recipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onSaveToPlan }) => {
  const { user } = useAuth();
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Reset state when recipe changes
    if (recipe) {
      setServingsMultiplier(1);
      setCheckedIngredients({});
      setActiveStep(1);
      setIsSaved(false);
    }
  }, [recipe]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!recipe) return null;

  const currentServings = Math.round(recipe.servings * servingsMultiplier);

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FFFDF8] w-full max-w-4xl rounded-2xl shadow-2xl border-2 border-[#68472F]/30 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark Walnut Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#281914] text-[#FFFDF8] border-b border-[#68472F]/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest font-black text-[#E1B52A] font-display">
              {recipe.cuisine} · {recipe.category}
            </span>
            {recipe.tamilName && (
              <span className="text-xs text-[#F8F2E8]/60 font-sans">
                ({recipe.tamilName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              type="button"
              className="p-2 text-[#F8F2E8]/70 hover:text-[#FFFDF8] hover:bg-[#3D261E] rounded-lg transition-colors cursor-pointer"
              title="Copy recipe link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={async () => {
                const nextSaved = !isSaved;
                setIsSaved(nextSaved);
                if (onSaveToPlan) onSaveToPlan(recipe);
                if (user) {
                  try {
                    const docRef = doc(db, 'users', user.uid, 'savedRecipes', recipe.id);
                    if (nextSaved) {
                      await setDoc(docRef, {
                        recipeId: recipe.id,
                        title: recipe.title,
                        category: recipe.category,
                        savedAt: new Date().toISOString(),
                        userId: user.uid,
                      });
                    } else {
                      await deleteDoc(docRef);
                    }
                  } catch (error) {
                    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/savedRecipes/${recipe.id}`);
                  }
                }
              }}
              type="button"
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isSaved ? 'text-[#281914] bg-[#E1B52A]' : 'text-[#F8F2E8]/70 hover:text-[#FFFDF8] hover:bg-[#3D261E]'
              }`}
              title="Save to Kitchen Plan"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-[#F8F2E8]/70 hover:text-[#FFFDF8] hover:bg-[#3D261E] rounded-lg transition-colors ml-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-8 divide-y divide-[#68472F]/15 bg-[#FFFDF8]">
          
          {/* Hero Recipe Card Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <h2 id="recipe-modal-title" className="font-display text-2xl sm:text-3xl font-black text-[#281914] tracking-tight">
                {recipe.title}
              </h2>
              <p className="text-sm sm:text-base text-[#58554D] leading-relaxed">
                {recipe.description}
              </p>

              {/* Timing & Spec strip */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-[#281914] font-display">
                <div className="flex items-center gap-1.5 bg-[#F8F2E8] px-3 py-1.5 rounded-lg border border-[#68472F]/20 shadow-2xs">
                  <Clock className="w-4 h-4 text-[#E1B52A]" />
                  <span>Prep: {recipe.prepTimeMinutes}m</span>
                  <span className="text-stone-400">·</span>
                  <span>Cook: {recipe.cookTimeMinutes}m</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8F2E8] px-3 py-1.5 rounded-lg border border-[#68472F]/20 shadow-2xs">
                  <Users className="w-4 h-4 text-[#40583A]" />
                  <span>Base: {recipe.servings} Servings</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8F2E8] px-3 py-1.5 rounded-lg border border-[#68472F]/20 shadow-2xs">
                  <Flame className="w-4 h-4 text-[#C84932]" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-md border-2 border-[#68472F]/30 aspect-4/3 relative bg-[#281914]">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Dark Walnut Tadka Secret Card */}
          <div className="pt-6">
            <div className="bg-[#281914] border-2 border-[#E1B52A]/50 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-md text-white">
              <div className="w-9 h-9 rounded-lg bg-[#E1B52A] text-[#281914] flex items-center justify-center shrink-0 font-bold">
                <Sparkles className="w-5 h-5 text-[#281914]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#E1B52A] tracking-wider uppercase font-display">The Video Tadka Secret</h4>
                <p className="text-sm text-[#F8F2E8]/90 leading-relaxed font-normal">
                  {recipe.tadkaTip}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Ingredients List */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-black text-[#281914]">
                  Ingredients Checklist
                </h3>
                <p className="text-xs text-[#68472F]">Tap items as you prepare them in your kitchen.</p>
              </div>

              {/* Servings Adjuster */}
              <div className="flex items-center gap-2 bg-[#F8F2E8] px-3 py-1.5 rounded-lg border border-[#68472F]/20 self-start sm:self-auto">
                <span className="text-xs text-[#281914] font-bold font-display">Servings:</span>
                {[0.5, 1, 1.5, 2].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setServingsMultiplier(m)}
                    className={`px-2.5 py-0.5 text-xs font-bold rounded transition-colors cursor-pointer font-display ${
                      servingsMultiplier === m
                        ? 'bg-[#281914] text-[#E1B52A]'
                        : 'text-[#68472F] hover:bg-white'
                    }`}
                  >
                    {Math.round(recipe.servings * m)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.name];
                const calculatedAmount = Number((ing.amount * servingsMultiplier).toFixed(2));
                return (
                  <button
                    key={ing.name}
                    type="button"
                    onClick={() => toggleIngredient(ing.name)}
                    className={`flex items-center justify-between text-left p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-stone-100 border-stone-200 text-[#8B877E] line-through'
                        : 'bg-[#FFFDF8] border-[#68472F]/20 text-[#281914] hover:border-[#E1B52A] hover:bg-[#F8F2E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#40583A] border-[#40583A] text-white' : 'border-[#68472F]/40 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{ing.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#68472F] shrink-0 ml-2">
                      {calculatedAmount} {ing.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="pt-6 space-y-4">
            <h3 className="font-display text-xl font-black text-[#281914]">
              Step-by-Step Cooking Method
            </h3>

            <div className="space-y-4">
              {recipe.instructions.map((step) => (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === step.step
                      ? 'bg-[#F8F2E8] border-[#E1B52A] shadow-sm'
                      : 'bg-white border-[#68472F]/15 hover:border-[#68472F]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-display ${
                        activeStep === step.step
                          ? 'bg-[#E1B52A] text-[#281914]'
                          : 'bg-[#281914] text-[#E1B52A]'
                      }`}
                    >
                      {step.step}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-[#281914] font-display">
                          {step.title}
                        </h4>
                        {step.durationMinutes && (
                          <span className="text-xs font-mono font-semibold text-[#68472F] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#E1B52A]" />
                            ~{step.durationMinutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#58554D] leading-relaxed">
                        {step.instruction}
                      </p>
                      {step.tip && (
                        <p className="text-xs text-[#40583A] font-semibold bg-[#40583A]/10 p-2 rounded-lg mt-2 border border-[#40583A]/20">
                          <span>Pro tip:</span> {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#F8F2E8] border-t border-[#68472F]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-[#68472F] text-center sm:text-left font-medium">
            Inspired by Indian home-cooking video tutorials. Tested for home kitchens.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-[#68472F] hover:text-[#281914] bg-white border border-[#68472F]/20 rounded-lg cursor-pointer font-display uppercase tracking-wider"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (onSaveToPlan) onSaveToPlan(recipe);
                onClose();
              }}
              type="button"
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-black text-[#281914] bg-[#E1B52A] hover:bg-[#CCA21E] rounded-lg shadow-sm cursor-pointer font-display uppercase tracking-wider"
            >
              Add to Weekly Meal Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
