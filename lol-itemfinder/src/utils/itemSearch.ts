import type { FilterState } from '../types/types';
import type { Item } from '../types/item';

// import { tenacityPhrases } from './itemConstants';
import { 
  TENACITY_KEYWORDS,
  ARENA_SPECIAL_ITEMS,
  DOOM_BOTS_SPECIAL_ITEMS,
  ANTI_HEAL_KEYWORDS,
  ANTI_SHIELD_KEYWORDS,
  ALL_SHIELD_TYPES_KEYWORDS,
  OMNI_SHIELD_KEYWORDS,
  PHYSICAL_DAMAGE_SHIELD_KEYWORDS,
  MAGIC_DAMAGE_SHIELD_KEYWORDS,
  SPELL_SHIELD_KEYWORDS,
  EXCLUDED_FROM_ACTIVE_ITEMS,
  NOT_TENACITY_ITEMS,
 } from './itemConstants';

import { filterByAttackDamage } from './itemFilters';

import { 
  ITEM_MISC, 
  // MAPS, 
  // GAME_MODES, 
  // ITEM_STAT_EFFECT, 
  // ITEM_TYPE, 
  // ITEM_RARITY, 
  // ITEM_CLASSES 
} from '../constants';


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
  // Map filter logic
  if (mapIncludeArr.length > 0 || mapExcludeArr.length > 0) {
    filtered = filtered.filter(item => {
      if (item.maps) {
        // Include if available on any included map
        const isIncluded = mapIncludeArr.some(mapId => item.maps?.[mapId]);
        // Exclude if available on any excluded map
        const isExcluded = mapExcludeArr.some(mapId => item.maps?.[mapId]);
        // If Summoner's Rift is excluded, exclude items that would be included if Summoner's Rift was included
        if (mapExcludeArr.includes('11')) {
          if (item.maps['11']) return false;
        }
        // If Howling Abyss is excluded, exclude items that would be included if Howling Abyss was included
        if (mapExcludeArr.includes('12')) {
          if (item.maps['12']) return false;
        }
        return isIncluded && !isExcluded;
      }
      return true;
    });
  }
  // Arena exclusion logic
  if (filterState.gameModeExclude.includes('ARENA')) {
    filtered = filtered.filter(item => {
      const modes: string[] = (item as Item & { gameModes?: string[] }).gameModes ?? [];
      // Exclude items available in Arena or are Arena special items
      return !modes.includes('ARENA') && !ARENA_SPECIAL_ITEMS.includes(item.name);
    });
  }
  // Doom Bots exclusion logic
  if (filterState.gameModeExclude.includes('DOOMBOTS')) {
    filtered = filtered.filter(item => {
      const modes: string[] = (item as Item & { gameModes?: string[] }).gameModes ?? [];
      return !modes.includes('DOOMBOTS') && !(item.prismatic === true) && !DOOM_BOTS_SPECIAL_ITEMS.includes(item.name);
    });
  }
  const typeArr = filterState.type;
  // Misc filters implementation (dynamic)
  ITEM_MISC.forEach(misc => {
    if (misc === 'Purchasable' && typeArr.includes(misc)) {
      // Already handled above
      return;
    }
    if (misc === 'Champion-Specific' && typeArr.includes(misc)) {
      filtered = filtered.filter(item => !!item.requiredChampion);
    }
    // Add more misc filters here if needed
  });
  // Rarity filters
  const rarityArr = typeArr.filter(type => ['Unique', 'Basic', 'Epic', 'Legendary', 'Mythic', 'Prismatic'].includes(type));
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
        if (rarity === 'Prismatic') {
          return (
            item.prismatic === true ||
            item.name.toLowerCase().includes('prismatic') ||
            // item.description.toLowerCase().includes('prismatic') ||
            ( DOOM_BOTS_SPECIAL_ITEMS.map(i => i.toLowerCase()).includes(item.name.toLowerCase()) && item.gold?.total === 2500) ||
            item.name === 'Veigar\'s Talisman of Ascension'
            // ARENA_SPECIAL_ITEMS.map(i => i.toLowerCase()).includes(item.name.toLowerCase())
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
  const antiHealChecked = statArr.includes('Anti-Heal *');
  const antiShieldChecked = statArr.includes('Anti-Shield *');
  // const shieldChecked = statArr.includes('Shield');
  if (statArr.length > 0) {
    filtered = filtered.filter(item => {
      if (tenacityChecked) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        return TENACITY_KEYWORDS.some(phrase =>
          textFields.some(field => field.includes(phrase)) && !NOT_TENACITY_ITEMS.includes(item.name)
        );
      }
      // Anti-Heal filter implementation
      if (antiHealChecked) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        return ANTI_HEAL_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
      }
      // Anti-Shield filter implementation
      if (antiShieldChecked) {
        const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        return ANTI_SHIELD_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
      }
      // Shield filter implementation
      // if (shieldChecked) {
      if (statArr.includes('All Shield Types *')) {
        // const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const textFields = [item.name || '', item.description].map(f => f.toLowerCase());
        const matchesShieldKeywords = ALL_SHIELD_TYPES_KEYWORDS.some(keyword => 
          textFields.some(field => field.includes(keyword)));
        // const isNotShield = textFields.some(field => field.includes('Move faster while attacking enemies and gain a shield when on low health.'));
        // const isNotShield = [
          // 'Move faster while attacking enemies and gain a shield when on low health.', // Phantom Dancer
          // 'soul anchor' // Lifeline
        // ];
        // const matchesIsNotShield = isNotShield.some(keyword =>
        //   (item.description || '').toLowerCase().includes(keyword.toLowerCase()));
        // const separatePhysicalShield = ['physical', 'shield'];
        // const separateMatchPhysicalShield = textFields.some(field => field.includes('physical') && field.includes('shield'));
        // const matchesSeparatePhysicalShield = separatePhysicalShield.every(keyword => (item.description || '').toLowerCase().includes(keyword.toLowerCase()));
        // const matchesSeparatePhysicalShield = (item.description || '').toLowerCase().includes('physical shield');
        // const matchesSeparatePhysicalShield = textFields.some(field => field.includes('physical shield'));
        // const separateMagicShield = ['magic', 'shield'];
        // const separateMatchMagicShield = textFields.some(field => field.includes('magic') && field.includes('shield'));
        // const matchesSeparateMagicShield = separateMagicShield.every(keyword => (item.description || '').toLowerCase().includes(keyword.toLowerCase()));
        // const isExplicitlyIncluded = [
          // 'Armored Advance',
          // 'Spirit Visage'
        // ].includes(item.name);
        // const itemsToBeExcluded = ['Ardent Censer', 'Staff of Flowing Water', 'Spirit Visage'];
        // const matchesItemsToBeExcluded = itemsToBeExcluded.some(keyword =>
          // (item.name || '').toLowerCase().includes(keyword.toLowerCase()));
        // return shieldKeywords.some(keyword =>
        //   textFields.some(field => field.includes(keyword))
        // );
        // return shieldKeywords.some(keyword =>
        //   textFields.some(field => field.includes(keyword)) && 
        //     !isNotShield.some(notShield => 
        //       textFields.some(field => field.includes(notShield)))
        // );
        // return shieldKeywords.some(keyword =>
        //   textFields.some(field => field.includes(keyword)) && 
        //   !isNotShield.some(notShield => 
        //     textFields.some(field => field.includes(notShield))) ||
        //     separatePhysicalShield || separateMagicShield && !matchesExclude
        // );
        return matchesShieldKeywords
      }
      // Omni-Shield * filter implementation
      if (statArr.includes('Omni-Shield *')) {
        // First, get all items that match All Shield Types *
        // const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const textFields = [item.name || item.plaintext || '', item.description].map(f => f.toLowerCase());
        const matchesShieldKeywords = OMNI_SHIELD_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
        const excludeKeywords = [
          // 'magic damage shield',
          // 'spell shield',
          // 'magic shield',
          // 'soul anchor',
          // '<shield>magic shield</shield>',
          '<shield></shield> <magicDamage>magic</magicDamage> <shield>shield</shield>',
          '<shield></shield> <physicalDamage>physical</physicalDamage> <shield>shield</shield>',
          // '<shield>physical shield</shield>',
          // '<shield>magic damage shield</shield>'
        ].map(k => k.toLowerCase());
        const matchesExclude = excludeKeywords.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
        return matchesShieldKeywords && !matchesExclude;
        // return matchesShieldKeywords
      }
      // Physical Damage Shield * filter implementation
      if (statArr.includes('Physical Damage Shield *')) {
        // Get all items that match All Shield Types * and also have 'physical shield'
        const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const matchesShieldKeywords = PHYSICAL_DAMAGE_SHIELD_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
        // const matchesPhysical = textFields.some(field => field.includes('physical shield'));
        // const matchesPhysical = textFields.some(field => field.includes('physical') && field.includes('shield'));
        // return matchesShield && matchesPhysical;
        return matchesShieldKeywords;
      }
      if (statArr.includes('Magic Damage Shield *')) {
        const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const matchesShieldKeywords = MAGIC_DAMAGE_SHIELD_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
        return matchesShieldKeywords;
      }
      if (statArr.includes('Spell Shield *')) {
        const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
        const matchesShieldKeywords = SPELL_SHIELD_KEYWORDS.some(keyword =>
          textFields.some(field => field.includes(keyword))
        );
        return matchesShieldKeywords;
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
        if (EXCLUDED_FROM_ACTIVE_ITEMS.includes(item.name)) return false;
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
  // Exclude On-Hit Effects items when excluded
  if (filterState.excludeStat.includes('On-Hit Effects')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isOnHit = textFields.some(field => field.includes('on hit') || field.includes('on-hit') || field.includes('onhit') || field.includes('spellblade'));
      return !isOnHit;
    });
  }
  // Exclude Lethality * items when excluded
  if (filterState.excludeStat.includes('Lethality *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isLethality = textFields.some(field => field.includes('lethality'));
      return !isLethality;
    });
  }
  // Exclude Mana & Regeneration items when excluded
  if (filterState.excludeStat.includes('Mana & Regeneration')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isMana = textFields.some(field => field.includes('mana'));
      return !isMana;
    });
  }
  // Exclude Health & Regeneration items when excluded
  if (filterState.excludeStat.includes('Health & Regeneration')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isHealth = textFields.some(field => field.includes('health') || field.includes('hp'));
      return !isHealth;
    });
  }
  // Exclude Magic Resistance items when excluded
  if (filterState.excludeStat.includes('Magic Resistance')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isMR = textFields.some(field => field.includes('magic resistance') || field.includes('mr') || field.includes('magic resist'));
      return !isMR;
    });
  }
  // Exclude Movement Speed items when excluded
  if (filterState.excludeStat.includes('Movement Speed')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isMS = textFields.some(field => field.includes('movement speed') || field.includes('ms') || field.includes('move speed'));
      return !isMS;
    });
  }
  // Exclude Life Steal & Omnivamp items when excluded
  if (filterState.excludeStat.includes('Life Steal & Omnivamp')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isLifeSteal = textFields.some(field => field.includes('life steal') || field.includes('omnivamp') || field.includes('spell vamp') || field.includes('vamp') || field.includes('heal on attack'));
      return !isLifeSteal;
    });
  }
  // Exclude Tenacity * items when excluded
  if (filterState.excludeStat.includes('Tenacity *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isTenacity = TENACITY_KEYWORDS.some(phrase => textFields.some(field => field.includes(phrase)));
      return !isTenacity;
    });
  }
  // Exclude Anti-Heal * items when excluded
  if (filterState.excludeStat.includes('Anti-Heal *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isAntiHeal = ANTI_HEAL_KEYWORDS.some(keyword => textFields.some(field => field.includes(keyword)));
      return !isAntiHeal;
    });
  }
  // Exclude Anti-Shield * items when excluded
  if (filterState.excludeStat.includes('Anti-Shield *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const isAntiShield = ANTI_SHIELD_KEYWORDS.some(keyword => textFields.some(field => field.includes(keyword)));
      return !isAntiShield;
    });
  }
  // Exclude All Shield Types * items when excluded
  if (filterState.excludeStat.includes('All Shield Types *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name || '', item.description].map(f => f.toLowerCase());
      const matchesShieldKeywords = ALL_SHIELD_TYPES_KEYWORDS.some(keyword => 
        textFields.some(field => field.includes(keyword)));
      return !matchesShieldKeywords;
    });
  }
  // Exclude Omni-Shield * items when excluded
  if (filterState.excludeStat.includes('Omni-Shield *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name || item.plaintext || '', item.description].map(f => f.toLowerCase());
      const matchesShieldKeywords = OMNI_SHIELD_KEYWORDS.some(keyword =>
        textFields.some(field => field.includes(keyword))
      );
      return !matchesShieldKeywords;
    });
  }
  // Exclude Physical Damage Shield * items when excluded
  if (filterState.excludeStat.includes('Physical Damage Shield *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const matchesPhysicalShield = PHYSICAL_DAMAGE_SHIELD_KEYWORDS.some(keyword =>
        textFields.some(field => field.includes(keyword))
      );
      return !matchesPhysicalShield;
    });
  }
  // Exclude Magic Damage Shield * items when excluded
  if (filterState.excludeStat.includes('Magic Damage Shield *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const matchesMagicShield = MAGIC_DAMAGE_SHIELD_KEYWORDS.some(keyword =>
        textFields.some(field => field.includes(keyword))
      );
      return !matchesMagicShield;
    });
  }
  // Exclude Spell Shield * items when excluded
  if (filterState.excludeStat.includes('Spell Shield *')) {
    filtered = filtered.filter(item => {
      const textFields = [item.name || item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      const matchesSpellShield = SPELL_SHIELD_KEYWORDS.some(keyword =>
        textFields.some(field => field.includes(keyword))
      );
      return !matchesSpellShield;
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
      if (excludeTypeArr.includes('Prismatic')) {
        if (item.prismatic === true) return false;
      }
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
      // Exclude Prismatic items when excluded
      if (filterState.excludeType.includes('Prismatic')) {
        // filtered = filtered.filter(item => !(item.prismatic === true));
        const isPrismatic = (
          DOOM_BOTS_SPECIAL_ITEMS.includes(item.name) ||
          item.name === 'Veigar\'s Talisman of Ascension'
        );
        return !isPrismatic;
      }
      // Exclude Basic items when excluded
      if (filterState.excludeType.includes('Basic')) {
        const desc = (item.description || '').toLowerCase();
        const isBasic = (
          item.rarityGeneric === true ||
          desc.includes('raritygeneric') ||
          desc.includes('<raritygeneric>') ||
          desc.includes('</raritygeneric>')
        );
        return !isBasic;
      }
      // Exclude Ward items when excluded
      if (excludeTypeArr.includes('Ward')) {
        // const type = (item.description || '').toLowerCase();
        // const name = (item.plaintext || '').toLowerCase();
        // const desc = (item.description || '').toLowerCase();
        if (
          item.tags?.includes('Ward') || 
          item.type?.includes('Ward') || 
          item.name.toLowerCase().includes(' ward') ||
          item.name.toLowerCase().includes('trinket') ||
          item.name.toLowerCase().includes('lens') || 
          item.name.toLowerCase().includes('farsight') || 
          item.description.toLowerCase().includes('warding')
        ) return false;
      }
      // Exclude Legendary items when excluded
      if (excludeTypeArr.includes('Legendary')) {
        if (
          item.rarityLegendary === true ||
          item.tags?.includes('rarityLegendary') ||
          item.type?.includes('rarityLegendary') ||
          item.description.includes('raritylegendary') ||
          item.description.includes('<raritylegendary>') ||
          item.description.includes('legendary') ||
          item.name.toLowerCase().includes('legendary')
          ) return false;
      }
      return !excludeTypeArr.some(type => item.tags?.includes(type) || item.type?.includes(type));
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
        // return modes.includes('DOOMBOTS') || item.prismatic === true || doomBotsItems.includes(item.name);
        return (
          item.gold?.total === 2500 && (
          modes.includes('DOOMBOTS') ||
          DOOM_BOTS_SPECIAL_ITEMS.includes(item.name) ) ||
          item.name === 'Veigar\'s Talisman of Ascension'
        );
        // return (
        //   modes.includes('DOOMBOTS') ||
        //   DOOM_BOTS_SPECIAL_ITEMS.includes(item.name) ||
        //   item.name === 'Veigar\'s Talisman of Ascension'
        // );
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

        return modes.includes('ARENA') || ARENA_SPECIAL_ITEMS.includes(item.name);
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
    const tenacitySearch = TENACITY_KEYWORDS.some(phrase => lowerSearch === phrase);
    filteredResult = filteredResult.filter(item => {
      const textFields = [item.name, item.plaintext || '', item.description, ...(item.tags || [])].map(f => f.toLowerCase());
      // const notTenacity = ['Gunmetal Greaves'];
      if (tenacitySearch || filterState.stat.map(s => s.toLowerCase()).includes('tenacity')) {
        // Only match items that strictly contain a tenacity phrase
        return TENACITY_KEYWORDS.some(phrase =>
          textFields.some(field => field.includes(phrase)) && !NOT_TENACITY_ITEMS.includes(item.name)
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
