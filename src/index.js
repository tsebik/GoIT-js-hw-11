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

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.btnLoadMore.classList.add('is-visible');

async function onSubmitClick(evt) {
  evt.preventDefault();

  try {
    searchQuery = refs.form.elements.searchQuery.value.trim();

    refs.form.elements.searchQuery.value = '';

    if (searchQuery === '') {
      Notiflix.Notify.info('Please enter something');
      return;
    }

    refs.gallery.innerHTML = '';
    resetPage();

    const dataImg = await fetchData(searchQuery);
    const { img, totalHits, isLastPage } = dataImg;
    refs.btnLoadMore.classList.remove('is-visible');

    if (isLastPage) {
      refs.btnLoadMore.classList.add('is-visible');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (img.length === 0) {
      refs.btnLoadMore.classList.add('is-visible');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.gallery.innerHTML = buildGalleryMarkup(img);

    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  try {
    const dataImg = await fetchData(searchQuery);
    const { img, isLastPage } = dataImg;

    if (isLastPage) {
      refs.btnLoadMore.classList.add('is-visible');
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.gallery.insertAdjacentHTML('beforeend', buildGalleryMarkup(img));
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}
