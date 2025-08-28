export type Item = {
  name: string;
  description: string;
  image: { full: string };
  gold?: { total: number; purchasable?: boolean }; // Make gold optional to handle edge cases
  tags?: string[];
  type?: string[];
  // type: string[]; // Make type mandatory
  plaintext?: string;
  maps?: { [key: string]: boolean };
  requiredChampion?: string;
  rarityLegendary?: boolean;
  rarityMythic?: boolean;
  rarityGeneric?: boolean;
  /**
   * List of game modes where this item is available.
   * Example: ['CLASSIC', 'ARAM', 'DOOMBOTS']
   * Ensure items that should be available in Doom Bots include "DOOMBOTS" in this array.
   */
  gameModes?: string[];
  /**
   * If true, this item is Prismatic (special Doom Bots item).
   * Automatically true if gameModes includes 'DOOMBOTS'.
   */
  prismatic?: boolean;
};
