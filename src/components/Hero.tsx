import React from 'react';
import { ArrowRight, ChefHat, Clock, Flame, Play } from 'lucide-react';
import { heroImg } from '../data/recipes';

interface HeroProps {
  onExploreClick: () => void;
  onPlanClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onPlanClick }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-wood-grain text-white border-b border-[#68472F]/40">
      
      {/* Warm ambient kitchen lighting glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E1B52A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C84932]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Video-Inspired Typography & Calls to Action */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7">
            
            {/* Short Section Kicker & Script Touch */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#3D261E] border border-[#E1B52A]/40 rounded-md text-[11px] font-extrabold uppercase tracking-widest text-[#E1B52A] font-display">
                Indian Cooking Show
              </span>
              <span className="font-script text-2xl text-[#E1B52A] tracking-wide transform -rotate-1 hidden sm:inline">
                Made with love & desi ghee
              </span>
            </div>

            {/* Confident, High-Impact Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FFFDF8] leading-[1.1] text-balance">
              Your next favourite <span className="text-[#E1B52A] relative inline-block">
                meal
                <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#E1B52A]/60" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span> starts here.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#F8F2E8]/85 leading-relaxed max-w-xl font-normal">
              Discover recipes, cook along with your favourite videos, and bring more joy to your everyday kitchen.
            </p>

            {/* Calls to Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                type="button"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#E1B52A] hover:bg-[#CCA21E] text-[#281914] font-extrabold text-base rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFDF8] transform hover:-translate-y-0.5"
              >
                <span>Explore Recipes</span>
                <ArrowRight className="w-5 h-5 text-[#281914]" />
              </button>

              <button
                onClick={onPlanClick}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3D261E] hover:bg-[#513623] text-[#FFFDF8] font-bold text-base rounded-xl border border-[#68472F]/60 hover:border-[#E1B52A]/60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1B52A]"
              >
                <span>Plan My Meals</span>
              </button>
            </div>

            {/* Video-Tested Kitchen Guarantees */}
            <div className="pt-4 border-t border-[#68472F]/40 flex flex-wrap items-center gap-6 text-sm text-[#F8F2E8]/75 font-medium">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#E1B52A]" />
                <span>Video-tested proportions</span>
              </div>
              <span className="text-[#68472F]">·</span>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C84932]" />
                <span>Master the tempering tadka</span>
              </div>
              <span className="text-[#68472F]">·</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#40583A]" />
                <span>Stress-free weeknights</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Video Thumbnail-Inspired Food Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Rustic dark wood textured backing frame */}
              <div className="absolute -inset-3 bg-[#3D261E] rounded-3xl -rotate-1 border border-[#68472F]/50 shadow-2xl" />
              
              {/* Main Food Photography Presentation */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#68472F]/60 bg-[#1E120E] aspect-16/10 group">
                <img
                  src={heroImg}
                  alt="Authentic spread of South and North Indian dishes in brass and clay handis"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Contrast Vignette Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E120E]/95 via-[#1E120E]/30 to-transparent" />
                
                {/* Top Video Indicator Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#281914]/90 backdrop-blur-md rounded-md border border-[#E1B52A]/50 text-xs font-black uppercase tracking-wider text-[#E1B52A] font-display flex items-center gap-1.5 shadow-md">
                    <Play className="w-3 h-3 fill-current text-[#E1B52A]" />
                    <span>Watch & Cook</span>
                  </span>
                </div>

                {/* Bottom Video Metadata Lockup */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#E1B52A] font-display">
                        Featured Recipe Showcase
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-black text-[#FFFDF8] leading-tight">
                        Sunday Homestyle Grand Feast
                      </h3>
                      <p className="text-xs text-[#F8F2E8]/80 hidden sm:block">
                        Layered parottas, rich simmered curries & fragrant ghee rice
                      </p>
                    </div>

                    {/* Mustard duration pill */}
                    <div className="shrink-0 px-3 py-1.5 bg-[#E1B52A] text-[#281914] rounded-lg font-mono font-black text-xs shadow-md">
                      45m Prep
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Chef Tadka Secret Note */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#3D261E]/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-[#E1B52A]/30 max-w-xs transition-transform hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E1B52A] text-[#281914] flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <Flame className="w-4 h-4 text-[#281914]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#FFFDF8] uppercase tracking-wide font-display">Video Cooking Secret</p>
                    <p className="text-xs text-[#F8F2E8]/80 leading-relaxed mt-0.5">
                      "Crackle the whole mustard seeds first; once they quieten down, slide in your fresh curry leaves."
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
