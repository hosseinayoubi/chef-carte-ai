import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { IngredientInput } from '@/components/IngredientInput';
import { PreferencesForm } from '@/components/PreferencesForm';
import { TicketLoader } from '@/components/TicketLoader';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { toast } from 'sonner';
import { Sparkles, ChefHat } from 'lucide-react';
import type { FridgePreferences } from '@/lib/types';

export default function Fridge() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<FridgePreferences>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView('fridge');
  }, []);

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }
    if (!user) {
      toast.error('Please sign in to generate recipes');
      navigate('/login');
      return;
    }

    setLoading(true);
    trackEvent('generate_clicked', { ingredientCount: ingredients.length });

    try {
      const allIngredients = preferences.includePantryStaples 
        ? [...ingredients, ...(preferences.pantryStaples || [])]
        : ingredients;

      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { items: allIngredients, preferences }
      });

      if (error) throw error;

      sessionStorage.setItem('lastRecipes', JSON.stringify(data));
      navigate('/results');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <TicketLoader message="Our AI chef is crafting your personalized menu..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy/10 text-burgundy mb-4">
            <ChefHat className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal mb-3">
            What's in Your Fridge?
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your ingredients and we'll find the perfect recipes for you.
          </p>
        </div>

        <div className="space-y-6">
          <div className="paper-card p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Your Ingredients</h2>
            <IngredientInput
              ingredients={ingredients}
              onChange={setIngredients}
              placeholder="e.g., chicken, tomatoes, garlic..."
            />
          </div>

          <PreferencesForm preferences={preferences} onChange={setPreferences} />

          <Button
            variant="bistro"
            size="xl"
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={ingredients.length === 0}
          >
            <Sparkles className="h-5 w-5" />
            Generate Recipes
          </Button>
        </div>
      </div>
    </Layout>
  );
}
