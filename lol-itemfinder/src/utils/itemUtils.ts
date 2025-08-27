// src/utils/itemUtils.ts

export function normalizeText(text: string): string {
  return (text || '').toLowerCase();
}

export function tagsToLower(tags: string[] = []): string[] {
  return tags.map(t => t.toLowerCase());
}
