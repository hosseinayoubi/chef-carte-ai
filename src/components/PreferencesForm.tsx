import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { IngredientInput } from './IngredientInput';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FridgePreferences } from '@/lib/types';
import {
  DIETARY_OPTIONS,
  CUISINE_OPTIONS,
  SKILL_LEVELS,
  DEFAULT_PANTRY_STAPLES,
} from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface PreferencesFormProps {
  preferences: FridgePreferences;
  onChange: (preferences: FridgePreferences) => void;
}

export function PreferencesForm({ preferences, onChange }: PreferencesFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updatePreference = <K extends keyof FridgePreferences>(
    key: K,
    value: FridgePreferences[K]
  ) => {
    onChange({ ...preferences, [key]: value });
  };

  const toggleDietary = (value: string) => {
    const current = preferences.dietary || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    updatePreference('dietary', updated);
  };

  const toggleCuisine = (value: string) => {
    const current = preferences.cuisine || [];
    const updated = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    updatePreference('cuisine', updated);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="paper" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Preferences & Dietary Requirements
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>

      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent forceMount>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-6 paper-card p-6">
                {/* Dietary Restrictions */}
                <div className="space-y-3">
                  <Label className="text-base font-display">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DIETARY_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={preferences.dietary?.includes(option.value) || false}
                          onCheckedChange={() => toggleDietary(option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cuisine Preferences */}
                <div className="space-y-3">
                  <Label className="text-base font-display">Preferred Cuisines</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {CUISINE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={preferences.cuisine?.includes(option.value) || false}
                          onCheckedChange={() => toggleCuisine(option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Skill Level */}
                  <div className="space-y-3">
                    <Label className="text-base font-display">Cooking Skill Level</Label>
                    <Select
                      value={preferences.skillLevel || ''}
                      onValueChange={(value) =>
                        updatePreference('skillLevel', value as FridgePreferences['skillLevel'])
                      }
                    >
                      <SelectTrigger className="bg-ivory">
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Servings */}
                  <div className="space-y-3">
                    <Label className="text-base font-display">
                      Servings: {preferences.servings || 2}
                    </Label>
                    <Slider
                      value={[preferences.servings || 2]}
                      onValueChange={([value]) => updatePreference('servings', value)}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Available Time */}
                <div className="space-y-3">
                  <Label className="text-base font-display">
                    Available Cooking Time: {preferences.availableTime || 60} minutes
                  </Label>
                  <Slider
                    value={[preferences.availableTime || 60]}
                    onValueChange={([value]) => updatePreference('availableTime', value)}
                    min={15}
                    max={180}
                    step={15}
                  />
                </div>

                {/* Pantry Staples */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-display">I have pantry staples</Label>
                    <Switch
                      checked={preferences.includePantryStaples || false}
                      onCheckedChange={(checked) => {
                        updatePreference('includePantryStaples', checked);
                        if (checked && !preferences.pantryStaples?.length) {
                          updatePreference('pantryStaples', DEFAULT_PANTRY_STAPLES);
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Common items like salt, pepper, oil, flour, etc.
                  </p>

                  {preferences.includePantryStaples && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <IngredientInput
                        ingredients={preferences.pantryStaples || DEFAULT_PANTRY_STAPLES}
                        onChange={(items) => updatePreference('pantryStaples', items)}
                        placeholder="Add or remove pantry staples..."
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
