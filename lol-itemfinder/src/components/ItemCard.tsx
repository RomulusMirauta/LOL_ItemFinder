import React from 'react';
import type { ItemCardProps } from '../types/types';

import '../styles/ItemCard.css';


function cleanItemName(name: string): string {
  return name
    .replace(/<[^>]+>/g, '') // Remove all HTML-like tags
    .replace(/@[\w]+@/g, '') // Remove Riot placeholders
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPlainText(plaintext: string): string {
  return plaintext
    .replace(/@[\w]+@/g, '')
    .replace(/<status>(.*?)<\/status>/g, '$1')
    .replace(/<magicDamage>(.*?)<\/magicDamage>/g, '$1')
    .replace(/<recast>(.*?)<\/recast>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const ItemCard: React.FC<ItemCardProps> = ({ item, version, isActive, setActiveItem }) => (
  <div
    className={`item-card${isActive ? ' active' : ''}`}
    onMouseEnter={() => setActiveItem(item.name)}
    onMouseLeave={() => setActiveItem(null)}
    onClick={() => setActiveItem(isActive ? null : item.name)}
  >
    <img
      // src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`}
      src={
        item.name === 'Poro'
        ? `/logo2.png` // Use public/logo2.png for Poro
        : `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`}
      alt={item.name}
      className="item-card-img"
    />

    {/* <h3 className="item-card-title">{item.name}</h3> */}
    <h3 className="item-card-title">{cleanItemName(item.name ?? '')}</h3>

    <div className="item-card-gold-container">
      <span className="item-card-gold">{item.gold?.total ?? 0} Gold</span>
    </div>
    {/* <p className="item-card-plaintext">{item.plaintext}</p> */}
    
    <div className="item-card-plaintext"><p>
      {/* {item.plaintext} */}
      {cleanPlainText(item.plaintext ?? '')}
      </p></div>

    {isActive && (
      <div className="item-card-description">
        <strong>Description:</strong>
        <div dangerouslySetInnerHTML={{ __html: item.description }} />
        {/* <div>{cleanDescription(item.description)}</div> */}
      </div>
    )}
  </div>
);

export default ItemCard;
