import { fetchHubData } from './api';
import { renderHeader, renderList, renderError } from './render';
import { createModal } from './modal';

const headElement = document.getElementById('head') as HTMLElement;
const mainElement = document.getElementById('main') as HTMLElement;

const urlPath = window.location.pathname.replace(/^\/|\/$/g, '') as string;
(['watch', 'browse'].includes(urlPath)) ? actionPage(urlPath) : listPage();

async function actionPage(page: string) {
  try {
    const data = await fetchHubData();
    const artwork = data.artwork;
    renderHeader(headElement, data.name, artwork['detail.horizontal.hero']);
    mainElement.innerHTML = `<div class="action-message">This is the ${page} page. Currently under construction. <a href="/">Go back to List</a></div>`;
  } catch (error) {
    renderError(mainElement, new Error(`Error fetching hub data: ${error}`));
  }
}

async function listPage() {
  try {
    const data = await fetchHubData();
    const collections = data.components;
    const artwork = data.artwork;
    renderHeader(headElement, data.name, artwork['detail.horizontal.hero']);
    renderList(mainElement, collections);
  } catch (error) {
    renderError(mainElement, new Error(`Error fetching hub data: ${error}`));
  }
  createModal();
}
