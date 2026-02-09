import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UtensilsCrossed, BookOpen, History, LogOut, LogIn, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy text-cream shadow-soft group-hover:shadow-medium transition-shadow">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-burgundy">
            Fridge Menu
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link
                to="/fridge"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                What's in my fridge?
              </Link>
              <Link
                to="/saved"
                className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4" />
                Saved Recipes
              </Link>
              <Link
                to="/history"
                className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1.5"
              >
                <History className="h-4 w-4" />
                History
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 animate-pulse bg-muted rounded-lg" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="paper" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/fridge">What's in my fridge?</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/saved">Saved Recipes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="bistro" size="sm" asChild>
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
