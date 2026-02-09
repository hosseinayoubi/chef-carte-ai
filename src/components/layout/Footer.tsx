import { UtensilsCrossed } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy text-cream">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold text-burgundy">
              Fridge Menu
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Transform your ingredients into delicious meals. AI-powered recipe suggestions
            tailored to what you have at home.
          </p>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fridge Menu. Crafted with care.
          </div>
        </div>
      </div>
    </footer>
  );
}
