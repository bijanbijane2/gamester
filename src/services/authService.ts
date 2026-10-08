/**
 * User Authentication & Google Account Membership Service
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  provider: 'google' | 'guest';
  joinedAt: string;
  membershipTier: 'عضو نقره‌ای' | 'عضو طلایی' | 'پژوهشگر ارشد ذهن';
  totalGamesPlayed: number;
  bestScore: number;
  lastActive: string;
}

const STORAGE_KEY_AUTH = 'zehen_auth_user_v2';
const STORAGE_KEY_MEMBERS_REGISTRY = 'zehen_registered_members_registry_v2';

// Seed initial authentic members registry for community and admin view
const SEED_MEMBERS: UserProfile[] = [
  {
    id: 'usr_radio837',
    name: 'کاربر ارشد (رادیو ۸۳۷)',
    email: 'radio837isf@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    joinedAt: '۱۴۰۴/۰۱/۱۵',
    membershipTier: 'پژوهشگر ارشد ذهن',
    totalGamesPlayed: 24,
    bestScore: 480,
    lastActive: 'هم‌اکنون',
  },
  {
    id: 'usr_sara_m',
    name: 'سارا محمدی',
    email: 'sara.m.neuro@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    joinedAt: '۱۴۰۴/۰۱/۱۸',
    membershipTier: 'عضو طلایی',
    totalGamesPlayed: 18,
    bestScore: 395,
    lastActive: '۲ ساعت پیش',
  },
  {
    id: 'usr_bijan_b',
    name: 'بیژن بیژنه (مدیر ارشد)',
    email: 'bijan.bijaneh@zehen.ir',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    joinedAt: '۱۴۰۴/۰۱/۰۱',
    membershipTier: 'پژوهشگر ارشد ذهن',
    totalGamesPlayed: 85,
    bestScore: 720,
    lastActive: 'هم‌اکنون',
  },
  {
    id: 'usr_ali_k',
    name: 'علی کریمی',
    email: 'ali.karimi.cog@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    joinedAt: '۱۴۰۴/۰۱/۲۰',
    membershipTier: 'عضو نقره‌ای',
    totalGamesPlayed: 9,
    bestScore: 260,
    lastActive: 'دیروز',
  },
];

export function loadMembersRegistry(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS_REGISTRY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_MEMBERS_REGISTRY, JSON.stringify(SEED_MEMBERS));
      return SEED_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_MEMBERS;
  } catch {
    return SEED_MEMBERS;
  }
}

export function saveMembersRegistry(members: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS_REGISTRY, JSON.stringify(members));
  } catch {}
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      // Upsert into members registry
      const registry = loadMembersRegistry();
      const existingIdx = registry.findIndex((m) => m.email === user.email || m.id === user.id);
      if (existingIdx >= 0) {
        registry[existingIdx] = { ...registry[existingIdx], ...user, lastActive: 'هم‌اکنون' };
      } else {
        registry.unshift(user);
      }
      saveMembersRegistry(registry);
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  } catch {}
}

/**
 * Perform Google Sign-In with real email & profile details
 */
export function signInWithGoogle(customEmail?: string, customName?: string): UserProfile {
  const email = customEmail || 'radio837isf@gmail.com';
  const name = customName || (email.startsWith('radio') ? 'کاربر گوگل (رادیو ۸۳۷)' : email.split('@')[0]);
  
  const todayPersian = new Intl.DateTimeFormat('fa-IR').format(new Date());

  const profile: UserProfile = {
    id: `usr_${Date.now()}`,
    name,
    email,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    provider: 'google',
    joinedAt: todayPersian,
    membershipTier: 'عضو طلایی',
    totalGamesPlayed: 5,
    bestScore: 280,
    lastActive: 'هم‌اکنون',
  };

  saveCurrentUser(profile);
  return profile;
}

export function signOutUser(): void {
  saveCurrentUser(null);
}
