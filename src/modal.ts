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

  modalContent.appendChild(closeButton);
  modalContent.appendChild(titleElement);
  modalContent.appendChild(subtitleElement);
  modalContent.appendChild(bodyElement);
  modalContent.appendChild(imageElement);
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

export function showModal(item: Item) {
  const modal = document.getElementById('modal') as HTMLElement;
  const titleElement = document.getElementById('modal-title') as HTMLElement;
  const subtitleElement = document.getElementById('modal-subtitle') as HTMLElement;
  const imageElement = document.getElementById('modal-image') as HTMLImageElement;
  const bodyElement = document.getElementById('modal-body') as HTMLElement;

  titleElement.textContent = item.visuals.headline;
  subtitleElement.textContent = item.visuals.subtitle;

  const verticalImagePath = item.visuals.artwork.vertical_tile.image.path;
  if (verticalImagePath) {
    imageElement.src = `${verticalImagePath}&size=200x300&format=jpeg`;
  } else {
    imageElement.style.display = 'none';
  }

  bodyElement.textContent = item.visuals.body;

  modal.style.display = 'block';
}
