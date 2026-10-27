import * as React from 'react';

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Resolves the avatar image URL for any user or person in the application.
 * Priority: person.avatarUrl -> localStorage (triago_user_avatar_{email}) -> pravatar.
 */
export function getUserAvatarUrl(
  person?: { email?: string | null; avatarUrl?: string | null } | null,
): string {
  if (!person) return '';
  if (person.avatarUrl) return resolveMediaUrl(person.avatarUrl);
  if (person.email && typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(`triago_user_avatar_${person.email}`);
      if (local) return resolveMediaUrl(local);
    } catch {}
  }
  return person.email ? `https://i.pravatar.cc/150?u=${encodeURIComponent(person.email)}` : '';
}

/**
 * React hook that reactively returns the user's avatar and subscribes to avatar update events.
 */
export function useUserAvatar(
  person?: { email?: string | null; avatarUrl?: string | null } | null,
): string {
  const email = person?.email;
  const avatarUrl = person?.avatarUrl;

  const [avatar, setAvatar] = React.useState<string>(() => getUserAvatarUrl({ email, avatarUrl }));

  React.useEffect(() => {
    setAvatar(getUserAvatarUrl({ email, avatarUrl }));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ email?: string; avatarUrl?: string }>;
      if (
        !email ||
        !customEvent.detail.email ||
        customEvent.detail.email.toLowerCase() === email.toLowerCase()
      ) {
        setAvatar(getUserAvatarUrl({ email, avatarUrl: customEvent.detail.avatarUrl ?? avatarUrl }));
      }
    };

    window.addEventListener('triago:avatar-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('triago:avatar-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [email, avatarUrl]);

  return avatar;
}

/**
 * Dispatch an avatar change event to notify all components to re-render their avatar immediately.
 */
export function notifyAvatarChanged(email: string, avatarUrl: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (avatarUrl) {
      localStorage.setItem(`triago_user_avatar_${email}`, avatarUrl);
    } else {
      localStorage.removeItem(`triago_user_avatar_${email}`);
    }
    window.dispatchEvent(
      new CustomEvent('triago:avatar-changed', {
        detail: { email, avatarUrl },
      }),
    );
  } catch {}
}
