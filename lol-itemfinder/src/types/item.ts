export type Item = {
  name: string;
  description: string;
  image: { full: string };
  gold?: { total: number; purchasable?: boolean }; // Make gold optional to handle edge cases
  tags?: string[];
  type?: string[];
  plaintext?: string;
  maps?: { [key: string]: boolean };
  requiredChampion?: string;
  rarityLegendary?: boolean;
  rarityMythic?: boolean;
  rarityGeneric?: boolean;
  gameModes?: string[];
};
