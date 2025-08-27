import React from 'react';
import type { ItemCardProps } from '../types/types';

import '../styles/ItemCard.css';
const ItemCard: React.FC<ItemCardProps> = ({ item, version, isActive, setActiveItem }) => (
  <div
    className={`item-card${isActive ? ' active' : ''}`}
    onMouseEnter={() => setActiveItem(item.name)}
    onMouseLeave={() => setActiveItem(null)}
    onClick={() => setActiveItem(isActive ? null : item.name)}
  >
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`}
      alt={item.name}
      className="item-card-img"
    />
    <h3 className="item-card-title">{item.name}</h3>
    <div className="item-card-gold-container">
      <span className="item-card-gold">{item.gold?.total ?? 0} Gold</span>
    </div>
    <p className="item-card-plaintext">{item.plaintext}</p>
    {isActive && (
      <div className="item-card-description">
        <strong>Description:</strong>
        <div dangerouslySetInnerHTML={{ __html: item.description }} />
      </div>
    )}
  </div>
);

export default ItemCard;
