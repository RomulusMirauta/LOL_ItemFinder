import type { Item } from '../types/item';

export type SortType = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export function sortItems(items: Item[], sort: SortType): Item[] {
  // Make a defensive copy of the items array
  const itemsCopy = [...items];
  
  // Helper function to safely get an item's price
  const getPrice = (item: Item): number => {
    return item?.gold?.total ?? 0;
  };

  try {
    switch(sort) {
      case 'price-asc': {
        // Use direct comparison for ascending price sort
        // In JavaScript, Array.sort is stable, so equal prices maintain relative order
        return itemsCopy.sort((a, b) => {
          return getPrice(a) - getPrice(b);
        });
      }
      
      case 'price-desc': {
        // Use direct comparison for descending price sort
        return itemsCopy.sort((a, b) => {
          return getPrice(b) - getPrice(a);
        });
      }
      
      case 'name-asc':
        return itemsCopy.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        
      case 'name-desc':
        return itemsCopy.sort((a, b) => (b?.name || '').localeCompare(a?.name || ''));
        
      default:
        console.warn(`Unknown sort type: ${sort}`);
        return itemsCopy;
    }
  } catch (error) {
    console.error('Error during sorting operation:', error);
    return itemsCopy; // Return unsorted copy if sort fails
  }
}
