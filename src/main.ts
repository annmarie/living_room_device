import { fetchHubData } from './api';
import { renderHeader, renderListPage, renderError, renderActionPage } from './render';
import { createModal } from './modal';

// render the appropriate page based on the URL path
const urlPath = window.location.pathname.replace(/^\/|\/$/g, '') as string;
(['watch', 'browse'].includes(urlPath)) ? actionPage(urlPath) : listPage();

// page elements
const headElement = document.getElementById('head') as HTMLElement;
const mainElement = document.getElementById('main') as HTMLElement;

// action pages
async function actionPage(page: string) {
  try {
    const data = await fetchHubData();
    const artwork = data.artwork;
    renderHeader(headElement, data.name, artwork['detail.horizontal.hero']);
    renderActionPage(mainElement, page);
  } catch (error) {
    renderError(mainElement, new Error(`Error fetching hub data: ${error}`));
  }
}

// list page
async function listPage() {
  try {
    const data = await fetchHubData();
    const collections = data.components;
    const artwork = data.artwork;
    renderHeader(headElement, data.name, artwork['detail.horizontal.hero']);
    renderListPage(mainElement, collections);
  } catch (error) {
    renderError(mainElement, new Error(`Error fetching hub data: ${error}`));
  }
  createModal();
}
