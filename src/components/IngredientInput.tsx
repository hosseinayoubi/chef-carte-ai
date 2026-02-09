import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  placeholder?: string;
}

export function IngredientInput({ 
  ingredients, 
  onChange, 
  placeholder = "Type an ingredient and press Enter..."
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredient: string) => {
    onChange(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients[ingredients.length - 1]);
    } else if (e.key === ',') {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const items = pasted.split(/[,\n]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    const unique = items.filter((item) => !ingredients.includes(item));
    if (unique.length > 0) {
      onChange([...ingredients, ...unique]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="flex-1 bg-ivory border-2 border-border focus:border-primary/50 h-12 text-base"
        />
        <Button
          type="button"
          variant="menu"
          size="icon"
          className="h-12 w-12"
          onClick={() => addIngredient(inputValue)}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {ingredients.map((ingredient) => (
              <motion.span
                key={ingredient}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="ingredient-chip group"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-1 p-0.5 rounded-full hover:bg-primary/10 transition-colors"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Press Enter or comma to add. Paste a comma-separated list to add multiple at once.
      </p>
    </div>
  );
}
