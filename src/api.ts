import { HubData, Item } from './interfaces';

export async function fetchHubData(): Promise<HubData> {
  const response = await fetch(import.meta.env.VITE_HUB_URL);
  return await response.json();
}

export async function fetchCollectionData(id: string): Promise<Item[]> {
  const response = await fetch(`${import.meta.env.VITE_ITEM_URL}/${id}.json`);
  const data = await response.json();
  return data.items;
}
