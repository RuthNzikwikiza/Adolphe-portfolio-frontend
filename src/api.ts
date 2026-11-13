const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api';
const TOKEN_KEY = 'portfolio_tokens';

export type Tokens = { access: string; refresh: string };
export type User = { id: number; username: string; email: string; name: string; is_owner: boolean };
export type Visit = { id: number; username: string; path: string; visited_at: string };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

function saveTokens(tokens: Tokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function send(path: string, options: RequestInit, auth: boolean): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const tokens = auth ? getTokens() : null;
  if (tokens) headers.set('Authorization', `Bearer ${tokens.access}`);
  try {
    return await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Could not reach the server. Check that the backend is running.', 0);
  }
}

async function refreshAccess(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens) return false;
  const response = await send(
    '/auth/refresh/',
    { method: 'POST', body: JSON.stringify({ refresh: tokens.refresh }) },
    false,
  );
  if (!response.ok) {
    clearTokens();
    return false;
  }
  const data = (await response.json()) as { access: string };
  saveTokens({ ...tokens, access: data.access });
  return true;
}

async function readError(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      if (typeof record.detail === 'string') return record.detail;
      const first = Object.values(record)[0];
      if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
    }
  } catch {
    return `Request failed (${response.status})`;
  }
  return `Request failed (${response.status})`;
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  let response = await send(path, options, auth);
  if (response.status === 401 && auth && (await refreshAccess())) {
    response = await send(path, options, auth);
  }
  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function login(username: string, password: string): Promise<void> {
  const tokens = await request<Tokens>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  saveTokens(tokens);
}

export async function register(username: string, email: string, password: string, name: string): Promise<void> {
  await request<unknown>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, name }),
  });
}

export function getMe(): Promise<User> {
  return request<User>('/auth/me/', {}, true);
}

export function recordVisit(path: string): Promise<Visit> {
  return request<Visit>('/visits/record/', { method: 'POST', body: JSON.stringify({ path }) }, true);
}

export function listVisits(): Promise<Visit[]> {
  return request<Visit[]>('/visits/list/', {}, true);
}

export type HomeContent = {
  hero_image: string | null;
  eyebrow: string;
  name: string;
  tag: string;
  intro_heading: string;
  intro_text: string;
  featured_title: string;
  featured_year: string;
  featured_description: string;
  featured_image: string | null;
  featured_image_alt: string;
};

export function getHome(): Promise<HomeContent> {
  return request<HomeContent>('/content/home/');
}


export type AboutFact = { id: number; label: string; value: string };

export type AboutEducation = {
  id: number;
  title: string;
  institution: string;
  description: string;
};

export type AboutContent = {
  portrait: string | null;
  portrait_alt: string;
  heading: string;
  bio: string;
  approach: string;
  education_intro: string;
  facts: AboutFact[];
  education: AboutEducation[];
};

export function getAbout(): Promise<AboutContent> {
  return request<AboutContent>('/content/about/');
}

export type Project = {
  id: number;
  title: string;
  year: string;
  description: string;
  image: string | null;
  image_alt: string;
  link: string;
};

export function getProjects(): Promise<Project[]> {
  return request<Project[]>('/content/projects/');
}

export type Accolade = {
  id: number;
  year: number;
  title: string;
  issuer: string;
  description: string;
  image: string | null;
  image_alt: string;
};

export function getAccolades(): Promise<Accolade[]> {
  return request<Accolade[]>('/content/accolades/');
}

export type PressItem = {
  id: number;
  outlet: string;
  headline: string;
  date: string;
  url: string;
  summary: string;
  image: string | null;
  image_alt: string;
};

export function getPress(): Promise<PressItem[]> {
  return request<PressItem[]>('/content/press/');
}

export type GalleryPhoto = {
  id: number;
  image: string;
  alt: string;
  caption: string;
};

export function getGallery(): Promise<GalleryPhoto[]> {
  return request<GalleryPhoto[]>('/content/gallery/');
}

export type SocialLink = { id: number; label: string; url: string };

export type ContactInfo = {
  heading: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export function getContactInfo(): Promise<ContactInfo> {
  return request<ContactInfo>('/content/contact/');
}

export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await request<unknown>('/content/contact/messages/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}






export function manageList<T>(resource: string): Promise<T[]> {
  return request<T[]>(`/manage/${resource}/`, {}, true);
}

export function manageSave<T>(resource: string, id: number | null, body: FormData): Promise<T> {
  const path = id === null ? `/manage/${resource}/` : `/manage/${resource}/${id}/`;
  return request<T>(path, { method: id === null ? 'POST' : 'PATCH', body }, true);
}

export function manageDelete(resource: string, id: number): Promise<void> {
  return request<void>(`/manage/${resource}/${id}/`, { method: 'DELETE' }, true);
}

export function manageGet<T>(resource: string): Promise<T> {
  return request<T>(`/manage/${resource}/`, {}, true);
}

export function manageUpdate<T>(resource: string, body: FormData): Promise<T> {
  return request<T>(`/manage/${resource}/`, { method: 'PATCH', body }, true);
}

export async function manageReorder(resource: string, ids: number[]): Promise<void> {
  await request<unknown>(`/manage/${resource}/reorder/`, { method: 'POST', body: JSON.stringify({ ids }) }, true);
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await request<unknown>('/auth/password/change/', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  }, true);
}

export async function forgotPassword(email: string): Promise<void> {
  await request<unknown>('/auth/password/forgot/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(uid: string, token: string, newPassword: string): Promise<void> {
  await request<unknown>('/auth/password/reset/', {
    method: 'POST',
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  });
}
