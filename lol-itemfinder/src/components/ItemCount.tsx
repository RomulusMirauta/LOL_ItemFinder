import React from 'react';
import '../styles/ItemCount.css';

interface ItemCountProps {
  count: number;
}

const ItemCount: React.FC<ItemCountProps> = ({ count }) => (
  <span className="item-count-under-search">
    {`Showing ${count} ${count === 1 ? 'item' : 'items'}`}
  </span>
);

export default ItemCount;
