import { Item } from './interfaces';

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
  const modal = document.getElementById('modal') as HTMLElement;
  const titleElement = document.getElementById('modal-title') as HTMLElement;
  const subtitleElement = document.getElementById('modal-subtitle') as HTMLElement;
  const imgContainerElement = document.getElementById('modal-image-container') as HTMLImageElement;
  const bodyElement = document.getElementById('modal-body') as HTMLElement;
  const actionTextElement = document.getElementById('modal-action-text') as HTMLElement;
  const genreNamesElement = document.getElementById('modal-genre-names') as HTMLElement;

  const { headline, subtitle, body, action_text, artwork } = item.visuals;
  const { genre_names } = item.entity_metadata;

  titleElement.textContent = headline;
  genreNamesElement.textContent = genre_names.join(', ');

  const actionPath = action_text.toLowerCase().includes('watch') ? '/watch'
    : action_text.toLowerCase().includes('browse') ? '/browse' : '';

  const { text, path } = artwork.vertical_tile.image;
  if (actionPath) {
    const actionHrefElement = document.createElement('a');
    actionHrefElement.href = actionPath + '?id=' + item.id;

    if (path) {
      const imgElement = document.createElement('img');
      imgElement.src = `${path}&size=200x300&format=jpeg`;
      imgElement.alt = text;
      actionHrefElement.appendChild(imgElement);
      imgContainerElement.innerHTML = actionHrefElement.outerHTML;
    }

    actionHrefElement.textContent = subtitle;
    subtitleElement.innerHTML = actionHrefElement.outerHTML;

    actionHrefElement.textContent = action_text;
    actionTextElement.innerHTML = actionHrefElement.outerHTML;
  } else {
    subtitleElement.textContent = subtitle;
    if (path) {
      const imgElement = document.createElement('img');
      imgElement.src = `${path}&size=200x300&format=jpeg`;
      imgElement.alt = text;
      imgContainerElement.innerHTML = imgElement.outerHTML;
    }
  }

  bodyElement.textContent = body;
  modal.classList.remove('hidden');
}
