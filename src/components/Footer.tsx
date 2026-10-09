import React from 'react';
import { UtensilsCrossed, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavClick: (selector: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-[#281914] text-[#F8F2E8]/80 pt-16 pb-12 border-t-2 border-[#68472F]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#68472F]/30">
          
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#E1B52A] text-[#281914] flex items-center justify-center font-black">
                <UtensilsCrossed className="w-4 h-4 text-[#281914]" />
              </span>
              <span className="font-display text-2xl font-black text-[#FFFDF8] tracking-tight">
                HomeCooking<span className="text-[#E1B52A]">Show</span>
              </span>
            </div>
            
            <p className="text-sm text-[#F8F2E8]/70 leading-relaxed max-w-sm">
              An affectionate, fan-created cooking hub dedicated to translating the sensory pleasure of warm Indian cooking tutorials into joyful, stress-free everyday kitchen triumphs.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#E1B52A] font-semibold font-display">
              <Sparkles className="w-3.5 h-3.5 text-[#E1B52A]" />
              <span>Dedicated to home cooks who love cooking with warmth and care.</span>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E1B52A] font-display">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#discover')}
                  className="text-[#F8F2E8]/80 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Recipe Discovery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#recipes')}
                  className="text-[#F8F2E8]/80 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Featured Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#companion')}
                  className="text-[#F8F2E8]/80 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Kitchen Planner (Preview)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#community')}
                  className="text-[#F8F2E8]/80 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Community Kitchen Wall
                </button>
              </li>
            </ul>
          </div>

          {/* Culinary Categories (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E1B52A] font-display">
              Recipe Pillars
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#F8F2E8]/70">
              <div>• South Indian Breakfasts</div>
              <div>• Fragrant Dum Biryanis</div>
              <div>• Rich North Indian Curries</div>
              <div>• Crisp Evening Tiffin</div>
              <div>• Traditional Saffron Sweets</div>
              <div>• Quick Rasam & Tadkas</div>
            </div>
            <p className="text-[11px] text-[#F8F2E8]/60 pt-2 font-mono">
              All recipe formulations are tested for home stovetops with metric and cup measures.
            </p>
          </div>

        </div>

        {/* Mandatory Explicit Legal & Fan-Made Disclosure */}
        <div className="pt-8 space-y-4">
          <div className="bg-[#1E120E] rounded-xl p-4 sm:p-5 border border-[#68472F]/50 text-xs text-[#F8F2E8]/70 leading-relaxed">
            <p className="font-bold text-[#E1B52A] mb-1 uppercase tracking-wider font-display">
              Independent Fan-Project Disclosure:
            </p>
            <p>
              An independent, fan-made project inspired by HomeCookingShow. Not affiliated with, endorsed by, or operated by HomeCookingShow or Hema Subramanian. All trademarks, channel names, and creator references belong to their respective copyright owners. This website does not sell merchandise or collect payments on behalf of the creators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F2E8]/60 pt-2 font-medium">
            <p>© {new Date().getFullYear()} HomeCookingShow (Unofficial Fan Project) · Version A Prototype</p>
            <p className="flex items-center gap-1.5 text-[#E1B52A]">
              <span>Made with care & desi ghee</span>
              <Heart className="w-3.5 h-3.5 text-[#C84932] fill-current" />
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
