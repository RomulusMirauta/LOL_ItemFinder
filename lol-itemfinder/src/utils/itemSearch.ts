import type { FilterState } from '../types/types';
import type { Item } from '../types/item';
import { tenacityPhrases } from './itemConstants';
import { filterByAttackDamage } from './itemFilters';

// Apply only sidebar filters (no search)
export function filterBySidebar(
  items: Record<string, Item>,
  filterState: FilterState // Now required since we initialize with defaults
): Item[] {
  let filtered = Object.values(items);

  // Exclude filter for 'Attack Damage'
  if (filterState.excludeStat.map(s => s.toLowerCase()).includes('attack damage')) {
    filtered = filtered.filter(filterByAttackDamage);
  }
  // Updated purchasable filter to use include/exclude arrays
  if (filterState.purchasableInclude.includes('yes')) {
    filtered = filtered.filter((item: Item) => {
      // Handle case where gold might be undefined
      if (!item.gold) return false;
      return item.gold.purchasable !== false;
    });
  } else if (filterState.purchasableExclude.includes('yes')) {
    filtered = filtered.filter((item: Item) => {
      // Handle case where gold might be undefined
      if (!item.gold) return true; // Treat items without gold as non-purchasable
      return item.gold.purchasable === false;
    });
  }
  const mapIncludeArr = filterState.mapInclude;
  const mapExcludeArr = filterState.mapExclude;
  if (mapIncludeArr.length > 0 || mapExcludeArr.length > 0) {
    filtered = filtered.filter(item => {
      if (item.maps) {
        // Include if available on any included map
        const isIncluded = mapIncludeArr.some(mapId => item.maps?.[mapId]);
        // Exclude only if item is exclusive to an excluded map (not available on any included map)
        const isExclusiveToExcluded = mapExcludeArr.some(mapId => {
          return item.maps?.[mapId] &&
            !mapIncludeArr.some(includeId => item.maps?.[includeId]);
        });
        return isIncluded && !isExclusiveToExcluded;
      }
      return true;
    });
  }
  const typeArr = filterState.type;
  if (typeArr.length > 0) {
    filtered = filtered.filter(item => {
      if (typeArr.includes('Champion-Specific')) {
        return !!item.requiredChampion;
      }
      if (typeArr.includes('Starter')) {
        if (item.requiredChampion) return false;
        const desc = (item.description || '').toLowerCase();
        const plain = (item.plaintext || '').toLowerCase();
        return (
          item.tags?.includes('Starter') ||
          item.type?.includes('Starter') ||
          desc.includes('starting') ||
          plain.includes('starting')
        );
      }
      if (typeArr.includes('Legendary')) {
        const desc = (item.description || '').toLowerCase();
        return (
          item.rarityLegendary === true ||
          item.tags?.includes('rarityLegendary') ||
          item.type?.includes('rarityLegendary') ||
          desc.includes('raritylegendary') ||
          desc.includes('<raritylegendary>')
        );
      }
      if (typeArr.includes('Mythic')) {
        const desc = (item.description || '').toLowerCase();
        return (
          item.rarityMythic === true ||
          desc.includes('raritymythic') ||
          desc.includes('<raritymythic>')
        );
      }
      if (typeArr.includes('Generic')) {
        const desc = (item.description || '').toLowerCase();
        return (
          item.rarityGeneric === true ||
          desc.includes('raritygeneric') ||
          desc.includes('<raritygeneric>')
        );
      }
      return typeArr.some(type => item.tags?.includes(type) || item.type?.includes(type));
    });
  }
  const statArr = filterState.stat;
  const tenacityChecked = statArr.map(s => s.toLowerCase()).includes('tenacity');
  if (statArr.length > 0) {
    filtered = filtered.filter(item => {
      if (tenacityChecked) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        return tenacityPhrases.some(phrase =>
          textFields.some(field => field.includes(phrase))
        );
      }
      return statArr.some(stat => {
        const statLower = stat.toLowerCase();
        return (
          item.plaintext?.toLowerCase().includes(statLower) ||
          item.description?.toLowerCase().includes(statLower) ||
          item.tags?.map((t: string) => t.toLowerCase()).includes(statLower)
        );
      });
    });
  }
  const classArr = filterState.class;
  if (classArr.length > 0) {
    filtered = filtered.filter(item =>
      classArr.some(cls => item.tags?.includes(cls) || item.type?.includes(cls))
    );
  }
  const excludeTypeArr = filterState.excludeType;
  if (excludeTypeArr.length > 0) {
    filtered = filtered.filter(item => {
      if (excludeTypeArr.includes('Champion-Specific')) {
        if (!!item.requiredChampion) return false;
      }
      if (excludeTypeArr.includes('Starter')) {
        const desc = (item.description || '').toLowerCase();
        const plain = (item.plaintext || '').toLowerCase();
        if (
          item.tags?.includes('Starter') ||
          item.type?.includes('Starter') ||
          desc.includes('starting') ||
          plain.includes('starting')
        ) return false;
      }
      return !excludeTypeArr.some(type => item.tags?.includes(type) || item.type?.includes(type));
    });
  }
  const excludeStatArr = filterState.excludeStat;
  const allExcludeStats = [...excludeStatArr];
  // If caller included 'attack damage' (case-insensitive) ensure 'Attack Damage' variant exists in list
  if (filterState.excludeStat.some(s => s.toLowerCase() === 'attack damage') && !allExcludeStats.includes('Attack Damage')) {
    allExcludeStats.push('Attack Damage');
  }
  if (allExcludeStats.length > 0) {
    filtered = filtered.filter(item => {
      return !allExcludeStats.some(stat => {
        const statLower = stat.toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const plain = (item.plaintext || '').toLowerCase();
        const tags = (item.tags || []).map((t: string) => t.toLowerCase());
        return (
          desc.includes(statLower) ||
          plain.includes(statLower) ||
          tags.includes(statLower)
        );
      });
    });
  }
  const excludeClassArr = filterState.excludeClass;
  if (excludeClassArr.length > 0) {
    filtered = filtered.filter(item =>
      !excludeClassArr.some(cls => item.tags?.includes(cls) || item.type?.includes(cls))
    );
  }
  // Game Mode filter logic
  const gameModeIncludeArr = filterState.gameModeInclude;
  const gameModeExcludeArr = filterState.gameModeExclude;
  if (gameModeIncludeArr.length > 0 || gameModeExcludeArr.length > 0) {
    filtered = filtered.filter(item => {
      // Use type assertion to allow gameModes property
      const modes: string[] = (item as Item & { gameModes?: string[] }).gameModes ?? [];
      // Include if available in any included mode
      const isIncluded = gameModeIncludeArr.length === 0 || gameModeIncludeArr.some(mode => modes.includes(mode));
      // Exclude if available ONLY in excluded modes and not in any included mode
      const isExclusiveToExcluded = gameModeExcludeArr.some(mode =>
        modes.includes(mode) && !gameModeIncludeArr.some(includeMode => modes.includes(includeMode))
      );
      return isIncluded && !isExclusiveToExcluded;
    });
  }
  return filtered;
}

function filterDuplicates(items: Item[]): Item[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

export function filterItems(
  items: Record<string, Item>,
  search: string,
  filterState: FilterState
): Item[] {
  // Apply sidebar filters first
  let filteredResult = filterBySidebar(items, filterState);
  // Then apply search
  if (search) {
    const lowerSearch = search.toLowerCase();
    const tenacitySearch = tenacityPhrases.some(phrase => lowerSearch === phrase);
    filteredResult = filteredResult.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      if (tenacitySearch || filterState.stat.map(s => s.toLowerCase()).includes('tenacity')) {
        // Only match items that strictly contain a tenacity phrase
        return tenacityPhrases.some(phrase =>
          textFields.some(field => field.includes(phrase))
        );
      }
      // For other searches, fallback to substring match
      return textFields.some(field => field.includes(lowerSearch));
    });
  }
  // Filter out duplicates by name
  filteredResult = filterDuplicates(filteredResult);
  return filteredResult;
}
