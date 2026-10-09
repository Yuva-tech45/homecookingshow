import React, { useState, useEffect } from 'react';
import { Heart, PlusCircle, Check, Send, Sparkles, MapPin, LogIn } from 'lucide-react';
import { CommunityStory } from '../types/recipe';
import { INITIAL_COMMUNITY_STORIES } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, increment, query, limit } from 'firebase/firestore';

export const CommunitySection: React.FC = () => {
  const { user, signIn } = useAuth();
  const [stories, setStories] = useState<CommunityStory[]>(INITIAL_COMMUNITY_STORIES);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Tadka Tip' | 'Family Memory' | 'Kitchen Secret'>('Tadka Tip');
  const [successToast, setSuccessToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync author name with logged in user
  useEffect(() => {
    if (user?.displayName && !author) {
      setAuthor(user.displayName);
    }
  }, [user]);

  // Real-time Firestore Listener
  useEffect(() => {
    const storiesRef = collection(db, 'communityStories');
    const q = query(storiesRef, limit(20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: CommunityStory[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              author: data.author || 'Home Cook',
              location: data.location || 'Home Kitchen',
              recipeName: data.recipeName || 'Homemade Dish',
              content: data.content || '',
              timestamp: data.timestamp || 'Recently',
              likes: data.likes || 0,
              category: data.category || 'Tadka Tip',
            };
          });
          setStories(fetched);
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot notice:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleLike = async (id: string) => {
    const isCurrentlyLiked = !!likedStories[id];
    const newStatus = !isCurrentlyLiked;
    
    // Update local state immediately for instant feedback
    setStories((currStories) =>
      currStories.map((story) =>
        story.id === id
          ? { ...story, likes: story.likes + (newStatus ? 1 : -1) }
          : story
      )
    );
    setLikedStories((prev) => ({ ...prev, [id]: newStatus }));

    // Persist to Firestore if document exists
    try {
      const docRef = doc(db, 'communityStories', id);
      await updateDoc(docRef, {
        likes: increment(newStatus ? 1 : -1),
      });
    } catch {
      // Offline fallback
    }
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || !recipeName.trim()) return;

    if (!user) {
      await signIn();
      return;
    }

    setSubmitting(true);
    const newStoryId = `story-${Date.now()}`;
    const newStory: CommunityStory = {
      id: newStoryId,
      author: author.trim(),
      location: location.trim() || 'Home Kitchen',
      recipeName: recipeName.trim(),
      content: content.trim(),
      timestamp: 'Just now',
      likes: 1,
      category,
    };

    setStories((prev) => [newStory, ...prev]);
    setLikedStories((prev) => ({ ...prev, [newStoryId]: true }));
    setIsModalOpen(false);

    try {
      const storyRef = doc(db, 'communityStories', newStoryId);
      await setDoc(storyRef, {
        ...newStory,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `communityStories/${newStoryId}`);
    } finally {
      setSubmitting(false);
      setRecipeName('');
      setContent('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }
  };

  return (
    <section id="community" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#68472F]/20">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#40583A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce border border-[#E1B52A]/40 font-display">
          <Check className="w-4 h-4 text-[#E1B52A]" />
          <span>Your kitchen memory has been added to the community wall!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#281914] text-[#E1B52A] text-[11px] font-black uppercase tracking-wider rounded font-display">
              Community Table
            </span>
            <span className="font-script text-xl text-[#68472F]">Real cooks, authentic tips</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#281914] tracking-tight">
            From Home Kitchens Around the World
          </h2>
          <p className="text-base text-[#58554D] leading-relaxed font-normal">
            The joy of home cooking is magnified when shared. Discover secret family seasoning tricks, triumphant dinner stories, and personal twists from fellow cooks inspired by the videos.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              signIn();
            } else {
              setIsModalOpen(true);
            }
          }}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E1B52A] hover:bg-[#CCA21E] text-[#281914] font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all self-start md:self-auto shrink-0 cursor-pointer font-display"
        >
          {user ? (
            <>
              <PlusCircle className="w-4 h-4 text-[#281914]" />
              <span>Share Your Kitchen Memory</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-[#281914]" />
              <span>Sign In to Share Memory</span>
            </>
          )}
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((story) => {
          const isLiked = !!likedStories[story.id];
          return (
            <article
              key={story.id}
              className="bg-[#FFFDF8] rounded-2xl border border-[#68472F]/20 hover:border-[#E1B52A]/60 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-[#281914] font-display">{story.author}</h3>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#68472F] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E1B52A]" />
                      <span>{story.location}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#E1B52A] bg-[#281914] px-2.5 py-1 rounded-md font-display uppercase tracking-wider">
                    {story.category}
                  </span>
                </div>

                {/* Recipe Tag */}
                <div className="text-xs font-bold text-[#40583A] font-display uppercase tracking-wider">
                  Dish: {story.recipeName}
                </div>

                {/* Content */}
                <p className="text-sm text-[#58554D] leading-relaxed italic">
                  "{story.content}"
                </p>
              </div>

              {/* Bottom bar */}
              <div className="pt-4 mt-4 border-t border-[#68472F]/15 flex items-center justify-between text-xs text-[#68472F]">
                <span className="font-medium">{story.timestamp}</span>
                <button
                  onClick={() => toggleLike(story.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
                    isLiked
                      ? 'text-rose-600 bg-rose-50'
                      : 'hover:text-[#281914] hover:bg-[#EFE6D6]'
                  }`}
                  aria-label="Applaud tip"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-mono">{story.likes}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Share Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#FFFDF8] w-full max-w-lg rounded-2xl shadow-2xl border-2 border-[#68472F]/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#281914] text-white px-6 py-4 border-b border-[#68472F]/40">
              <div>
                <h3 className="font-display text-xl font-black text-[#FFFDF8]">
                  Share a Kitchen Memory or Tip
                </h3>
                <p className="text-xs text-[#E1B52A] mt-0.5 font-sans">
                  Your tip will be shared live to the community board.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="text-[#F8F2E8]/70 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStory} className="p-6 sm:p-8 space-y-4 bg-[#FFFDF8]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#281914] block mb-1 font-display uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Ananya R."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#281914] block mb-1 font-display uppercase tracking-wider">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chennai, India"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#281914] block mb-1 font-display uppercase tracking-wider">
                  Dish or Recipe Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="e.g. Crispy Medu Vada, Filter Kaapi, Sambar..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#281914] block mb-1 font-display uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
                >
                  <option value="Tadka Tip">Tadka Tip (Technique)</option>
                  <option value="Kitchen Secret">Kitchen Secret (Flavor twist)</option>
                  <option value="Family Memory">Family Memory (Story)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#281914] block mb-1 font-display uppercase tracking-wider">
                  Your Memory or Tip *
                </label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What made this dish special? Did a particular cooking cue help it turn out delicious?"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#68472F]/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#68472F] hover:bg-[#EFE6D6] rounded-lg cursor-pointer font-display uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-black text-[#281914] bg-[#E1B52A] hover:bg-[#CCA21E] rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 font-display uppercase tracking-wider"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Publishing...' : 'Publish to Community'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
