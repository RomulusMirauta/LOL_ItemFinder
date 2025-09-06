import type { Item } from '../types/item';
// src/utils/itemFilters.ts
import { TENACITY_KEYWORDS } from './itemConstants';
import { normalizeText, tagsToLower } from './itemUtils';

export function filterByAttackDamage(item: Item): boolean {
  const desc = normalizeText(item.description);
//   const plain = normalizeText(item.plaintext);
  const plain = normalizeText(item.plaintext || '');
  const tags = tagsToLower(item.tags);
  return (
    !desc.includes('attack damage') &&
    !plain.includes('attack damage') &&
    !tags.includes('attack damage')
  );
}

export function filterByAttackSpeed(item: Item): boolean {
  const desc = normalizeText(item.description);
  const plain = normalizeText(item.plaintext || '');
  const tags = tagsToLower(item.tags);
  return (
    desc.includes('attack speed') ||
    plain.includes('attack speed') ||
    tags.includes('attack speed')
  );
}

export function filterByTenacity(item: Item): boolean {
  const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(normalizeText);
  return TENACITY_KEYWORDS.some(phrase =>
    textFields.some(field => field.includes(phrase))
  );
}

export function filterByOnHitEffects(item: Item): boolean {
  const desc = normalizeText(item.description);
  const plain = normalizeText(item.plaintext || '');
  const tags = tagsToLower(item.tags);

  // Regex matches "on hit", "on-hit", "onhit" (case-insensitive, with or without hyphen/space)
  const onHitRegex = /\bon[\s-]?hit\b/;
  // Also match "basic attacks" which is commonly used for on-hit effects
  const basicAttackRegex = /\bbasic attack(s)?\b/;

  return (
    onHitRegex.test(desc) ||
    onHitRegex.test(plain) ||
    tags.some(tag => onHitRegex.test(tag)) ||
    basicAttackRegex.test(desc) ||
    basicAttackRegex.test(plain) ||
    tags.some(tag => basicAttackRegex.test(tag))
  );
}

export function filterByArmorPenetration(item: Item): boolean {
  const desc = normalizeText(item.description);
  const plain = normalizeText(item.plaintext || '');
  const tags = tagsToLower(item.tags);
  return (
    desc.includes('armor penetration') ||
    plain.includes('armor penetration') ||
    tags.includes('armor penetration') ||
    desc.includes('lethality') ||
    plain.includes('lethality') ||
    tags.includes('lethality')
  );
}
