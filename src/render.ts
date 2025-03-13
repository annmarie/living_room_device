import { Artwork, Collection, Item } from './interfaces';
import { fetchCollectionData } from './api';
import { showModal, closeModal } from './modal';

let isModalOpen: boolean = false;
let collectionsRowCount: number = 0;

export function renderHeader(headElement: HTMLElement, title: string, artwork: Artwork) {
  const { path, accent } = artwork;
  headElement.innerHTML = `
    <div class="header">
      <div class="header-hero" style="background-image: url('${path}&size=400x200&format=jpeg');"></div>
      <div class="header-color" style="background-color: hsl(${accent.hue} 100% 50%)"></div>
      <h1 class="header-title">${title}</h1>
    </div>
  `;
}

export async function renderList(mainElement: HTMLElement, collections: Collection[]) {
  mainElement.innerHTML = '';
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
    collectionTitle.textContent = collection.name;
    collectionDiv.appendChild(collectionTitle);

    const tilesContainer = document.createElement('div');
    tilesContainer.classList.add('tiles-container');
    collectionDiv.appendChild(tilesContainer);
    mainElement.appendChild(collectionDiv);

    addTilesToContainer(collection.items, tilesContainer);

    observer.observe(collectionDiv);
  }

  focusTile(focusedIndex);

  document.addEventListener('keydown', (event) => {
    const tiles = document.querySelectorAll('.tile');

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusedIndex = (focusedIndex + 1) % tiles.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusedIndex = (focusedIndex - 1 + tiles.length) % tiles.length;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextFirstRowTile = Array.from(tiles).slice(focusedIndex + 1).find(tile => tile.classList.contains('first-row-tile'));
      if (nextFirstRowTile) {
        focusedIndex = Array.from(tiles).indexOf(nextFirstRowTile);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previousFirstRowTile = Array.from(tiles).slice(0, focusedIndex).reverse().find(tile => tile.classList.contains('first-row-tile'));
      if (previousFirstRowTile) {
        focusedIndex = Array.from(tiles).indexOf(previousFirstRowTile);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (isModalOpen) {
        closeModal();
        isModalOpen = false;
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isModalOpen) {
        closeModal();
        isModalOpen = false;
      } else {
        const selectedTile = tiles[focusedIndex] as HTMLElement;
        selectedTile.click();
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        focusedIndex = (focusedIndex - 1 + tiles.length) % tiles.length;
      } else {
        focusedIndex = (focusedIndex + 1) % tiles.length;
      }
    } else if (event.key === 'h') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      focusedIndex = 0;
    } else if (event.key === 'l') {
      event.preventDefault();
      focusedIndex = tiles.length - 1;
    }

    focusTile(focusedIndex);
  });
}

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
    imgElement.src = `${item.visuals.artwork.horizontal_tile.image.path}&size=400x224&format=jpeg`;
    imgElement.alt = item.visuals.artwork.horizontal_tile.image.text;
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
    textHeadline.textContent = headline;
    textSubtitle.textContent = subtitle;
    textContainer.appendChild(textHeadline);
    if (subtitle) textContainer.appendChild(textSubtitle);
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

function focusTile(index: number) {
  const tiles = document.querySelectorAll('.tile');

  tiles.forEach((tile, i) => {
    tile.classList.toggle('focused', i === index);
  });

  if (index >= 0 && index < tiles.length) {
    const tile = tiles[index] as HTMLElement;
    const tileRect = tile.getBoundingClientRect();
    const absoluteElementTop = tileRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (tileRect.height / 2);

    window.scrollTo({
      top: middle,
      behavior: 'smooth',
    });

    tile.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

export function renderError(mainElement: HTMLElement, error: Error) {
  mainElement.innerHTML = `<h1>Error fetching hub data</h1><p>${error.message}</p>`;
}
