-- Fix the analytics insert policy to be more specific
DROP POLICY IF EXISTS "Users can insert analytics" ON public.analytics_events;

-- Allow authenticated users to insert their own events, and allow anonymous page views
CREATE POLICY "Authenticated users can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
    OR user_id IS NULL
  );