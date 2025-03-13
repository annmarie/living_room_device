import { Collection, Item } from './interfaces';
import { fetchCollectionData } from './api';
import { showModal, closeModal } from './modal';

let isModalOpen = false;

export function renderHeader(headElement: HTMLElement, title: string, heroImagePath: string) {
  headElement.innerHTML = `
  <div class="header-container">
    <h1>${title}</h1>
    <img class="hero-image" src="${heroImagePath}&size=400x200&format=jpeg">
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
    collectionDiv.className = 'collection';
    collectionDiv.setAttribute('data-collection-id', collection.id);
    collectionDiv.innerHTML = `<h2>${collection.name}</h2>`;

    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'tiles-container';
    collectionDiv.appendChild(tilesContainer);
    mainElement.appendChild(collectionDiv);

    addTilesToContainer(collection.items, tilesContainer);

    collectionDiv.appendChild(tilesContainer);
    mainElement.appendChild(collectionDiv);

    observer.observe(collectionDiv);
  }

  focusTile(focusedIndex);

  document.addEventListener('keydown', (event) => {
    const tiles = document.querySelectorAll('.tile');
    // trying to get the up and down arrow keys to work
    //const tilesPerRow = Math.floor(window.innerWidth / 290);
    // For now the up and down arrow keys work like right and left arrow keys
    const tilesPerRow = 1;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusedIndex = (focusedIndex + 1) % tiles.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusedIndex = (focusedIndex - 1 + tiles.length) % tiles.length;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusedIndex = (focusedIndex + tilesPerRow) % tiles.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusedIndex = (focusedIndex - tilesPerRow + tiles.length) % tiles.length;
    } else if (event.key === ' ') {
      event.preventDefault();
      const selectedTile = tiles[focusedIndex] as HTMLElement;
      selectedTile.click();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (isModalOpen) {
        closeModal();
        isModalOpen = false;
      } else {
        const selectedTile = tiles[focusedIndex] as HTMLElement;
        selectedTile.click();
        isModalOpen = true;
      }
    } else if (event.ctrlKey && event.key === 'h') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        focusedIndex = (focusedIndex - 1 + tiles.length) % tiles.length;
      } else {
        focusedIndex = (focusedIndex + 1) % tiles.length;
      }
    }

    focusTile(focusedIndex);
  });
}

function addTilesToContainer(items: Item[], tilesContainer: HTMLDivElement) {
  for (const item of items) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    const imgElement = document.createElement('img');
    imgElement.src = `${item.visuals.artwork.horizontal_tile.image.path}&size=200x200&format=jpeg`;
    imgElement.alt = item.visuals.artwork.horizontal_tile.image.text;
    imgElement.width = 180;
    imgElement.height = 180;
    tile.appendChild(imgElement);

    const { headline, subtitle } = item.visuals;
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `${headline && headline} ${subtitle || ''}`;
    tile.appendChild(paragraph);

    tile.tabIndex = 0;
    tile.addEventListener('click', () => {
      showModal(item);
      isModalOpen = true;
    });

    tilesContainer.appendChild(tile);
  }
}

async function focusTile(index: number) {
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile, i) => {
    tile.classList.toggle('focused', i === index);
  });

  if (index >= 0 && index < tiles.length) {
    (tiles[index] as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
}

export function renderError(mainElement: HTMLElement, error: Error) {
  mainElement.innerHTML = `<h1>Error fetching hub data</h1><p>${error.message}</p>`;
}
