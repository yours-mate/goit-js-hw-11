import Notiflix from 'notiflix';
import * as fetchImages from './js/fetchImages';
import Markup from './markup/markup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import debounce from 'lodash.debounce';

// const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('#search-form'),
  inputField: document.querySelector('input[name="searchQuery"]'),
  formBtn: document.querySelector('.form-btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox;

refs.form.addEventListener('submit', renderMarkup);

function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function renderMarkup(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  fetchImages.searchOptions.params.page = 1;
  const searchList = await fetchImages.getPhotos(refs.inputField.value);
  const markupList = await Markup(searchList);
  refs.gallery.insertAdjacentHTML('beforeend', markupList);
  smoothScroll();
  Notiflix.Notify.success(
    `Hooray! We found ${fetchImages.response.data.totalHits} images`
  );
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  if (searchList.length !== 0) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnRender);

async function onLoadMoreBtnRender() {
  fetchImages.searchOptions.params.page += 1;
  const searchList = await fetchImages.getPhotos(refs.inputField.value);
  const markupList = await Markup(searchList);
  refs.gallery.insertAdjacentHTML('beforeend', markupList);
  smoothScroll();
  lightbox.destroy();
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// refs.formBtn.disabled = true;

// refs.inputField.addEventListener(
//   'input',
//   debounce(onInputHandle, DEBOUNCE_DELAY)
// );

// function onInputHandle() {
//   if (refs.inputField.value.trim() !== '') {
//     refs.formBtn.disabled = false;
//   }
// }
