import { buildGalleryMarkup } from './js/buildGalleryMarkup';
import { fetchData, resetPage } from './js/fetchData';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let searchQuery = '';

refs.form.addEventListener('submit', onSubmitClick);
refs.btnLoadMore.addEventListener('click', onLoadMoreClick);

async function onSubmitClick(evt) {
  evt.preventDefault();

  try {
    searchQuery = refs.form.elements.searchQuery.value.trim();

    if (searchQuery === '') {
      Notiflix.Notify.info('Please enter something');
      return;
    }

    refs.gallery.innerHTML = '';
    resetPage();
    refs.btnLoadMore.classList.remove('is-visible');

    const dataImg = await fetchData(searchQuery);
    const { img } = dataImg;

    if (img.length === 0) {
      refs.btnLoadMore.classList.remove('is-visible');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.gallery.innerHTML = buildGalleryMarkup(img);
    refs.btnLoadMore.classList.add('is-visible');

    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  try {
    const dataImg = await fetchData(searchQuery);
    const { img, isLastPage } = dataImg;

    refs.gallery.insertAdjacentHTML('beforeend', buildGalleryMarkup(img));

    if (isLastPage) {
      refs.btnLoadMore.classList.remove('is-visible');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}
// hello
