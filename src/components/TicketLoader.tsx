import { motion } from 'framer-motion';

interface TicketLoaderProps {
  message?: string;
}

export function TicketLoader({ message = 'Preparing your menu...' }: TicketLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-48 h-64 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-4 bg-charcoal rounded-t-lg shadow-medium z-10" />
        
        <motion.div
          className="absolute top-4 left-2 right-2"
          initial={{ y: -200 }}
          animate={{ y: [-200, 0, 0, 200] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
          }}
        >
          <div className="bg-cream border-2 border-dashed border-border rounded-b-lg shadow-elevated p-4">
            <div className="text-center space-y-2">
              <div className="font-display text-lg font-bold text-burgundy">
                Fridge Menu
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-1 text-xs text-charcoal font-mono">
                <div>ORDER #001</div>
                <div>- - - - - - - - -</div>
                <div>CHEF'S SPECIALS</div>
                <div>LOADING...</div>
              </div>
              <div className="flex justify-center gap-1 pt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-burgundy"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <p className="mt-6 text-muted-foreground font-medium animate-pulse">{message}</p>
    </div>
  );
}
