import { fetchHubData } from './api';
import { renderHeader, renderList, renderError } from './render';
import { createModal } from './modal';

const headElement = document.getElementById('head') as HTMLElement;
const mainElement = document.getElementById('main') as HTMLElement;

const urlPath = window.location.pathname.replace(/^\/|\/$/g, '') as string;
if (['watch', 'browse'].includes(urlPath)) {
  mainElement.innerHTML = `This is the ${urlPath} page. Currently under construction.<br /><a href="/">Go back to List</a>`;
} else {
  renderListPage();
}

function renderListPage() {
  async function initializeApp() {
    try {
      const data = await fetchHubData();
      const collections = data.components;
      const artwork = data.artwork;
      renderHeader(headElement, data.name, artwork['detail.horizontal.hero'].path);
      renderList(mainElement, collections);
    } catch (error) {
      renderError(mainElement, new Error(`Error fetching hub data: ${error}`));
    }
  }

  initializeApp();
  createModal();
}
