import { Link } from 'react-router-dom';
import { Clock, ChefHat, Sparkles, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (recipe: Recipe) => void;
  onMoreLikeThis?: (recipe: Recipe) => void;
  index?: number;
}

const difficultyColors = {
  easy: 'bg-forest/10 text-forest border-forest/20',
  medium: 'bg-gold/20 text-charcoal border-gold/40',
  hard: 'bg-burgundy/10 text-burgundy border-burgundy/20',
};

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Advanced',
};

export function RecipeCard({ recipe, onSave, onMoreLikeThis, index = 0 }: RecipeCardProps) {
  const hasMissingIngredients = recipe.missingIngredients.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="paper-card overflow-hidden group"
    >
      {/* Header with match score */}
      <div className="bg-gradient-to-r from-burgundy to-burgundy-light p-4 text-cream">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold truncate">
              {recipe.name}
            </h3>
            <p className="text-cream/80 text-sm mt-0.5">
              {recipe.cuisine} Cuisine
            </p>
          </div>
          <div className="flex items-center gap-1 bg-cream/20 rounded-full px-3 py-1">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">{recipe.matchScore}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {recipe.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 border-2">
            <Clock className="h-3.5 w-3.5" />
            {recipe.timeMinutes} min
          </Badge>
          <Badge
            variant="outline"
            className={cn('gap-1 border-2', difficultyColors[recipe.difficulty])}
          >
            <ChefHat className="h-3.5 w-3.5" />
            {difficultyLabels[recipe.difficulty]}
          </Badge>
        </div>

        {/* Missing ingredients warning */}
        {hasMissingIngredients && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/10 border border-gold/30">
            <AlertCircle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-charcoal">
                Missing {recipe.missingIngredients.length} ingredient{recipe.missingIngredients.length > 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {recipe.missingIngredients.slice(0, 3).join(', ')}
                {recipe.missingIngredients.length > 3 && ` +${recipe.missingIngredients.length - 3} more`}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="bistro" className="flex-1" asChild>
            <Link to={`/recipe/${recipe.id}`}>View Recipe</Link>
          </Button>
          {onSave && (
            <Button
              variant="paper"
              size="icon"
              onClick={() => onSave(recipe)}
              className={cn(
                recipe.saved && 'bg-forest/10 border-forest/30 text-forest'
              )}
            >
              {recipe.saved ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        {onMoreLikeThis && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-primary"
            onClick={() => onMoreLikeThis(recipe)}
          >
            More like this →
          </Button>
        )}
      </div>
    </motion.div>
  );
}
