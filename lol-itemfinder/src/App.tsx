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
import ItemCount from './components/ItemCount';

function App() {
  useEffect(() => {
    document.title = 'League of Legends - Item Finder';
  }, []);
  // Filters state - set default enabled filters
  const [filterState, setFilterState] = useState<FilterState>({
    purchasableInclude: [],
    // purchasableInclude: ['yes'], // => this will be enabled by default
    purchasableExclude: [],
    mapInclude: [],
    // mapInclude: ['11'],
    mapExclude: [],
    // mapExclude: ['12'],
    type: [],
    excludeType: [], 
    // excludeType: ['Champion-Specific'],
    stat: [''],
    excludeStat: [],
    class: [],
    excludeClass: [],
    gameModeInclude: [],
    gameModeExclude: [],
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
    <div className="app-main-parent-container" style={{ 
      display: 'flex', 
      // width: '100%', 
      width: 'auto', 
      minWidth: '1905px',
      maxWidth: '1905px',
      position: 'relative',
      // border: '5px solid #ff0000' 
      }}>
        <MainTitle version={version} />
      {/* HERE CONTAINER */}
      {/* Sidebar: MainTitle + Filters */}
      <div className="sidebar-header" style={{ 
        flex: '0 0 auto', 
        // border: '5px solid rgb(11, 134, 7)'
        }}>
          {/* HERE CONTAINER */}
        {/* <MainTitle version={version} /> */}
        <Filters filterState={filterState} setFilterState={setFilterState} />
      </div>
      {/* Main content: SearchBar + SortBar + ItemGrid */}
      <div className="main-content" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', // stack children vertically
        // alignItems: 'center',    // center horizontally
        justifyContent: 'flex-start',
        marginLeft: '32px', 
        marginRight: '0px', 
        marginTop: '32px', 
        marginBottom: '32px',
        // minWidth: '400px',
        minWidth: '1500px',
        maxWidth: '1600px',
        // border: '5px solid rgb(255, 0, 242)'
        }}>
          {/* HERE CONTAINER */}
        {/* <SearchBar value={search} onChange={setSearch} /> */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', // centers horizontally
          alignItems: 'center', // centers vertically
          width: '100%',
          // marginBottom: '24px'
        }}>
        <SearchBar value={search} onChange={setSearch}/>
        </div>
        <div className="sortbar-and-itemcount-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          // justifyContent: 'flex-start',
          flexDirection: 'row', // stack children horizontally
          // marginLeft: '10px',
          marginBottom: '5px', 
          marginLeft: '35px', 
          // width: '100%',
          // border: '4px solid rgb(68, 192, 214)' 
          }}>
            {/* HERE CONTAINER */}
          {/* <div className="sort-bar-container" style={{ flex: '0 0 auto' }}> */}
          <div className="sort-bar-container" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            // width: '100%',
            flex: '0 0 auto', // Do not stretch, stay left
            // margin: '12px 0'
            }}>
          {/* <div className="sort-bar-container" style={{ flex: '0 0 auto', border: '3px solid #f0c674' }}> */}
            <SortBar value={sort} onChange={setSort} />
          </div>
          {/* <div className="item-count-container" style={{ flex: 1, border: '3px solid #f0c674' }}> */}
          <div className="item-count-container" style={{
            display: 'flex',
            justifyContent: 'center',
            // justifyContent: 'flex-end',
            alignItems: 'center',
            // marginLeft: '-245px', 
            marginRight: '245px', 
            // width: '100%',
            flex: 1, // Take remaining space and center
            // margin: '12px 0'
            }}>
            <ItemCount
              count={
                sortedItems.length === 0
                  ? spectralItems.length
                  : sortedItems.length
              }
            />
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
