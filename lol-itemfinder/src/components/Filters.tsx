import React from 'react';
import type { FilterState, FiltersProps } from '../types/types';
// import { ITEM_TYPES, ITEM_STATS, ITEM_CLASSES } from '../constants';
import { ITEM_STATS } from '../constants';


const MAPS = [
  { id: '11', name: "Summoner's Rift" },
  { id: '12', name: 'Howling Abyss' },
];

const GAME_MODES = [
  // { id: 'CLASSIC', name: 'Classic' },
  // { id: 'ARAM', name: 'ARAM' },
  // { id: 'URF', name: 'URF (Ultra Rapid Fire)' },
  { id: 'DOOMBOTS', name: 'Doom Bots' }, // <-- Added Doom Bots
  { id: 'ARENA', name: 'Arena' },
  // { id: 'TEAMFIGHTTACTICS', name: 'Teamfight Tactics' },
];

import '../styles/Filters.css';

const Filters: React.FC<FiltersProps> = ({ filterState, setFilterState }) => {
  // More type-safe helper function for array properties
  function getArrayFromFilterState<K extends keyof FilterState>(key: K): string[] {
    const value = filterState[key];
    // Only return if it's actually an array
    if (Array.isArray(value)) {
      return value as string[];
    }
    // Fallback empty array if somehow not an array
    console.warn(`Expected array for ${String(key)} but got:`, value);
    return [];
  }

  // No default exclusion for champion-specific items
  function handleChange(category: keyof FilterState, value: string) {
    const current = getArrayFromFilterState(category);
    setFilterState(prev => ({
      ...prev,
      [category]: current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value]
    }));
  }

  function handleMapCheckbox(type: 'include' | 'exclude', mapId: string) {
    const key = type === 'include' ? 'mapInclude' : 'mapExclude';
    const arr = getArrayFromFilterState(key as keyof FilterState);
    setFilterState(prev => ({
      ...prev,
      [key]: arr.includes(mapId)
        ? arr.filter((id: string) => id !== mapId)
        : [...arr, mapId]
    }));
  }

  // Handler to clear all filters
  function handleClearFilters() {
    setFilterState({
      purchasableInclude: [],
      purchasableExclude: [],
      mapInclude: [],
      mapExclude: [],
      type: [],
      excludeType: [],
      stat: [],
      excludeStat: [],
      class: [],
      excludeClass: [],
      gameModeInclude: [],
      gameModeExclude: [],
    });
  }

  return (
    <div className="filters-container" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleClearFilters}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          padding: '4px 12px',
          fontSize: '0.95em',
          borderRadius: '6px',
          border: '1px solid #f0c674',
          background: '#232c3a',
          color: '#f0c674',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        {/* Clear All Filters */}
        Clear
      </button>
      <h2 className="filters-title">Filters</h2>
      {/* <h2 className="filters-title">FILTERS</h2> */}
      <div className="filters-section">
        {/* <strong>Miscellaneous</strong> */}
        <strong>Misc</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label className="custom-include-checkbox">
            <input
              type="checkbox"
              checked={filterState.purchasableInclude.includes('yes')}
              onChange={() => handleChange('purchasableInclude', 'yes')}
              disabled={filterState.purchasableExclude.includes('yes')}
              style={filterState.purchasableExclude.includes('yes') ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            />
            <span className="custom-include-checkmark">
              {filterState.purchasableInclude.includes('yes') ? '✓' : ''}
            </span>
          </label>
          <label className="custom-exclude-checkbox" style={{ marginLeft: '8px' }}>
            <input
              type="checkbox"
              checked={filterState.purchasableExclude.includes('yes')}
              onChange={() => handleChange('purchasableExclude', 'yes')}
              disabled={filterState.purchasableInclude.includes('yes')}
              style={filterState.purchasableInclude.includes('yes') ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            />
            <span className="custom-exclude-checkmark">
              {filterState.purchasableExclude.includes('yes') ? '✗' : ''}
            </span>
          </label>
          <span style={{ marginLeft: '10px' }}>Purchasable</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <label className="custom-include-checkbox">
            <input
              type="checkbox"
              checked={filterState.type.includes('Champion-Specific')}
              onChange={() => handleChange('type', 'Champion-Specific')}
              disabled={filterState.excludeType.includes('Champion-Specific')}
              style={filterState.excludeType.includes('Champion-Specific') ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            />
            <span className="custom-include-checkmark">
              {filterState.type.includes('Champion-Specific') ? '✓' : ''}
            </span>
          </label>
          <label className="custom-exclude-checkbox" style={{ marginLeft: '8px' }}>
            <input
              type="checkbox"
              checked={filterState.excludeType.includes('Champion-Specific')}
              onChange={() => handleChange('excludeType', 'Champion-Specific')}
              disabled={filterState.type.includes('Champion-Specific')}
              style={filterState.type.includes('Champion-Specific') ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            />
            <span className="custom-exclude-checkmark">
              {filterState.excludeType.includes('Champion-Specific') ? '✗' : ''}
            </span>
          </label>
          <span style={{ marginLeft: '10px' }}>Champion-Specific</span>
        </div>
      </div>
      <div className="filters-section">
        <strong>Map</strong>
        <div className="filters-checkbox-group">
          {MAPS.map(map => (
            <div key={map.id} className="map-filter-row">
              <label className="custom-include-checkbox">
                <input
                  type="checkbox"
                  checked={filterState.mapInclude.includes(map.id)}
                  onChange={() => handleMapCheckbox('include', map.id)}
                  disabled={filterState.mapExclude.includes(map.id)}
                  style={filterState.mapExclude.includes(map.id) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                />
                <span className="custom-include-checkmark">
                  {filterState.mapInclude.includes(map.id) ? '✓' : ''}
                </span>
              </label>
              <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
                <input
                  type="checkbox"
                  checked={filterState.mapExclude.includes(map.id)}
                  onChange={() => handleMapCheckbox('exclude', map.id)}
                  disabled={filterState.mapInclude.includes(map.id)}
                  style={filterState.mapInclude.includes(map.id) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                />
                <span className="custom-exclude-checkmark">
                  {filterState.mapExclude.includes(map.id) ? '✗' : ''}
                </span>
              </label>
              <span className="filters-checkbox-text" style={{marginLeft: '10px'}}>{map.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="filters-section">
        <strong>Game Mode</strong>
        <div className="filters-checkbox-group">
          {GAME_MODES.map(mode => (
            <div key={mode.id} className="map-filter-row">
              <label className="custom-include-checkbox">
                <input
                  type="checkbox"
                  checked={filterState.gameModeInclude.includes(mode.id)}
                  onChange={() => handleChange('gameModeInclude', mode.id)}
                  disabled={filterState.gameModeExclude.includes(mode.id)}
                  style={filterState.gameModeExclude.includes(mode.id) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                />
                <span className="custom-include-checkmark">
                  {filterState.gameModeInclude.includes(mode.id) ? '✓' : ''}
                </span>
              </label>
              <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
                <input
                  type="checkbox"
                  checked={filterState.gameModeExclude.includes(mode.id)}
                  onChange={() => handleChange('gameModeExclude', mode.id)}
                  disabled={filterState.gameModeInclude.includes(mode.id)}
                  style={filterState.gameModeInclude.includes(mode.id) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                />
                <span className="custom-exclude-checkmark">
                  {filterState.gameModeExclude.includes(mode.id) ? '✗' : ''}
                </span>
              </label>
              <span className="filters-checkbox-text" style={{marginLeft: '10px'}}>{mode.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="filters-section">
        <strong>Stat / Effect</strong>
        {ITEM_STATS.map((stat, idx) => {
          // Insert separators at the specified indices
          // Separator above Ability Haste (index 12)
          const separatorIndices = [6, 9, 12, 15];
          const separator =
            separatorIndices.includes(idx) ? (
              <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '8px 0' }} />
            ) : null;
          return (
            <React.Fragment key={stat}>
              {separator}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <label className="custom-include-checkbox">
                  <input
                    type="checkbox"
                    checked={filterState.stat.includes(stat)}
                    onChange={() => handleChange('stat', stat)}
                    disabled={filterState.excludeStat.includes(stat)}
                    style={filterState.excludeStat.includes(stat) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                  />
                  <span className="custom-include-checkmark">{filterState.stat.includes(stat) ? '✓' : ''}</span>
                </label>
                <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
                  <input
                    type="checkbox"
                    checked={filterState.excludeStat.includes(stat)}
                    onChange={() => handleChange('excludeStat', stat)}
                    disabled={filterState.stat.includes(stat)}
                    style={filterState.stat.includes(stat) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                  />
                  <span className="custom-exclude-checkmark">{filterState.excludeStat.includes(stat) ? '✗' : ''}</span>
                </label>
                <span style={{marginLeft: '10px'}}>{stat}</span>
              </div>
            </React.Fragment>
          );
        })}        
      </div>
      <div className="filters-section">
        <strong>Type</strong>
        {['Starter', 'Consumable', 'Ward', 'Boots'].map(type => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label className="custom-include-checkbox">
              <input
                type="checkbox"
                checked={filterState.type.includes(type)}
                onChange={() => handleChange('type', type)}
                disabled={filterState.excludeType.includes(type)}
                style={filterState.excludeType.includes(type) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-include-checkmark">{filterState.type.includes(type) ? '✓' : ''}</span>
            </label>
            <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
              <input
                type="checkbox"
                checked={filterState.excludeType.includes(type)}
                onChange={() => handleChange('excludeType', type)}
                disabled={filterState.type.includes(type)}
                style={filterState.type.includes(type) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-exclude-checkmark">{filterState.excludeType.includes(type) ? '✗' : ''}</span>
            </label>
            <span style={{marginLeft: '10px'}}>{type}</span>
          </div>
        ))}
      </div>
      <div className="filters-section">
        <strong>Rarity</strong>
        {['Unique', 'Basic', 'Epic', 'Legendary'].map(type => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label className="custom-include-checkbox">
              <input
                type="checkbox"
                checked={filterState.type.includes(type)}
                onChange={() => handleChange('type', type)}
                disabled={filterState.excludeType.includes(type)}
                style={filterState.excludeType.includes(type) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-include-checkmark">{filterState.type.includes(type) ? '✓' : ''}</span>
            </label>
            <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
              <input
                type="checkbox"
                checked={filterState.excludeType.includes(type)}
                onChange={() => handleChange('excludeType', type)}
                disabled={filterState.type.includes(type)}
                style={filterState.type.includes(type) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-exclude-checkmark">{filterState.excludeType.includes(type) ? '✗' : ''}</span>
            </label>
            <span style={{marginLeft: '10px'}}>{type}</span>
          </div>
        ))}
      </div>
      {/*
      <div className="filters-section filters-section-last">
        <strong>Role</strong>
        {ITEM_CLASSES.map(cls => (
          <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label className="custom-include-checkbox">
              <input
                type="checkbox"
                checked={filterState.class.includes(cls)}
                onChange={() => handleChange('class', cls)}
                disabled={filterState.excludeClass.includes(cls)}
                style={filterState.excludeClass.includes(cls) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-include-checkmark">{filterState.class.includes(cls) ? '✓' : ''}</span>
            </label>
            <label className="custom-exclude-checkbox" style={{marginLeft: '8px'}}>
              <input
                type="checkbox"
                checked={filterState.excludeClass.includes(cls)}
                onChange={() => handleChange('excludeClass', cls)}
                disabled={filterState.class.includes(cls)}
                style={filterState.class.includes(cls) ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
              />
              <span className="custom-exclude-checkmark">{filterState.excludeClass.includes(cls) ? '✗' : ''}</span>
            </label>
            <span style={{marginLeft: '10px'}}>{cls}</span>
          </div>
        ))}
      </div>
      */}
    </div>
  );
};

export default Filters;
