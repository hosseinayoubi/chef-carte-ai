import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { UtensilsCrossed, Sparkles, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function Index() {
  useEffect(() => {
    trackPageView('landing');
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/10 text-burgundy mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Recipe Recommendations</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal mb-6 leading-tight">
              What's in Your <span className="text-burgundy">Fridge</span> Today?
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Transform your ingredients into delicious meals. Simply tell us what you have, 
              and our AI chef will craft personalized recipes just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="bistro" size="xl" asChild>
                <Link to="/fridge" className="gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Start Cooking
                </Link>
              </Button>
              <Button variant="paper" size="xl" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-burgundy/10 rounded-full blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Smart Matching", desc: "AI finds the best recipes for your ingredients" },
              { icon: Clock, title: "Save Time", desc: "No more wondering what to cook" },
              { icon: BookOpen, title: "Build Your Library", desc: "Save favorites for later" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="paper-card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy/10 text-burgundy mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
