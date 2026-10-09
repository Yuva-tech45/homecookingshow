export type RecipeCategory = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Desserts';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category?: 'Spices' | 'Produce' | 'Dairy & Fats' | 'Grains & Pulses' | 'Pantry';
}

export interface InstructionStep {
  step: number;
  title: string;
  instruction: string;
  tip?: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  tamilName?: string;
  category: RecipeCategory;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Moderate' | 'Mastery';
  isVegetarian: boolean;
  image: string;
  description: string;
  videoTitle?: string;
  tadkaTip: string;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  nutritionSummary?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface CommunityStory {
  id: string;
  author: string;
  location: string;
  recipeName: string;
  content: string;
  timestamp: string;
  likes: number;
  category: 'Tadka Tip' | 'Family Memory' | 'Kitchen Secret';
}
