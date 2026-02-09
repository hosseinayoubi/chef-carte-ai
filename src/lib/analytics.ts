import { supabase } from '@/integrations/supabase/client';

export type AnalyticsEventName = 
  | 'page_view'
  | 'generate_clicked'
  | 'recipe_viewed'
  | 'recipe_saved'
  | 'recipe_unsaved'
  | 'regenerate_clicked'
  | 'more_like_this_clicked'
  | 'shopping_list_generated'
  | 'login'
  | 'signup'
  | 'logout';

export async function trackEvent(
  eventName: AnalyticsEventName,
  meta: Record<string, unknown> = {}
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('analytics_events').insert({
      user_id: user?.id || null,
      event_name: eventName,
      meta,
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export function trackPageView(pageName: string): void {
  trackEvent('page_view', { page: pageName });
}
