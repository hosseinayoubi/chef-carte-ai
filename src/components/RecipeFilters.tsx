import { Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface RecipeFiltersState {
  maxTime?: number;
  difficulty?: string[];
  cuisine?: string[];
  onlyComplete: boolean;
  sortBy: 'match' | 'time' | 'missing';
}

interface RecipeFiltersProps {
  filters: RecipeFiltersState;
  onChange: (filters: RecipeFiltersState) => void;
  availableCuisines: string[];
}

export function RecipeFilters({ filters, onChange, availableCuisines }: RecipeFiltersProps) {
  const activeFilterCount = [
    filters.maxTime && filters.maxTime < 180,
    filters.difficulty?.length,
    filters.cuisine?.length,
    filters.onlyComplete,
  ].filter(Boolean).length;

  const toggleDifficulty = (value: string) => {
    const current = filters.difficulty || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    onChange({ ...filters, difficulty: updated });
  };

  const toggleCuisine = (value: string) => {
    const current = filters.cuisine || [];
    const updated = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    onChange({ ...filters, cuisine: updated });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="paper" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="bg-burgundy text-cream h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Max Cooking Time: {filters.maxTime || 180} min</Label>
              <Slider
                value={[filters.maxTime || 180]}
                onValueChange={([value]) => onChange({ ...filters, maxTime: value })}
                min={15}
                max={180}
                step={15}
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <div className="flex flex-wrap gap-2">
                {['easy', 'medium', 'hard'].map((diff) => (
                  <label
                    key={diff}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={filters.difficulty?.includes(diff) || false}
                      onCheckedChange={() => toggleDifficulty(diff)}
                    />
                    <span className="text-sm capitalize">{diff}</span>
                  </label>
                ))}
              </div>
            </div>

            {availableCuisines.length > 0 && (
              <div className="space-y-2">
                <Label>Cuisine</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableCuisines.map((cuisine) => (
                    <label
                      key={cuisine}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={filters.cuisine?.includes(cuisine) || false}
                        onCheckedChange={() => toggleCuisine(cuisine)}
                      />
                      <span className="text-sm">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 p-2 rounded-lg border border-forest/30 bg-forest/5 cursor-pointer">
              <Checkbox
                checked={filters.onlyComplete}
                onCheckedChange={(checked) =>
                  onChange({ ...filters, onlyComplete: !!checked })
                }
              />
              <span className="text-sm font-medium">Only show recipes with all ingredients</span>
            </label>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() =>
                onChange({
                  maxTime: undefined,
                  difficulty: [],
                  cuisine: [],
                  onlyComplete: false,
                  sortBy: 'match',
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onChange({ ...filters, sortBy: value as RecipeFiltersState['sortBy'] })
          }
        >
          <SelectTrigger className="w-[180px] bg-ivory">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="time">Fastest First</SelectItem>
            <SelectItem value="missing">Fewest Missing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
