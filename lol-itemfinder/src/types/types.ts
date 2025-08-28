import type { Item } from './item';
import type React from 'react';
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}


export interface ItemCardProps {
  item: Item;
  version: string;
  isActive: boolean;
  setActiveItem: (name: string | null) => void;
}


export interface ItemGridProps {
  items: Item[];
  version: string;
  activeItem: string | null;
  setActiveItem: (name: string | null) => void;
}

export type FilterState = {
  // Changed from string enum to include/exclude arrays
  purchasableInclude: string[];
  purchasableExclude: string[];

  // Map include/exclude arrays (keys used in Filters.tsx / itemSearch)
  mapInclude: string[];
  mapExclude: string[];

  // Type include / exclude
  type: string[];
  excludeType: string[];

  // Stat include / exclude
  stat: string[];
  excludeStat: string[];

  // Class include / exclude
  class: string[];
  excludeClass: string[];

  // Add Game Mode filters
  gameModeInclude: string[];
  gameModeExclude: string[];
};

export interface FiltersProps {
  filterState: FilterState;
  // Accept the same setter signature returned by useState in App
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}
