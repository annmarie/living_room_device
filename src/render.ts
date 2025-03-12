import { Collection, Item } from './interfaces';
import { fetchCollectionData } from './api';
import { showModal } from './modal';

export function renderHeader(headElement: HTMLElement, title: string, heroImagePath: string) {
  headElement.innerHTML = `
  <div class="header-container">
    <h1>${title}</h1>
    <img class="hero-image" src="${heroImagePath}&size=400x200&format=jpeg">
  </div>
`;
}

export async function renderList(appElement: HTMLElement, collections: Collection[]) {
  appElement.innerHTML = '';
  let focusedIndex: number = 0;

  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const collectionId = entry.target.getAttribute('data-collection-id');
        if (collectionId) {
          const collection = collections.find(c => c.id === collectionId);
          if (collection && collection.items.length === 0) {
            collection.items = await fetchCollectionData(collectionId);
            renderCollectionItems(entry.target as HTMLElement, collection.items);
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
    appElement.appendChild(collectionDiv);

    if (collection.items.length === 0) {
      collection.items = await fetchCollectionData(collection.id);
    }

    for (const item of collection.items) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const imgElement = document.createElement('img');
      imgElement.src = `${item.visuals.artwork.horizontal_tile.image.path}&size=200x200&format=jpeg`;
      imgElement.alt = item.visuals.artwork.horizontal_tile.image.text;
      imgElement.width = 180;
      imgElement.height = 180;

      tile.appendChild(imgElement);
      const { headline, subtitle } = item.visuals;
      tile.innerHTML += `<p>${headline && headline} ${subtitle ? subtitle : ''}</p>`;
      tile.tabIndex = 0;
      tile.addEventListener('click', () => showModal(item));
      tilesContainer.appendChild(tile);
    }

    collectionDiv.appendChild(tilesContainer);
    appElement.appendChild(collectionDiv);

    observer.observe(collectionDiv);
  }

  focusTile(focusedIndex);

  const imgElements = document.querySelectorAll('.tile img');
  imgElements.forEach(img => {
    const imgElement = img as HTMLImageElement;
    imgElement.onerror = function () {
      if (this.parentElement) {
        this.parentElement.style.display = 'none';
      }
    };
  });

  document.addEventListener('keydown', (event) => {
    const tiles = document.querySelectorAll('.tile');
    // trying to get the up and down arrow keys to work
    //const tilesPerRow = Math.floor(window.innerWidth / 200);
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
      const selectedTile = tiles[focusedIndex] as HTMLElement;
      selectedTile.click();
    } else if (event.ctrlKey && event.key === 'h') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    focusTile(focusedIndex);
  });
}

export function renderCollectionItems(container: HTMLElement, items: Item[]) {
  const tilesContainer = container.querySelector('.tiles-container') as HTMLElement;

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
    tile.innerHTML += `<p>${headline && headline} ${subtitle ? subtitle : ''}</p>`;
    tile.tabIndex = 0;
    tile.addEventListener('click', () => {
      focusTile(items.indexOf(item));
      showModal(item)
    });
    tilesContainer.appendChild(tile);
  }
}

export async function focusTile(index: number) {
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

    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export function renderError(appElement: HTMLElement, error: Error) {
  appElement.innerHTML = `<h1>Error fetching hub data</h1><p>${error.message}</p>`;
}
