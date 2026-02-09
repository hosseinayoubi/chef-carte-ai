import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { items, preferences } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Items array is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Save fridge list
    const { data: fridgeList, error: fridgeError } = await supabaseClient
      .from('fridge_lists')
      .insert({ user_id: user.id, items, preferences, title: `Fridge ${new Date().toLocaleDateString()}` })
      .select()
      .single();

    if (fridgeError) {
      console.error('Fridge list error:', fridgeError);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional chef AI. Generate 6-8 recipe recommendations based on the user's available ingredients. 

STRICT RULES:
- Prioritize recipes that use ONLY the available ingredients
- If suggesting recipes with missing ingredients, keep missing count to 1-3 max
- Provide realistic cooking times and difficulty levels
- Include practical substitution options for missing ingredients
- Never suggest unsafe food combinations
- Provide accurate nutrition estimates

Return ONLY valid JSON matching this exact schema:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief appetizing description",
      "cuisine": "Cuisine Type",
      "timeMinutes": 30,
      "difficulty": "easy" | "medium" | "hard",
      "matchScore": 85,
      "hasIngredients": ["ingredient1", "ingredient2"],
      "missingIngredients": ["missing1"],
      "substitutions": [{"missing": "ingredient", "options": ["sub1", "sub2"]}],
      "steps": ["Step 1", "Step 2"],
      "tips": ["Helpful tip"],
      "nutrition": {"calories": 400, "proteinG": 25, "carbsG": 30, "fatG": 15}
    }
  ]
}`;

    const userPrompt = `Available ingredients: ${items.join(', ')}
${preferences?.dietary?.length ? `Dietary requirements: ${preferences.dietary.join(', ')}` : ''}
${preferences?.cuisine?.length ? `Preferred cuisines: ${preferences.cuisine.join(', ')}` : ''}
${preferences?.skillLevel ? `Skill level: ${preferences.skillLevel}` : ''}
${preferences?.availableTime ? `Available time: ${preferences.availableTime} minutes` : ''}
${preferences?.servings ? `Servings needed: ${preferences.servings}` : ''}

Generate recipe recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    let recipes;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]).recipes;
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse recipe data');
    }

    // Save recipes to database
    const recipesToSave = recipes.map((recipe: Record<string, unknown>) => ({
      user_id: user.id,
      fridge_list_id: fridgeList?.id,
      name: recipe.name,
      description: recipe.description,
      cuisine: recipe.cuisine,
      time_minutes: recipe.timeMinutes,
      difficulty: recipe.difficulty,
      match_score: recipe.matchScore,
      has_ingredients: recipe.hasIngredients,
      missing_ingredients: recipe.missingIngredients,
      substitutions: recipe.substitutions,
      steps: recipe.steps,
      tips: recipe.tips,
      nutrition: recipe.nutrition,
    }));

    const { data: savedRecipes, error: saveError } = await supabaseClient
      .from('recipes')
      .insert(recipesToSave)
      .select();

    if (saveError) {
      console.error('Save error:', saveError);
    }

    const responseRecipes = savedRecipes?.map((r, i) => ({
      id: r.id,
      ...recipes[i],
    })) || recipes.map((r: Record<string, unknown>, i: number) => ({ id: `temp-${i}`, ...r }));

    return new Response(JSON.stringify({ recipes: responseRecipes, fridgeListId: fridgeList?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
