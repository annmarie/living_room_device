import { HubData, Item } from './interfaces';

const CACHE_DURATION = 5 * 60 * 1000;

async function fetchData<T>(url: string, cacheKey: string, parseData: CallableFunction): Promise<T> {
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp, 10);
    if (age < CACHE_DURATION) {
      return JSON.parse(cachedData);
    }
  }

  const response = await fetch(url);
  const data = await response.json();
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
  return parseData(data);
}

export async function fetchHubData(): Promise<HubData> {
  const url = import.meta.env.VITE_HUB_URL;
  const parseData = (data: HubData[]) => data;
  return fetchData<HubData>(url, 'hubData', parseData);
}

export async function fetchCollectionData(id: string): Promise<Item[]> {
  const url = `${import.meta.env.VITE_ITEM_URL}/${id}.json`;
  const parseData = (data: { items: Item[]; }) => data.items;
  return fetchData<Item[]>(url, `collectionData_${id}`, parseData);
}
