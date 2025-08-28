import React from 'react';
import ItemCard from './ItemCard';
import type { ItemGridProps } from '../types/types';
import '../styles/ItemGrid.css';

const ItemGrid: React.FC<ItemGridProps> = ({ items, version, activeItem, setActiveItem }) => (
  <div className="item-grid">
    {items.filter(item => 
      // Filter out potentially invalid items
      item && item.name && item.image && item.image.full && item.description
    ).map(item => (
      <ItemCard
        key={item.name}
        item={item}
        version={version}
        isActive={activeItem === item.name}
        setActiveItem={setActiveItem}
      />
    ))}
  </div>
);

// Ensure spectral items have the proper structure for sorting
export const spectralItems = [
  { 
    name: 'Poro', 
    // image: { full: 'placeholder.png' }, 
    image: { full: 'logo2.png' }, 
    // gold: { total: 9999999999, purchasable: false },
    gold: { total: 9999, purchasable: false },
    // gold: { total: '1.000.000.000', purchasable: false },
    // gold: { total: '∞', purchasable: false }, 
    // gold: { total: 'Not', purchasable: false }, 
    plaintext: 'Try to search for another keyword and/or different combination of filters', 
    description: 'Poro desires Poro-Snax', 
    tags: []
    // type: 'Poro' // <-- or any valid type from ITEM_TYPES
  },
];

export default ItemGrid;
