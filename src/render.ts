import { Artwork, Collection, Item } from './interfaces';
import { fetchCollectionData } from './api';
import { showModal, closeModal } from './modal';
import { getNextFirstRowTileIndex, getPreviousFirstRowTileIndex, scrollToTop, setInnerHTML, setTextContent, focusTile } from './utils';

let isModalOpen: boolean = false;
let collectionsRowCount: number = 0;

/**
 * Renders the header section of the page.
 *
 * @param headElement - The HTML element where the header will be rendered.
 * @param title - The title to be displayed in the header.
 * @param artwork - The artwork object containing the path and accent color for the header background.
 */
export function renderHeader(headElement: HTMLElement, title: string, artwork: Artwork) {
  const { path, accent } = artwork;
  setInnerHTML(headElement, `
    <div class="header">
      <div class="header-hero" style="background-image: url('${path}&size=400x200&format=jpeg');"></div>
      <div class="header-color" style="background-color: hsl(${accent.hue} 100% 50%)"></div>
      <h1 class="header-title">${title}</h1>
    </div>`);
}

/**
 * Renders the action page based on the provided page name.
 *
 * @param mainElement - The HTML element where the action page will be rendered.
 * @param page - The name of the action page to be displayed.
 */
export function renderActionPage(mainElement: HTMLElement, page: string) {
  const actionMessage = document.createElement('div');
  actionMessage.className = 'action-message';
  setInnerHTML(actionMessage,
    `This is the ${page} page. Currently under construction. <a href="/">Go back to List</a>`);
  setInnerHTML(mainElement, actionMessage.outerHTML);
}

/**
 * Renders the list page with the provided collections.
 *
 * @param mainElement - The HTML element where the list page will be rendered.
 * @param collections - The collections to be displayed on the page.
 */
export async function renderListPage(mainElement: HTMLElement, collections: Collection[]) {
  setInnerHTML(mainElement, '');
  let focusedIndex: number = 0;

  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const collectionId = entry.target.getAttribute('data-collection-id');
        if (collectionId) {
          const collection = collections.find(c => c.id === collectionId);
          if (collection && collection.items.length === 0) {
            collection.items = await fetchCollectionData(collectionId);
            addTilesToContainer(collection.items, entry.target.querySelector('.tiles-container') as HTMLDivElement);
          }
        }
      }
    }
  });

  for (const collection of collections) {
    const collectionDiv = document.createElement('div');
    collectionDiv.classList.add('collection');
    collectionDiv.setAttribute('data-collection-id', collection.id);

    const collectionTitle = document.createElement('h2');
    collectionTitle.classList.add('collection-title');
    setTextContent(collectionTitle, collection.name);
    collectionDiv.appendChild(collectionTitle);

    const tilesContainer = document.createElement('div');
    tilesContainer.classList.add('tiles-container');
    collectionDiv.appendChild(tilesContainer);
    mainElement.appendChild(collectionDiv);

    addTilesToContainer(collection.items, tilesContainer);

    observer.observe(collectionDiv);
  }

  focusTile(focusedIndex);

  document.addEventListener('keydown', handleKeyDown);

  function handleKeyDown(event: { key: any; preventDefault: () => void; shiftKey: any; }) {
    const tiles = document.querySelectorAll('.tile');
    const tileCount = tiles.length;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusedIndex = (focusedIndex + 1) % tileCount;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        focusedIndex = (focusedIndex - 1 + tileCount) % tileCount;
        break;

      case 'ArrowDown':
        event.preventDefault();
        focusedIndex = getNextFirstRowTileIndex(tiles, focusedIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        focusedIndex = getPreviousFirstRowTileIndex(tiles, focusedIndex);
        break;

      case 'Escape':
        event.preventDefault();
        if (isModalOpen) {
          closeModal();
          isModalOpen = false;
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isModalOpen) {
          closeModal();
          isModalOpen = false;
        } else {
          const selectedTile = tiles[focusedIndex] as HTMLElement;
          selectedTile.click();
        }
        break;

      case 'Tab':
        event.preventDefault();
        focusedIndex = event.shiftKey
          ? (focusedIndex - 1 + tileCount) % tileCount
          : (focusedIndex + 1) % tileCount;
        break;

      case 'h':
        event.preventDefault();
        scrollToTop();
        break;

      case 'l':
        event.preventDefault();
        focusedIndex = tileCount - 1;
        break;

      default:
        return;
    }

    focusTile(focusedIndex);
  }
}

/**
 * Adds tiles to the tiles container.
 *
 * @param items - The items to be displayed as tiles.
 * @param tilesContainer - The HTML element where the tiles will be rendered.
 */
function addTilesToContainer(items: Item[], tilesContainer: HTMLDivElement) {
  for (const itemIndex in items) {
    const item = items[itemIndex];
    const tile = document.createElement('div');
    tile.classList.add('tile');

    tile.setAttribute('data-row', collectionsRowCount.toString());
    tile.setAttribute('data-column', itemIndex);

    const imgContainer = document.createElement('div');
    const imgElement = document.createElement('img');
    imgContainer.classList.add('tile-image-container');
    const { path, text } = item.visuals.artwork.horizontal_tile.image;
    imgElement.src = `${path}&size=400x224&format=jpeg`;
    imgElement.alt = text;
    imgElement.classList.add('tile-image');
    imgContainer.appendChild(imgElement);
    tile.appendChild(imgContainer);

    const { headline, subtitle } = item.visuals;
    const textContainer = document.createElement('div');
    const textHeadline = document.createElement('p');
    const textSubtitle = document.createElement('p');
    textContainer.classList.add('tile-text-container');
    textHeadline.classList.add('tile-headline');
    textSubtitle.classList.add('tile-subtitle');
    setTextContent(textHeadline, headline);
    setTextContent(textSubtitle, subtitle);
    textContainer.appendChild(textHeadline);
    if (subtitle) {
      setTextContent(textSubtitle, subtitle);
    }
    tile.appendChild(textContainer);

    tile.tabIndex = 0;
    tile.addEventListener('click', () => {
      showModal(item);
      isModalOpen = true;
    });

    if (Number(itemIndex) === items.length - 1) {
      tile.classList.add('last-row-tile');
    } else if (Number(itemIndex) === 0) {
      tile.classList.add('first-row-tile');
    }

    tilesContainer.appendChild(tile);
  }
  collectionsRowCount++;
}

/**
 * Renders an error message on the page.
 *
 * @param mainElement - The HTML element where the error message will be rendered.
 * @param error - The error that occurred.
 */
export function renderError(mainElement: HTMLElement, error: Error) {
  setInnerHTML(mainElement, `<h1>Error fetching hub data</h1><p>${error.message}</p>`);
}
