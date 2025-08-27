import { useEffect, useState } from 'react';
// import './App.css';
import './styles/Common.css';
import SearchBar from './components/SearchBar';
import MainTitle from './components/MainTitle';
import ItemGrid from './components/ItemGrid';
import { spectralItems } from './components/ItemGrid';
import Filters from './components/Filters';
import SortBar from './components/SortBar';
import type { FilterState } from './types/types';
import { filterItems } from './utils/itemSearch';
import { sortItems } from './utils/itemSort';
import type { SortType } from './utils/itemSort';
import type { Item } from './types/item';
import { fetchLatestVersion, fetchItems } from './api/riotApi';

function App() {
  useEffect(() => {
    document.title = 'League of Legends - Item Finder';
  }, []);
  // Filters state - set default enabled filters
  const [filterState, setFilterState] = useState<FilterState>({
    purchasableInclude: ['yes'],
    purchasableExclude: [],
    mapInclude: ['11'],
    mapExclude: ['12'],
    type: [],
    excludeType: ['Champion-Specific'], // <-- enabled by default
    stat: [],
    excludeStat: [],
    class: [],
    excludeClass: [],
  });
  const [items, setItems] = useState<Record<string, Item>>({});
  const [search, setSearch] = useState('');
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortType>('price-asc');

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function loadData() {
      try {
        const version = await fetchLatestVersion('eune');
        setVersion(version);
        const itemsData = await fetchItems(version);
        setItems(itemsData);
      } catch (err) {
        setError('Failed to load item data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter first, then sort only visible items
  const filteredItems = filterItems(items, search, filterState);
  
  // Safely sort items - with error handling
  let sortedItems: Item[] = [];
  try {
    sortedItems = sortItems(filteredItems, sort);
    
    // Use Vite's import.meta.env instead of process.env
    if (import.meta.env.DEV && sortedItems.length > 0) {
      console.log(`Sort ${sort} - First 5 items:`, 
        sortedItems.slice(0, 5).map(item => ({
          name: item.name, 
          price: item.gold?.total ?? 0
        }))
      );
    }
  } catch (err) {
    console.error('Sorting error:', err);
    sortedItems = filteredItems; // Use unsorted items as fallback
  }

  // Track which item is hovered or clicked
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%' }}>
      <div className="sidebar-header" style={{ flex: '0 0 auto' }}>
        <MainTitle version={version} />
        <Filters filterState={filterState} setFilterState={setFilterState} />
      </div>
      <div className="main-content" style={{ flex: 1, marginLeft: '32px', marginRight: '0px', marginTop: '32px', marginBottom: '32px' }}>
        <SearchBar value={search} onChange={setSearch} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', marginLeft: '100px' }}>
          <div className="sort-bar-container" style={{ flex: '0 0 auto' }}>
            <SortBar value={sort} onChange={setSort} />
          </div>
          <div className="item-count-container" style={{ flex: 1 }}>
            <span className="item-count-under-search">
              {`Showing ${
                sortedItems.length === 0
                  ? spectralItems.length
                  : sortedItems.length
              } ${
                (sortedItems.length === 1 || (sortedItems.length === 0 && spectralItems.length === 1))
                  ? 'item'
                  : 'items'
              }`}
            </span>
          </div>
        </div>
        {loading ? (
          <p className="loading-text">Loading items...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <ItemGrid
              items={sortedItems.length === 0 ? spectralItems : sortedItems}
              version={version}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            {filteredItems.length === 0 && (
              <div style={{ height: '300px' }}></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
