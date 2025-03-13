import { Item } from './interfaces';

export function createModal() {
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.className = 'modal';
  modal.style.display = 'none';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '&times;';

  const titleElement = document.createElement('h2');
  titleElement.id = 'modal-title';

  const subtitleElement = document.createElement('p');
  subtitleElement.id = 'modal-subtitle';

  const imageElement = document.createElement('img');
  imageElement.id = 'modal-image';

  const bodyElement = document.createElement('p');
  bodyElement.id = 'modal-body';

  const actionTextElement = document.createElement('p');
  actionTextElement.id = 'modal-action-text';

  const genreNamesElement = document.createElement('p');
  genreNamesElement.id = 'modal-genre-names';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(titleElement);
  modalContent.appendChild(subtitleElement);
  modalContent.appendChild(bodyElement);
  modalContent.appendChild(imageElement);
  modalContent.appendChild(actionTextElement);
  modalContent.appendChild(genreNamesElement);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  closeButton.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

export function closeModal() {
  const modal = document.getElementById('modal') as HTMLElement;
  modal.style.display = 'none';
}

export function showModal(item: Item) {
  const modal = document.getElementById('modal') as HTMLElement;
  const titleElement = document.getElementById('modal-title') as HTMLElement;
  const subtitleElement = document.getElementById('modal-subtitle') as HTMLElement;
  const imageElement = document.getElementById('modal-image') as HTMLImageElement;
  const bodyElement = document.getElementById('modal-body') as HTMLElement;
  const actionTextElement = document.getElementById('modal-action-text') as HTMLElement;
  const genreNamesElement = document.getElementById('modal-genre-names') as HTMLElement;

  const { headline, subtitle, body, action_text, artwork } = item.visuals;
  const { genre_names } = item.entity_metadata;

  titleElement.textContent = headline;
  subtitleElement.textContent = subtitle;
  genreNamesElement.textContent = genre_names.join(', ');

  const actionPath = action_text.toLowerCase().includes('watch') ? '/watch'
    : action_text.toLowerCase().includes('browse') ? '/browse' : '';

  if (actionPath) {
    const actionHrefElement = document.createElement('a');
    actionHrefElement.href = actionPath + '?id=' + item.id;
    actionHrefElement.textContent = action_text;
    actionTextElement.innerHTML = actionHrefElement.outerHTML;
  }

  const { text, path } = artwork.vertical_tile.image;
  if (path) {
    imageElement.src = `${path}&size=200x300&format=jpeg`;
    imageElement.alt = text;
  } else {
    imageElement.style.display = 'none';
  }

  bodyElement.textContent = body;

  modal.style.display = 'block';
}
