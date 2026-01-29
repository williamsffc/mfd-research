import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Google-style anonymous animals
const ANIMALS = [
  'Alligator', 'Anteater', 'Armadillo', 'Axolotl', 'Badger', 'Bat', 'Bear', 'Beaver',
  'Buffalo', 'Camel', 'Capybara', 'Chameleon', 'Cheetah', 'Chinchilla', 'Chipmunk',
  'Cobra', 'Corgi', 'Coyote', 'Crab', 'Crow', 'Deer', 'Dingo', 'Dolphin', 'Dove',
  'Dragon', 'Duck', 'Eagle', 'Elephant', 'Falcon', 'Ferret', 'Flamingo', 'Fox',
  'Frog', 'Giraffe', 'Goose', 'Gorilla', 'Hamster', 'Hawk', 'Hedgehog', 'Hippo',
  'Hummingbird', 'Hyena', 'Iguana', 'Jaguar', 'Jellyfish', 'Kangaroo', 'Koala',
  'Lemur', 'Leopard', 'Lion', 'Llama', 'Lobster', 'Lynx', 'Manatee', 'Meerkat',
  'Moose', 'Narwhal', 'Octopus', 'Orca', 'Ostrich', 'Otter', 'Owl', 'Panda',
  'Panther', 'Parrot', 'Peacock', 'Pelican', 'Penguin', 'Porcupine', 'Quail',
  'Rabbit', 'Raccoon', 'Raven', 'Reindeer', 'Rhino', 'Salamander', 'Seal',
  'Shark', 'Sloth', 'Snail', 'Snake', 'Squid', 'Squirrel', 'Starfish', 'Swan',
  'Tiger', 'Toucan', 'Turtle', 'Walrus', 'Wolf', 'Wolverine', 'Wombat', 'Zebra'
];

const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
  '#D946EF', '#EC4899', '#F43F5E'
];

function generateAnonymousName(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `Anonymous ${animal}`;
}

function generateColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Generate a stable user ID for this session
function getOrCreateUserId(): string {
  const key = 'slideforge_user_id';
  let userId = sessionStorage.getItem(key);
  if (!userId) {
    userId = crypto.randomUUID();
    sessionStorage.setItem(key, userId);
  }
  return userId;
}

// Generate stable user info for this session
function getOrCreateUserInfo(): { name: string; color: string } {
  const key = 'slideforge_user_info';
  const stored = sessionStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  const info = {
    name: generateAnonymousName(),
    color: generateColor(),
  };
  sessionStorage.setItem(key, JSON.stringify(info));
  return info;
}

export interface Viewer {
  id: string;
  name: string;
  color: string;
  slideIndex: number;
  lastSeen: number;
}

interface PresenceState {
  id: string;
  name: string;
  color: string;
  slideIndex: number;
  lastSeen: number;
}

export function useSlidePresence(presentationId: string = 'demo') {
  const [viewers, setViewers] = useState<Map<string, Viewer>>(new Map());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const userIdRef = useRef(getOrCreateUserId());
  const userInfoRef = useRef(getOrCreateUserInfo());

  // Update current slide
  const updateSlide = useCallback((slideIndex: number) => {
    setCurrentSlideIndex(slideIndex);
    
    if (channelRef.current) {
      channelRef.current.track({
        id: userIdRef.current,
        name: userInfoRef.current.name,
        color: userInfoRef.current.color,
        slideIndex,
        lastSeen: Date.now(),
      });
    }
  }, []);

  useEffect(() => {
    const channel = supabase.channel(`presence:${presentationId}`, {
      config: {
        presence: {
          key: userIdRef.current,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const newViewers = new Map<string, Viewer>();
        
        Object.entries(state).forEach(([key, presences]) => {
          if (presences && presences.length > 0) {
            const presence = presences[0];
            // Don't include self in viewers list
            if (presence.id !== userIdRef.current) {
              newViewers.set(key, {
                id: presence.id,
                name: presence.name,
                color: presence.color,
                slideIndex: presence.slideIndex,
                lastSeen: presence.lastSeen,
              });
            }
          }
        });
        
        setViewers(newViewers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (newPresences && newPresences.length > 0) {
          const presence = newPresences[0] as unknown as PresenceState;
          if (presence.id !== userIdRef.current) {
            setViewers(prev => {
              const updated = new Map(prev);
              updated.set(key, {
                id: presence.id,
                name: presence.name,
                color: presence.color,
                slideIndex: presence.slideIndex,
                lastSeen: presence.lastSeen,
              });
              return updated;
            });
          }
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setViewers(prev => {
          const updated = new Map(prev);
          updated.delete(key);
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: userIdRef.current,
            name: userInfoRef.current.name,
            color: userInfoRef.current.color,
            slideIndex: currentSlideIndex,
            lastSeen: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [presentationId]);

  // Get viewers on a specific slide
  const getViewersOnSlide = useCallback((slideIndex: number): Viewer[] => {
    return Array.from(viewers.values()).filter(v => v.slideIndex === slideIndex);
  }, [viewers]);

  // Get all viewers
  const getAllViewers = useCallback((): Viewer[] => {
    return Array.from(viewers.values());
  }, [viewers]);

  return {
    viewers,
    updateSlide,
    getViewersOnSlide,
    getAllViewers,
    currentUser: {
      id: userIdRef.current,
      ...userInfoRef.current,
    },
  };
}
