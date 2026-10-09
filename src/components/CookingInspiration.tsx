import React, { useState } from 'react';
import { Sparkles, Volume2, ArrowRight, Flame } from 'lucide-react';
import { inspirationImg } from '../data/recipes';

interface CookingInspirationProps {
  onExploreClick: () => void;
}

export const CookingInspiration: React.FC<CookingInspirationProps> = ({ onExploreClick }) => {
  const [activeRhythm, setActiveRhythm] = useState(0);

  const rhythms = [
    {
      title: 'The Spluttering Tadka',
      subtitle: 'First 60 seconds',
      description: 'The instant mustard seeds pop in hot ghee or sesame oil, add hing and torn curry leaves. The sound and sudden burst of aroma wakes up your senses.',
      technique: 'Never let mustard seeds stay unpopped; unbroken seeds taste bitter.',
    },
    {
      title: 'The Patient Golden Onion',
      subtitle: 'Minutes 2 to 8',
      description: 'Slowly sautéing finely sliced shallots or onions with a pinch of salt until they transition from translucent to deep caramel amber.',
      technique: 'Medium flame preserves the natural sweetness without scorching.',
    },
    {
      title: 'The Masala Oil Separation',
      subtitle: 'Minutes 8 to 15',
      description: 'Cooking ginger, garlic, and freshly pounded spice powders with tomatoes until bright red droplets of oil bead around the rim of your kadai.',
      technique: 'This is the visual cue that raw spices are fully cooked and mellowed.',
    },
    {
      title: 'The Dum & Resting Simmer',
      subtitle: 'Final 15 minutes',
      description: 'Turning the heat down to low, covering the pot, and allowing steam to marry every flavor together into a harmonious gravy.',
      technique: 'Rest curries for 10 minutes off heat before serving; the taste deepens noticeably.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-wood-grain text-white border-y border-[#68472F]/40 relative overflow-hidden">
      
      {/* Warm ambient kitchen lighting glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#E1B52A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#E1B52A] font-display">
            <Flame className="w-4 h-4 text-[#E1B52A]" />
            <span>The Video Cooking Experience</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFFDF8] leading-tight tracking-tight">
            Step into the rhythm of your home kitchen.
          </h2>
          <p className="text-base sm:text-lg text-[#F8F2E8]/85 leading-relaxed font-normal">
            Cooking alongside videos is not just about memorizing a checklist—it's about training your senses. Listen for the sizzle of the tempering, smell when roasted spices turn fragrant, and cook with genuine confidence.
          </p>
        </div>

        {/* 2-Column Split: Visual Cinematic Showcase & Interactive Rhythm Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Cinematic Sizzling Tadka Feature */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#68472F]/60 aspect-16/10 bg-[#1E120E] group">
              <img
                src={inspirationImg}
                alt="Sizzling mustard seeds and curry leaves in hot ghee inside a seasoned cast iron skillet"
                className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Contrast Vignette Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E120E]/95 via-[#1E120E]/30 to-transparent" />

              {/* In-Image Caption Strip */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#E1B52A] font-extrabold tracking-widest uppercase font-display">
                  <Volume2 className="w-4 h-4" />
                  <span>The Music of the Kadai</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-[#FFFDF8]">
                  Curry leaves crackling in golden ghee
                </h3>
                <p className="text-xs sm:text-sm text-[#F8F2E8]/80 max-w-lg leading-relaxed line-clamp-2">
                  Notice the precise moment the spluttering quiets down—that's when your vegetables or lentils are ready to dive in.
                </p>
              </div>

              {/* Fan Project Visual Label */}
              <div className="absolute top-4 right-4 bg-[#281914]/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-bold text-[#E1B52A] border border-[#68472F]/60 font-display uppercase tracking-wider">
                Fan Kitchen Visual
              </div>
            </div>
          </div>

          {/* Right: Interactive 4 Rhythms Guide */}
          <div className="lg:col-span-5 space-y-3">
            <div className="pb-2">
              <h4 className="text-xs uppercase tracking-widest font-black text-[#E1B52A] font-display">
                The Four Sensory Milestones
              </h4>
              <p className="text-xs text-[#F8F2E8]/70 mt-0.5">Click any stage to reveal its cooking cue</p>
            </div>

            <div className="space-y-2.5">
              {rhythms.map((rhythm, idx) => {
                const isActive = activeRhythm === idx;
                return (
                  <div
                    key={rhythm.title}
                    onClick={() => setActiveRhythm(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3D261E] border-[#E1B52A] shadow-md ring-1 ring-[#E1B52A]/50'
                        : 'bg-[#281914]/80 border-[#68472F]/40 hover:bg-[#3D261E]/70 hover:border-[#68472F]/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#E1B52A]">
                            0{idx + 1}.
                          </span>
                          <h5 className="text-sm font-black text-[#FFFDF8] font-display">
                            {rhythm.title}
                          </h5>
                        </div>
                        <p className="text-xs text-[#F8F2E8]/80 leading-relaxed">
                          {rhythm.description}
                        </p>
                        {isActive && (
                          <div className="pt-2 text-xs font-medium text-[#E1B52A] border-t border-[#68472F]/40 mt-2">
                            <span className="font-bold">Sensory Rule:</span> {rhythm.technique}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#F8F2E8]/60 shrink-0">
                        {rhythm.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section CTA */}
            <div className="pt-4">
              <button
                onClick={onExploreClick}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#E1B52A] hover:text-[#FFFDF8] group cursor-pointer font-display"
              >
                <span>Find recipes featuring authentic tadka</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E1B52A]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
