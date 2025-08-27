import React from 'react';
import type { SearchBarProps } from '../types/types';
import '../styles/SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="searchbar-container">
    <input
      type="text"
      // placeholder="Search items or stats (e.g. tenacity)"
      // placeholder="Find items by keywords (e.g. tenacity, hydra)"
      placeholder="Find items by keywords (e.g. tenacity)"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="searchbar-input"
    />
  </div>
);

export default SearchBar;
