import type { Item } from '../types/item';


export async function fetchLatestVersion(region: string = 'eune'): Promise<string> {
  try {
    const res = await fetch(`https://ddragon.leagueoflegends.com/realms/${region}.json`);
    if (!res.ok) throw new Error('Failed to fetch version');
    const data = await res.json();
    return data.v;
  } catch (error) {
    console.error('Error fetching latest version:', error);
    throw error;
  }
}


export async function fetchItems(version: string): Promise<Record<string, Item>> {
  try {
    const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
    if (!res.ok) throw new Error('Failed to fetch items');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}
