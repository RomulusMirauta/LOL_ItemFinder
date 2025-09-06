// src/utils/itemConstants.ts

export const TENACITY_KEYWORDS = [
  'tenacity',
  // 'crowd control reduction',
  // 'reduces the duration of crowd control',
  // 'reduces crowd control duration',
  // 'cc reduction',
  // 'reduced duration of crowd control',
  // 'reduces duration of crowd control',
  // 'reduces duration of disables',
  // 'reduces disables',
  // 'mercury',
  // 'mercury treads',
  // 'boots of swiftness',
  // 'legend: tenacity',
  // 'stubborn',
  // 'less affected by crowd control',
  // 'less affected by disables',
  ' Tenacity</stats>',
  'Tenacity</stats>'
].map(k => k.toLowerCase());

export const NOT_TENACITY_ITEMS = [
  'Gunmetal Greaves',
  'Elixir of Avarice',
  'Elixir of Force',
  'Stat Bonus',
  'Legendary Fighter Item',
  'Mikael\'s Blessing',
  'Anathema\'s Chains',
  'Mercurial Scimitar',
  'Prismatic Item'
];

// export const ARENA_SPECIAL_ITEMS = [
//   'The Golden Spatula',
//   'Prismatic Item',
//   'Stat Bonus',
//   'Anvil Voucher',
//   'Gold Stat Anvil Voucher',
//   'Prismatic Stat Voucher',
//   'Bravery Voucher',
//   'Cappa Juice',
//   'Juice of Power',
//   'Juice of Vitality',
//   'Juice of Haste',
//   'Bandle Juice of Power',
//   'Bandle Juice of Vitality',
//   'Bandle Juice of Haste',
//   'Legendary Fighter Item',
//   'Legendary Marksman Item',
//   'Legendary Assassin Item',
//   'Legendary Mage Item',
//   'Legendary Tank Item',
//   'Legendary Support Item'
//   ];

// export const DOOM_BOTS_SPECIAL_ITEMS = [
//   'Crown of the Shattered Queen',
//   "Hextech Gunblade",
//   'Cruelty',
//   'Sword of Blossoming Dawn',
//   'Sword of the Divine',
//   "Atma's Reckoning",
//   'Zephyr',
//   'Flesheater',
//   'Gargoyle Stoneplate',
//   'Cloak of Starry Night',
//   'Shield of Molten Stone'
// ];

export const ARENA_SPECIAL_ITEMS = [
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

// export const DOOM_BOTS_SPECIAL_ITEMS = [
//   'Crown of the Shattered Queen',
//   "Hextech Gunblade",
//   'Cruelty',
//   'Sword of Blossoming Dawn',
//   'Sword of the Divine',
//   "Atma's Reckoning",
//   'Zephyr',
//   'Flesheater',
//   'Gargoyle Stoneplate',
//   'Cloak of Starry Night',
//   'Shield of Molten Stone'
// ];

export const DOOM_BOTS_SPECIAL_ITEMS = [
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
  'Shield of Molten Stone',
  // 'Gambler\'s Blade', // old Doom Bots item
  'Demon King\'s Crown',  // only available in EXTREME difficulty - Doom Bots Veigar's Evil
  'Veigar\'s Talisman of Ascension' // only available in EXTREME difficulty - Doom Bots Veigar's Curse
];

export const ANTI_HEAL_KEYWORDS = [
  'grievous wounds',
  'anti-heal',
  'healing reduction',
  'reduces healing',
  'reduce healing',
  'inflict grievous wounds',
  'applies grievous wounds',
  'applies anti-heal',
  'reduce the effectiveness of healing',
  'reducing healing',
  'heal reduction',
  'healing is reduced',
  'heal is reduced',
  'heal is less effective',
  'less healing',
  'reduced healing',
];

export const ANTI_SHIELD_KEYWORDS = [
  'anti-shield',
  'shield reduction',
  'reduces shields',
  'reduce shield',
  'shield is reduced',
  'shield is less effective',
  'less shield',
  'reduced shield',
  'shield breaker',
  'breaks shield',
  'break shield',
  'shield destruction',
  'destroy shield',
  'destroy shields',
  'shield is destroyed',
  'removes shield',
  'removes shields',
  'removes enemy shield',
  'removes target shield',
  'removes target shields',
  'removes all shields',
  'removes all enemy shields',
  'removes all target shields',
];

export const ALL_SHIELD_TYPES_KEYWORDS = [
  // 'grants a shield',
  // ' that regenerates after killing large monsters or out of combat',
  // '<shield>',
  // '</shield>',
  '<shield>200 - 360 Shield</shield>',
  // 'Shield</shield>',
  '<shield>shield</shield>',
  '<shield> shield</shield>',
  '<shield>magic shield</shield>',
  '<shield>physical shield</shield>',
  '<shield>decaying shield</shield>',
  '<shield>magic damage shield</shield>',
  '<shield></shield>',
  'granting a shield', // Deep Freeze
  'small shield', // Lover's Ricochet
  // 'gain shield',
  // 'grant shield',
  // 'gain a shield',
  // 'if you are struck by the lightning, gain a ', // Lightning Rod
  // 'damage shield',
  'spell shield',
  'physical shield',
  'magic shield',
  'shield that decays', // Gargoyle Stoneplate
  'that decays over 2.5 seconds.', // Locket of the Iron Solari
  'grant you or your targeted ally a shield',
  'grants you a shield',
  'magic damage shield',
  'decaying shield',
  // 'lifeline',
  // 'convert excess healing from your lifesteal to a shield', // Bloodthirster
  // ' a champion, gain a ' // Armored Advance, Chainlaced Crushers
].map(k => k.toLowerCase());

export const OMNI_SHIELD_KEYWORDS = [
  '<shield>shield</shield>',
  '<shield> shield</shield>',
  // '<shield>magic shield</shield>',
  // '<shield>physical shield</shield>',
  '<shield>decaying shield</shield>',
  // '<shield>magic damage shield</shield>',
  '<shield></shield>',
  'granting a shield', // Deep Freeze
  'small shield', // Lover's Ricochet
  // 'spell shield',
  'shield that decays', // Gargoyle Stoneplate
  'that decays over 2.5 seconds.', // Locket of the Iron Solari
  'grant you or your targeted ally a shield',
  'grants you a shield',
  // 'magic damage shield',
  'decaying shield',
  // 'lifeline',
].map(k => k.toLowerCase());

export const PHYSICAL_DAMAGE_SHIELD_KEYWORDS = [
    '<shield></shield> <physicalDamage>physical</physicalDamage> <shield>shield</shield>'
  ].map(k => k.toLowerCase());

export const MAGIC_DAMAGE_SHIELD_KEYWORDS = [
  '<shield></shield> <magicDamage>magic</magicDamage> <shield>shield</shield>',
  '<shield>magic shield</shield>',
  '<shield>magic damage shield</shield>',
  // 'spell shield',
  'magic damage shield'
].map(k => k.toLowerCase());

export const SPELL_SHIELD_KEYWORDS = [
  'spell shield'
].map(k => k.toLowerCase());

export const EXCLUDED_FROM_ACTIVE_ITEMS = [
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
