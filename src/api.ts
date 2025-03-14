import { HubData, Item } from './interfaces';

const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchHubData(): Promise<HubData> {
  const cacheKey = 'hubData' as string;
  const cachedData = localStorage.getItem(cacheKey) as string;
  const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`) as string;

  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp, 10) as number;
    if (age < CACHE_DURATION) {
      return JSON.parse(cachedData);
    }
  }

  const response = await fetch(import.meta.env.VITE_HUB_URL);
  const data = await response.json();
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
  return data;
}

export async function fetchCollectionData(id: string): Promise<Item[]> {
  const cacheKey = `collectionData_${id}` as string;
  const cachedData = localStorage.getItem(cacheKey) as string;
  const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`) as string;

  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp, 10) as number;
    if (age < CACHE_DURATION) {
      return JSON.parse(cachedData);
    }
  }

  const response = await fetch(`${import.meta.env.VITE_ITEM_URL}/${id}.json`);
  const data = await response.json() as { items: Item[] };
  localStorage.setItem(cacheKey, JSON.stringify(data.items));
  localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
  return data.items;
}
