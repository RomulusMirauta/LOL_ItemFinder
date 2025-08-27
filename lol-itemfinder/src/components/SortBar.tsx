import React from 'react';
import '../styles/SortBar.css';
import type { SortType } from '../utils/itemSort';

interface SortBarProps {
  value: SortType;
  onChange: (value: SortType) => void;
}

const SortBar: React.FC<SortBarProps> = ({ value, onChange }) => {
  // Safe type assertion with validating the value
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    // Cast is safe because our options only include valid SortType values
    onChange(newValue as SortType);
  };

  return (
    <div className="sort-bar">
      <label htmlFor="sort-select" style={{ marginRight: 8 }}>Sort by:</label>
      <select
        id="sort-select"
        value={value}
        onChange={handleChange}
        className="sort-bar-select"
      >
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};

export default SortBar;
