// main entry point for the application
import { fetchHubData } from './api';
import { renderHeader, renderList, renderError } from './render';
import { createModal } from './modal';

const headElement = document.getElementById('head') as HTMLElement;
const listElement = document.getElementById('list') as HTMLElement;

async function initializeApp() {
  try {
    const data = await fetchHubData();
    const collections = data.components;
    const artwork = data.artwork;
    renderHeader(headElement, data.name, artwork['detail.horizontal.hero'].path);
    renderList(listElement, collections);
  } catch (error) {
    renderError(listElement, new Error(`Error fetching hub data: ${error}`));
  }
}

initializeApp();
createModal();
