import Notiflix from 'notiflix';
import * as fetchImages from './js/fetchImages';
import Markup from './markup/markup.hbs';
import simpleLightbox from './js/lightbox';

const refs = {
  form: document.querySelector('#search-form'),
  inputField: document.querySelector('input[name="searchQuery"]'),
  formBtn: document.querySelector('.form-btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', renderMarkup);

// Smooth scroll function
function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: window.screen.height - cardHeight,
    behavior: 'smooth',
  });
}

// Checking the search
function onSearchOptions() {
  if (fetchImages.response.data.totalHits === 0) {
    return;
  } else if (fetchImages.response.data.totalHits > 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
  }
  Notiflix.Notify.success(
    `Hooray! We found ${fetchImages.response.data.totalHits} images`
  );
}

// Markup function after search
async function renderMarkup(evt) {
  try {
    evt.preventDefault();
    refs.gallery.innerHTML = '';
    fetchImages.searchOptions.params.page = 1;
    refs.loadMoreBtn.classList.add('is-hidden');
    const searchList = await fetchImages.getPhotos(refs.inputField.value);
    const markupList = await Markup(searchList);
    refs.gallery.insertAdjacentHTML('beforeend', markupList);
    onSearchOptions();
    simpleLightbox();
  } catch {}
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnRender);

// Function to hide button Load more at the end of the search
function onCheckFurtherResults() {
  if (
    fetchImages.response.data.totalHits <
    fetchImages.searchOptions.params.page *
      fetchImages.searchOptions.params.per_page
  ) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
    return;
  }
}

// Function for loading more photos
async function onLoadMoreBtnRender() {
  try {
    fetchImages.searchOptions.params.page += 1;
    onCheckFurtherResults();
    const searchList = await fetchImages.getPhotos(refs.inputField.value);
    const markupList = await Markup(searchList);
    refs.gallery.insertAdjacentHTML('beforeend', markupList);
    smoothScroll();
    simpleLightbox().refresh();
  } catch {}
}
