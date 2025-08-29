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
  // Rarity filters
  const rarityArr = typeArr.filter(type => ['Unique', 'Basic', 'Epic', 'Legendary'].includes(type));
  if (rarityArr.length > 0) {
    filtered = filtered.filter(item => {
      return rarityArr.some(rarity => {
        if (rarity === 'Unique') {
          const tags = (item.tags || []).map(t => t.toLowerCase());
          const types = (item.type || []).map(t => t.toLowerCase());
          return tags.includes('unique') || types.includes('unique');
        }
        if (rarity === 'Basic') {
          const desc = (item.description || '').toLowerCase();
          return (
            item.rarityGeneric === true ||
            desc.includes('raritygeneric') ||
            desc.includes('<raritygeneric>') ||
            desc.includes('</raritygeneric>')
          );
        }
        if (rarity === 'Epic') {
          const tags = (item.tags || []).map(t => t.toLowerCase());
          const types = (item.type || []).map(t => t.toLowerCase());
          return tags.includes('epic') || types.includes('epic');
        }
        if (rarity === 'Legendary') {
          const desc = (item.description || '').toLowerCase();
          return (
            item.rarityLegendary === true ||
            item.tags?.includes('rarityLegendary') ||
            item.type?.includes('rarityLegendary') ||
            desc.includes('raritylegendary') ||
            desc.includes('<raritylegendary>') ||
            desc.includes('legendary') ||
            item.name.toLowerCase().includes('legendary')
          );
        }
        return false;
      });
    });
  }
  // Type filters
  const typeCategoryArr = typeArr.filter(type => ['Starter', 'Consumable', 'Ward', 'Boots'].includes(type));
  if (typeCategoryArr.length > 0) {
    filtered = filtered.filter(item => {
      return typeCategoryArr.some(type => {
        if (type === 'Starter') {
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
        if (type === 'Consumable') {
          const consumableSpecialItems = [
            'Total Biscuit of Everlasting Will'
          ];
          const isConsumable = item.tags?.includes('Consumable') || item.type?.includes('Consumable');
          return isConsumable || consumableSpecialItems.includes(item.name);
        }
        if (type === 'Ward') {
          const isWard = item.tags?.includes('Ward') || 
            item.type?.includes('Ward') || 
            item.name.toLowerCase().includes(' ward') ||
            item.name.toLowerCase().includes('trinket') ||
            item.name.toLowerCase().includes('lens') || 
            item.name.toLowerCase().includes('farsight') || 
            item.description.toLowerCase().includes('warding');
          return isWard;
        }
        if (type === 'Boots') {
          const tags = (item.tags || []).map(t => t.toLowerCase());
          const types = (item.type || []).map(t => t.toLowerCase());
          return tags.includes('boots') || types.includes('boots') || item.name.toLowerCase().includes('boots');
        }
        return false;
      });
    });
  }
  const statArr = filterState.stat;
  const tenacityChecked = statArr.map(s => s.toLowerCase()).includes('tenacity *');
  if (statArr.length > 0) {
    filtered = filtered.filter(item => {
      if (tenacityChecked) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        return tenacityPhrases.some(phrase =>
          textFields.some(field => field.includes(phrase))
        );
      }
      // Special rule: On-Hit Effects filter
      if (statArr.includes('On-Hit Effects')) {
        // const onHitSpecialItems = [
        //   'Cull',
        //   'Recurve Bow',
        //   'Sheen',
        //   'Tiamat'
        // ];
        // Use filterByOnHitEffects from itemFilters, or match special items
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isOnHit = textFields.some(field => field.includes('on hit') || field.includes('on-hit') || field.includes('onhit') || field.includes('spellblade'));
        return isOnHit;
        // return isOnHit || onHitSpecialItems.includes(item.name);
      }
      // Special rule: Lethality filter
      if (statArr.includes('Lethality') || statArr.includes('Lethality *')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isLethality = textFields.some(field => field.includes('lethality'));
        return isLethality;
      }
      // Special rule: Mana & Regeneration filter
      if (statArr.includes('Mana & Regeneration')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isMana = textFields.some(field => field.includes('mana'));
        // const isRegen = textFields.some(field => field.includes('regen') || field.includes('regeneration'));
        return isMana;
      }
      // Special rule: Health & Regeneration filter
      if (statArr.includes('Health & Regeneration')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isHealth = textFields.some(field => field.includes('health') || field.includes('hp'));
        // const isRegen = textFields.some(field => field.includes('regen') || field.includes('regeneration'));
        return isHealth;
      }
      // Special rule: Armor filter
      if (statArr.includes('Armor')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isArmor = textFields.some(field => field.includes('armor'));
        const hasArmorPen = textFields.some(field => field.includes('armor penetration') || field.includes('lethality') || field.includes('shred'));
        // Exclude items that have 'armor' in their name but do not provide armor stat
        const providesArmorStat = (
          item.plaintext?.toLowerCase().includes('armor') ||
          item.description?.toLowerCase().includes('armor') ||
          (item.tags || []).map(t => t.toLowerCase()).includes('armor')
        );
        // If item name contains 'armor' but does not provide armor stat, exclude it
        if (item.name.toLowerCase().includes('armor') && !providesArmorStat) return false;
        return isArmor && !hasArmorPen;
      }
      // Special rule: Magic Resistance filter
      if (statArr.includes('Magic Resistance')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isMR = textFields.some(field => field.includes('magic resistance') || field.includes('mr') || field.includes('magic resist'));
        const isNotMR = textFields.some(field => field.toLowerCase().includes('shred') || field.toLowerCase().includes('magic penetration') || field.toLowerCase().includes('reducing their'));
        // Exclude items that have 'magic resist' or 'magic resistance' in their name but do not provide the stat
        const providesMRStat = (
          item.plaintext?.toLowerCase().includes('magic resist') ||
          item.plaintext?.toLowerCase().includes('magic resistance') ||
          item.description?.toLowerCase().includes('magic resist') ||
          item.description?.toLowerCase().includes('magic resistance') ||
          (item.tags || []).map(t => t.toLowerCase()).includes('magic resist') ||
          (item.tags || []).map(t => t.toLowerCase()).includes('magic resistance')
        );
        if ((item.name.toLowerCase().includes('magic resist') || item.name.toLowerCase().includes('magic resistance')) && !providesMRStat) return false;
        return isMR && !isNotMR;
      }
      // Special rule: Movement Speed filter
      if (statArr.includes('Movement Speed')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isMS = textFields.some(field => field.includes('movement speed') || field.includes('ms') || field.includes('move speed'));
        return isMS;
      }
      // Special rule: Life Steal & Omnivamp filter
      if (statArr.includes('Life Steal & Omnivamp')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const isLifeSteal = textFields.some(field => field.includes('life steal') || field.includes('omnivamp') || field.includes('spell vamp') || field.includes('vamp') || field.includes('heal on attack'));
        return isLifeSteal;
      }
      // Special rule: Active * filter
      if (statArr.includes('Active *')) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        // Exclude potions, elixirs, and wards
        const excludedFromActiveItems = [
          'Health Potion',

          'Elixir of Iron',
          'Elixir of Sorcery',
          'Elixir of Wrath',
          'Elixir of Skill',
          'Elixir of Ruin',
          'Elixir of Force',
          'Elixir of Stealth',

          'Cappa Juice',
          'Refillable Potion',
          'Corrupting Potion',
          'Total Biscuit of Everlasting Will',

          'Stealth Ward',
          'Control Ward',
          'Oracle Lens',
          'Farsight Alteration',
          'Warding Totem',
          'Red Trinket',
          'Blue Trinket',
          'Yellow Trinket',

          'Voltaic Cyclosword',
          'Opportunity',
          'Hubris'
        ];
        if (excludedFromActiveItems.includes(item.name)) return false;
        // Look for activation keywords
        const isActive = textFields.some(field =>
          field.includes('active') ||
          // field.includes('activate') ||
          field.includes('activation')
          // field.includes('use to')
          // field.includes('use:')
          // field.includes('click to')
        );
        return isActive;
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
    filtered = filtered.filter(item => {
      // Role filter logic for Fighter, Marksman, Assassin, Mage, Tank, Support
      return classArr.some(cls => {
        const clsLower = cls.toLowerCase();
        // Check tags and type arrays for role match
        const tags = (item.tags || []).map(t => t.toLowerCase());
        const types = (item.type || []).map(t => t.toLowerCase());
        // Allow partial match for flexibility (e.g. 'fighter' matches 'Legendary Fighter Item')
        return tags.some(tag => tag.includes(clsLower)) || types.some(type => type.includes(clsLower));
      });
    });
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
      const modes: string[] = (item as Item & { gameModes?: string[] }).gameModes ?? [];
      // Special rule: Doom Bots filter
      if (gameModeIncludeArr.includes('DOOMBOTS')) {
        const doomBotsItems = [
          'Crown of the Shattered Queen',
          "Hextech Gunblade",
          'Cruelty',
          'Sword of Blossoming Dawn',
          'Sword of the Divine',
          "Atma's Reckoning",
          'Zephyr',
          'Flesheater',
          'Gargoyle Stoneplate',
          'Cloak of Starry Night',
          'Shield of Molten Stone'

          // "Demon King's Crown",
          // "Gambler's Blade",
        ];
        return modes.includes('DOOMBOTS') || item.prismatic === true || doomBotsItems.includes(item.name);
      }
      // Special rule: ARAM filter
      if (gameModeIncludeArr.includes('ARAM')) {
        // Only show items available in ARAM
        return modes.includes('ARAM');
      }
      // Special rule: URF filter
      if (gameModeIncludeArr.includes('URF')) {
        // Only show items available in URF
        return modes.includes('URF');
      }
      // Special rule: Arena filter
      if (gameModeIncludeArr.includes('ARENA')) {
        // Show items available in Arena, plus special Arena items
        const arenaSpecialItems = [
          // 'Prismatic Anvil',
          // 'Legendary Anvil',
          // 'Stat Anvil',
          // 'Augments',
          // 'Juices',

          'The Golden Spatula',

          'Prismatic Item',
          
          'Stat Bonus',
          'Anvil Voucher',
          'Gold Stat Anvil Voucher',
          'Prismatic Stat Voucher',
          'Bravery Voucher',

          'Cappa Juice',
          'Juice of Power',
          'Juice of Vitality',
          'Juice of Haste',

          'Bandle Juice of Power',
          'Bandle Juice of Vitality',
          'Bandle Juice of Haste',

          'Legendary Fighter Item',
          'Legendary Marksman Item',
          'Legendary Assassin Item',
          'Legendary Mage Item',
          'Legendary Tank Item',
          'Legendary Support Item'
        ];
        return modes.includes('ARENA') || arenaSpecialItems.includes(item.name);
      }
      // Special rule: Teamfight Tactics filter
      if (gameModeIncludeArr.includes('TEAMFIGHTTACTICS')) {
        // Only show items available in Teamfight Tactics
        return modes.includes('TEAMFIGHTTACTICS');
      }
      // Special rule: Classic filter
      if (gameModeIncludeArr.includes('CLASSIC')) {
        // Only show items available in Classic
        return modes.includes('CLASSIC');
      }
      // Default: Include if available in any included mode
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

// Helper: Mark prismatic items if available in Doom Bots
function markPrismatic(items: Record<string, Item>): Record<string, Item> {
  const result: Record<string, Item> = {};
  for (const [key, item] of Object.entries(items)) {
    if (item.gameModes?.includes('DOOMBOTS')) {
      result[key] = { ...item, prismatic: true };
    } else {
      result[key] = { ...item, prismatic: false };
    }
  }
  return result;
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
  // Mark prismatic items before filtering
  const markedItems = markPrismatic(items);
  // Apply sidebar filters first
  let filteredResult = filterBySidebar(markedItems, filterState);
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
