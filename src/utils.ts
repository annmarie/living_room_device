/**
 * Focuses a specific tile on the page.
 *
 * @param index - The index of the tile to focus.
 */
export function focusTile(index: number) {
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

/**
 * Finds the index of the next tile with the class 'first-row-tile' in a list of tiles.
 *
 * @param tiles - A NodeList or array of HTML elements representing the tiles.
 * @param currentIndex - The current index from which to start the search.
 * @returns The index of the next tile with the class 'first-row-tile'.
 */
export function getNextFirstRowTileIndex(tiles: NodeListOf<Element> | HTMLElement[], currentIndex: number) {
  const nextFirstRowTile = Array.from(tiles).slice(currentIndex + 1)
      .find(tile => tile.classList.contains('first-row-tile')) ||
      Array.from(tiles).find(tile => tile.classList.contains('first-row-tile'));

  return nextFirstRowTile ? Array.from(tiles).indexOf(nextFirstRowTile) : currentIndex;
}

/**
 * Finds the index of the previous tile with the class 'first-row-tile' in a list of tiles.
 *
 * @param tiles - A NodeList or array of HTML elements representing the tiles.
 * @param currentIndex - The current index from which to start the search.
 * @returns The index of the previous tile with the class 'first-row-tile'.
 */
export function getPreviousFirstRowTileIndex(tiles: NodeListOf<Element> | HTMLElement[], currentIndex: number) {
  const previousFirstRowTile = Array.from(tiles).slice(0, currentIndex).reverse()
      .find(tile => tile.classList.contains('first-row-tile')) ||
      Array.from(tiles).reverse().find(tile => tile.classList.contains('first-row-tile'));

  return previousFirstRowTile ? Array.from(tiles).indexOf(previousFirstRowTile) : currentIndex;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID "${id}" not found.`);
  }
  return element;
}

export function setTextContent(element: HTMLElement, text: string) {
  element.textContent = text;
}

export function setInnerHTML(element: HTMLElement, html: string) {
  element.innerHTML = html;
}

export function determineActionPath(actionText: string): string {
  const lowerCaseActionText = actionText.toLowerCase();
  if (lowerCaseActionText.includes('watch')) return '/watch';
  if (lowerCaseActionText.includes('browse')) return '/browse';
  return '';
}

export function createActionLink(actionPath: string, itemId: string, text?: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `${actionPath}?id=${itemId}`;
  if (text) link.textContent = text;
  return link;
}

export function createImageModalElement(path: string, altText: string): HTMLImageElement {
  const img = document.createElement('img');
  img.src = `${path}&size=200x300&format=jpeg`;
  img.alt = altText;
  return img;
}
