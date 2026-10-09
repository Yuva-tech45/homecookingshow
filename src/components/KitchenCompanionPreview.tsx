import React, { useState } from 'react';
import { Calendar, ShoppingBag, Plus, Check, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface DayPlan {
  day: string;
  short: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

const DEFAULT_DAYS: DayPlan[] = [
  { day: 'Monday', short: 'Mon', breakfast: 'Steamed Idli with Sambar', lunch: 'Lemon Rice & Crispy Potato Fry', dinner: 'Creamy Palak Paneer & Roti' },
  { day: 'Tuesday', short: 'Tue', breakfast: 'Ghee Roast Dosa', lunch: 'Curd Rice & Mango Thokku', dinner: 'Chettinad Mushroom Sukka' },
  { day: 'Wednesday', short: 'Wed', breakfast: 'Upma with Coconut Chutney', lunch: 'Tomato Rasam & Steamed Rice', dinner: 'Paneer Butter Masala & Naan' },
  { day: 'Thursday', short: 'Thu', breakfast: 'Poha with Roasted Peanuts', lunch: 'Sambar Rice & Appalam', dinner: 'Dal Tadka & Phulkas' },
  { day: 'Friday', short: 'Fri', breakfast: 'Medu Vada & Filter Kaapi', lunch: 'Bisi Bele Bath & Boondi', dinner: 'Vegetable Kurma & Parotta' },
  { day: 'Saturday', short: 'Sat', breakfast: 'Rava Dosa with Ginger Chutney', lunch: 'Vegetable Dum Biryani', dinner: 'Pav Bhaji Feast' },
  { day: 'Sunday', short: 'Sun', breakfast: 'Poori & Potato Masala', lunch: 'Festive Thali with Saffron Kesari', dinner: 'Comforting Moong Dal Khichdi' },
];

interface GroceryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Spices' | 'Pantry';
  checked: boolean;
}

const INITIAL_GROCERIES: GroceryItem[] = [
  { id: '1', name: 'Fresh Curry Leaves (2 bunches)', category: 'Produce', checked: true },
  { id: '2', name: 'Small Shallots (Chinna Vengayam - 500g)', category: 'Produce', checked: false },
  { id: '3', name: 'Desi Cow Ghee (500ml)', category: 'Pantry', checked: false },
  { id: '4', name: 'Aged Basmati Rice (1kg)', category: 'Pantry', checked: true },
  { id: '5', name: 'Tellicherry Black Peppercorns', category: 'Spices', checked: false },
  { id: '6', name: 'Kashmiri Saffron (1g)', category: 'Spices', checked: false },
];

export const KitchenCompanionPreview: React.FC = () => {
  const { user } = useAuth();
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Tuesday
  const [groceries, setGroceries] = useState<GroceryItem[]>(INITIAL_GROCERIES);
  const [newItemName, setNewItemName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Sync with Firestore when user is logged in
  React.useEffect(() => {
    if (!user) return;
    const groceriesRef = collection(db, 'users', user.uid, 'groceries');
    const unsubscribe = onSnapshot(
      groceriesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: GroceryItem[] = snapshot.docs.map((d) => ({
            id: d.id,
            name: d.data().name,
            category: d.data().category || 'Produce',
            checked: !!d.data().checked,
          }));
          setGroceries(items);
        }
      },
      (error) => {
        console.warn('Firestore groceries notice:', error.message);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const activeDay = DEFAULT_DAYS[selectedDayIndex];

  const toggleGrocery = async (id: string) => {
    const target = groceries.find((g) => g.id === id);
    const newChecked = target ? !target.checked : false;

    setGroceries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: newChecked } : item))
    );

    if (user && target) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'groceries', id);
        await setDoc(
          itemRef,
          {
            id,
            name: target.name,
            category: target.category,
            checked: newChecked,
            userId: user.uid,
          },
          { merge: true }
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/groceries/${id}`);
      }
    }
  };

  const handleAddGrocery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newId = Date.now().toString();
    const newItem: GroceryItem = {
      id: newId,
      name: newItemName.trim(),
      category: 'Produce',
      checked: false,
    };

    setGroceries((prev) => [...prev, newItem]);
    setNewItemName('');

    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'groceries', newId);
        await setDoc(itemRef, {
          ...newItem,
          userId: user.uid,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/groceries/${newId}`);
      }
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section id="companion" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-12 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#68472F] font-display">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E1B52A]" />
          <span>Interactive Feature Preview</span>
          <span className="text-[#68472F]/40">·</span>
          <span>Upcoming Kitchen Workspace</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#281914] tracking-tight">
          A peaceful, organised kitchen workspace.
        </h2>
        <p className="text-base sm:text-lg text-[#58554D] leading-relaxed">
          Say goodbye to the daily 6 PM dilemma: <em>"What should we cook tonight?"</em> HomeCookingShow brings effortless meal schedules, smart pantry checks, and shopping checklists into one gentle workspace.
        </p>
      </div>

      {/* Miniature Interactive Interface Workspace */}
      <div className="bg-[#FFFDF8] rounded-3xl border-2 border-[#68472F]/25 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#68472F]/15">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#281914] text-[#E1B52A]">
              <Calendar className="w-5 h-5 text-[#E1B52A]" />
            </span>
            <div>
              <h3 className="font-display text-xl font-black text-[#281914]">
                Weekly Meal Board & Shopping Sync
              </h3>
              <p className="text-xs text-[#68472F]">Interactive demo preview of planned tools</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#EFE6D6] text-[#281914] border border-[#68472F]/20 self-start sm:self-auto font-display uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#E1B52A]" />
            <span>Interactive Demo · Cloud Sync Ready</span>
          </div>
        </div>

        {/* Dual Panel Grid: Meal Planner Left, Shopping List Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* Left: Interactive Week Planner (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Day Selector Tabs */}
            <div>
              <label className="text-xs uppercase tracking-widest font-black text-[#68472F] block mb-2 font-display">
                Select Day to Preview
              </label>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {DEFAULT_DAYS.map((d, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDayIndex(idx)}
                      type="button"
                      className={`p-2 sm:py-3 rounded-xl text-center transition-all cursor-pointer font-display ${
                        isSelected
                          ? 'bg-[#281914] text-[#E1B52A] shadow-md ring-2 ring-[#E1B52A]/50'
                          : 'bg-[#EFE6D6] text-[#68472F] hover:bg-[#EFE6D6]/80 hover:text-[#281914]'
                      }`}
                    >
                      <span className="block text-[11px] font-mono uppercase font-bold">{d.short}</span>
                      <span className="block text-xs sm:text-sm font-black mt-0.5">
                        {idx + 12}th
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day's Meals */}
            <div className="bg-[#F8F2E8] rounded-2xl p-5 border border-[#68472F]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-lg font-black text-[#281914]">
                  {activeDay.day}’s Kitchen Menu
                </h4>
                <span className="text-xs font-mono font-semibold text-[#68472F]">3 Home-Cooked Dishes</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-[#68472F]/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E1B52A]" />
                    <div>
                      <span className="text-[11px] font-mono uppercase font-bold text-[#68472F]">Breakfast</span>
                      <p className="text-sm font-bold text-[#281914] font-display">{activeDay.breakfast}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#40583A] bg-[#40583A]/10 px-2.5 py-0.5 rounded font-display uppercase tracking-wider">
                    Planned
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#68472F]/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#40583A]" />
                    <div>
                      <span className="text-[11px] font-mono uppercase font-bold text-[#68472F]">Lunch</span>
                      <p className="text-sm font-bold text-[#281914] font-display">{activeDay.lunch}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#40583A] bg-[#40583A]/10 px-2.5 py-0.5 rounded font-display uppercase tracking-wider">
                    Planned
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#68472F]/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C84932]" />
                    <div>
                      <span className="text-[11px] font-mono uppercase font-bold text-[#68472F]">Dinner</span>
                      <p className="text-sm font-bold text-[#281914] font-display">{activeDay.dinner}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#40583A] bg-[#40583A]/10 px-2.5 py-0.5 rounded font-display uppercase tracking-wider">
                    Planned
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Smart Shopping Checklist (5 Columns) */}
          <div className="lg:col-span-5 space-y-4 bg-[#F8F2E8] p-5 sm:p-6 rounded-2xl border border-[#68472F]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#68472F]" />
                <h4 className="font-display text-base font-black text-[#281914]">
                  Market Shopping List
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#68472F]">
                {groceries.filter((g) => g.checked).length}/{groceries.length} gathered
              </span>
            </div>

            {/* Quick Add item form */}
            <form onSubmit={handleAddGrocery} className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add ingredient (e.g. Sambar powder)..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#68472F]/25 rounded-lg text-[#281914] placeholder-[#8B877E] focus:outline-none focus:ring-2 focus:ring-[#E1B52A]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#281914] text-[#E1B52A] rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#3D261E] transition-colors flex items-center gap-1 shrink-0 font-display cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Checklist items */}
            <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
              {groceries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleGrocery(item.id)}
                  type="button"
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                    item.checked
                      ? 'bg-stone-100 border-stone-200 text-[#8B877E] line-through'
                      : 'bg-white border-[#68472F]/15 text-[#281914] hover:border-[#E1B52A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        item.checked ? 'bg-[#40583A] border-[#40583A] text-white' : 'border-[#68472F]/40 bg-white'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#68472F] uppercase">{item.category}</span>
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Dark Walnut CTA Banner */}
        <div className="mt-8 pt-8 border-t border-[#68472F]/20 bg-[#281914] text-white -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 p-6 sm:p-8 rounded-b-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-display text-lg font-black text-[#FFFDF8]">
                Be the first to test the full HomeCookingShow kitchen suite
              </h4>
              <p className="text-xs sm:text-sm text-[#F8F2E8]/80 font-normal">
                Get notified when printable recipe cards, cloud grocery sync, and step cooking timers launch.
              </p>
            </div>

            {isSubscribed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#40583A] text-[#FFFDF8] rounded-xl text-sm font-bold border border-[#40583A]/50">
                <Check className="w-4 h-4 text-[#E1B52A]" />
                <span>You're on the list! We'll send early invites.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto items-stretch gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-2.5 text-xs sm:text-sm bg-[#3D261E] border border-[#68472F]/60 rounded-xl text-white placeholder-[#F8F2E8]/50 focus:outline-none focus:ring-2 focus:ring-[#E1B52A] w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E1B52A] text-[#281914] font-black text-xs sm:text-sm rounded-xl hover:bg-[#CCA21E] transition-colors whitespace-nowrap shadow-sm font-display uppercase tracking-wider cursor-pointer"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};
