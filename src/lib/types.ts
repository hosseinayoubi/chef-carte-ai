export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  timeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  matchScore: number;
  hasIngredients: string[];
  missingIngredients: string[];
  substitutions: { missing: string; options: string[] }[];
  steps: string[];
  tips: string[];
  nutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  saved?: boolean;
  createdAt?: string;
  fridgeListId?: string;
}

export interface FridgeList {
  id: string;
  title: string;
  items: string[];
  preferences: FridgePreferences;
  createdAt: string;
}

export interface FridgePreferences {
  dietary?: string[];
  allergies?: string[];
  cuisine?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  availableTime?: number;
  servings?: number;
  includePantryStaples?: boolean;
  pantryStaples?: string[];
}

export interface GenerateRecipesRequest {
  items: string[];
  preferences: FridgePreferences;
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
  fridgeListId: string;
}

export const DEFAULT_PANTRY_STAPLES = [
  'salt',
  'pepper',
  'olive oil',
  'vegetable oil',
  'butter',
  'flour',
  'sugar',
  'rice',
  'pasta',
  'garlic',
  'onions',
  'eggs',
  'milk',
  'soy sauce',
  'vinegar',
  'honey',
  'chicken broth',
  'canned tomatoes',
  'dried herbs',
  'baking powder',
];

export const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'keto', label: 'Keto' },
];

export const CUISINE_OPTIONS = [
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'indian', label: 'Indian' },
  { value: 'thai', label: 'Thai' },
  { value: 'french', label: 'French' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'korean', label: 'Korean' },
];

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner Chef' },
  { value: 'intermediate', label: 'Home Cook' },
  { value: 'advanced', label: 'Experienced Chef' },
];
