import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31291056-02b52945dcd563b074a1c7cbe';
const searchOptions = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
};

async function getPhotos(searchInput) {
  try {
    const response = await axios(`${BASE_URL}?q=${searchInput}`, searchOptions);
    let resultList = await response.data.hits;
    if (resultList.length !== 0) {
      console.log(resultList);
      return resultList;
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export { BASE_URL, API_KEY, searchOptions, getPhotos };

// fetch(
//   `${BASE_URL}?key=31291056-02b52945dcd563b074a1c7cbe&q=${refs.inputField.value}&image_type=photo&orientation=horizontal&safesearch=true`
// );