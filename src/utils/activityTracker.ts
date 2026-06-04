const STORAGE_KEY = "devpath_activity";
const MAX_HISTORY = 20;

const PAGE_CATEGORIES: Record<string, string> = {
  "/pathways/web-development": "web-development",
  "/pathways/data-science": "data-science",
  "/pathways/mobile": "mobile",
  "/pathways/devops": "devops",
  "/pathways/open-source": "open-source",
  "/pathways": "pathways",
  "/open-source": "open-source",
  "/internships": "internships",
  "/events": "events",
  "/resources": "resources",
  "/community": "community",
  "/projects": "projects",
};

export interface ActivityEntry {
  path: string;
  category: string;
  ts: number;
}

export function getCategoryForPath(path: string): string {
  for (const [pattern, category] of Object.entries(PAGE_CATEGORIES)) {
    if (path.startsWith(pattern)) return category;
  }
  return "general";
}

export function getActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function trackVisit(path: string): void {
  if (typeof window === "undefined") return;
  const activity = getActivity();
  if (activity[0]?.path === path) return;
  const entry: ActivityEntry = { path, category: getCategoryForPath(path), ts: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...activity].slice(0, MAX_HISTORY)));
}

export function getCategoryFrequency(): Record<string, number> {
  return getActivity().reduce((acc, { category }) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getRecentCategories(): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const { category } of getActivity()) {
    if (!seen.has(category)) { seen.add(category); ordered.push(category); }
  }
  return ordered.length ? ordered : ["general"];
}
