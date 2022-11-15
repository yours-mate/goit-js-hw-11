import * as fetchImages from './js/fetchImages';
import Markup from './markup/markup.hbs';

const refs = {
  form: document.querySelector('#search-form'),
  inputField: document.querySelector('input[name="searchQuery"]'),
  button: document.querySelector('button'),
  imagesList: document.querySelector('.result-list'),
};

refs.form.addEventListener('submit', renderMarkup);

async function renderMarkup(evt) {
  evt.preventDefault();
  const searchList = await fetchImages.getPhotos(refs.inputField.value);
  const markupList = await Markup(searchList);
  refs.imagesList.insertAdjacentHTML('beforeend', markupList);
}
