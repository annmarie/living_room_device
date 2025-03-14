import { Item } from './interfaces';
import { createActionLink, createImageModalElement, determineActionPath, setInnerHTML, setTextContent } from './utils';

export function createModal() {
  const modal = document.createElement('div') as HTMLDivElement;
  modal.id = 'modal';
  modal.classList.add('modal', 'hidden');

  const modalContent = document.createElement('div') as HTMLDivElement;
  modalContent.classList.add('modal-content');

  const titleElement = document.createElement('h2') as HTMLHeadingElement;
  titleElement.id = 'modal-title';

  const subtitleElement = document.createElement('p') as HTMLParagraphElement;
  subtitleElement.id = 'modal-subtitle';

  const imgContainerElement = document.createElement('p') as HTMLImageElement;
  imgContainerElement.id = 'modal-image-container';

  const bodyElement = document.createElement('p') as HTMLParagraphElement;
  bodyElement.id = 'modal-body';

  const actionTextElement = document.createElement('p') as HTMLParagraphElement;
  actionTextElement.id = 'modal-action-text';

  const genreNamesElement = document.createElement('p') as HTMLParagraphElement;
  genreNamesElement.id = 'modal-genre-names';

  const contentContainer = document.createElement('div') as HTMLDivElement;
  contentContainer.classList.add('modal-content-container');
  const leftColumn = document.createElement('div') as HTMLDivElement;
  const rightColumn = document.createElement('div') as HTMLDivElement;

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
  const modal = document.getElementById('modal') as HTMLElement;
  const titleElement = document.getElementById('modal-title') as HTMLHeadingElement;
  const subtitleElement = document.getElementById('modal-subtitle') as HTMLParagraphElement;
  const imgContainerElement = document.getElementById('modal-image-container') as HTMLImageElement;
  const bodyElement = document.getElementById('modal-body') as HTMLParagraphElement;
  const actionTextElement = document.getElementById('modal-action-text') as HTMLParagraphElement;
  const genreNamesElement = document.getElementById('modal-genre-names') as HTMLParagraphElement;

  const { headline, subtitle, body, action_text, artwork } = item.visuals;
  const { genre_names } = item.entity_metadata;

  setTextContent(titleElement, headline);
  setTextContent(genreNamesElement, genre_names.join(', '));
  setTextContent(bodyElement, body);

  const actionPath = determineActionPath(action_text);
  const { path } = artwork.vertical_tile.image;

  if (actionPath) {
    const actionHrefElement = createActionLink(actionPath, item.id);

    if (path) {
      const imgElement = createImageModalElement(path);
      actionHrefElement.appendChild(imgElement);
      setInnerHTML(imgContainerElement, actionHrefElement.outerHTML);
    }

    setInnerHTML(subtitleElement, createActionLink(actionPath, item.id, subtitle).outerHTML);
    setInnerHTML(actionTextElement, createActionLink(actionPath, item.id, action_text).outerHTML);
  } else {
    setTextContent(subtitleElement, subtitle);
    if (path) {
      const imgElement = createImageModalElement(path) as HTMLImageElement;
      setInnerHTML(imgContainerElement, imgElement.outerHTML);
    }
  }

  modal.classList.remove('hidden');
}
