import { Item } from './interfaces';
import { createActionLink, createImageModalElement, determineActionPath, getElementById, setInnerHTML, setTextContent } from './utils';

export function createModal() {
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.classList.add('modal', 'hidden');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const titleElement = document.createElement('h2');
  titleElement.id = 'modal-title';

  const subtitleElement = document.createElement('p');
  subtitleElement.id = 'modal-subtitle';

  const imgContainerElement = document.createElement('p');
  imgContainerElement.id = 'modal-image-container';

  const bodyElement = document.createElement('p');
  bodyElement.id = 'modal-body';

  const actionTextElement = document.createElement('p');
  actionTextElement.id = 'modal-action-text';

  const genreNamesElement = document.createElement('p');
  genreNamesElement.id = 'modal-genre-names';

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('modal-content-container');
  const leftColumn = document.createElement('div');
  const rightColumn = document.createElement('div');

  leftColumn.appendChild(imgContainerElement);
  rightColumn.appendChild(titleElement);
  rightColumn.appendChild(subtitleElement);
  rightColumn.appendChild(bodyElement);

  contentContainer.appendChild(leftColumn);
  contentContainer.appendChild(rightColumn);

  modalContent.appendChild(contentContainer);
  modalContent.appendChild(actionTextElement);
  modalContent.appendChild(genreNamesElement);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  };
}

export function closeModal() {
  const modal = document.getElementById('modal') as HTMLElement;
  modal.classList.add('hidden');
}

export function showModal(item: Item) {
  const modal = getElementById('modal');
  const titleElement = getElementById('modal-title');
  const subtitleElement = getElementById('modal-subtitle');
  const imgContainerElement = getElementById('modal-image-container') as HTMLImageElement;
  const bodyElement = getElementById('modal-body');
  const actionTextElement = getElementById('modal-action-text');
  const genreNamesElement = getElementById('modal-genre-names');

  const { headline, subtitle, body, action_text, artwork } = item.visuals;
  const { genre_names } = item.entity_metadata;

  setTextContent(titleElement, headline);
  setTextContent(genreNamesElement, genre_names.join(', '));
  setTextContent(bodyElement, body);

  const actionPath = determineActionPath(action_text);
  const { text, path } = artwork.vertical_tile.image;

  if (actionPath) {
    const actionHrefElement = createActionLink(actionPath, item.id);

    if (path) {
      const imgElement = createImageModalElement(path, text);
      actionHrefElement.appendChild(imgElement);
      setInnerHTML(imgContainerElement, actionHrefElement.outerHTML);
    }

    setInnerHTML(subtitleElement, createActionLink(actionPath, item.id, subtitle).outerHTML);
    setInnerHTML(actionTextElement, createActionLink(actionPath, item.id, action_text).outerHTML);
  } else {
    setTextContent(subtitleElement, subtitle);
    if (path) {
      const imgElement = createImageModalElement(path, text);
      setInnerHTML(imgContainerElement, imgElement.outerHTML);
    }
  }

  modal.classList.remove('hidden');
}
