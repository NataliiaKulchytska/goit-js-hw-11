import '../css/index.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './js/getRefs';
import  NewsApiService  from './js/createAPI';


const refs = getRefs();
const newsApiService = new NewsApiService;
const success = newsApiService.perPage;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoad);
refs.loadMoreBtn.classList.add('is-hidden');

async function onSearch(e) {
    e.preventDefault();

    if (!refs.loadMoreBtn.classList.contains('is-hidden')) {

         refs.loadMoreBtn.classList.add('is-hidden');
    };
     newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
    newsApiService.resetPage();

    try {
        if (newsApiService.searchQuery === '') {
            resetRenderGallery();
          Notiflix.Notify.warning('Enter your search query');
        }
        else {
          const response = await newsApiService.createAPI();
            const {
                data: { hits, total, totalHits },
            } = response;
          resetRenderGallery();
          
  if (hits.length === 0) {
                Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.');
            } else {   
              refs.loadMoreBtn.classList.remove('is-hidden');
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
              createImageEl(hits);          
            }
        }
    } catch (error) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    console.log(error.message);
        } 
      // e.target.reset();  
};

async function onLoad() {  
    
 const response = await newsApiService.createAPI();
    const {
    data: { hits },
    } = response;

    if (hits.length === 0) {
       Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else createImageEl(hits);      
};

function resetRenderGallery() {
    refs.container.innerHTML = '';

};

function createImageEl(hits) {
//  console.log(hits);
    const markup = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
      return `
            <div class="photo-card">
          <a href="${largeImageURL}" class="gallery__link">
           <img src="${webformatURL}" alt="${tags}" loading = "lazy"  class="photo-image" />
           <div class="info" style= "display: flex">
              <p class="info-item">
                 <b>Likes:</b>${likes}
              </p>
              <p class="info-item">
                <b>Views: </b>${views}
              </p>
              <p class="info-item">
                <b>Comments: </b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads: </b>${downloads}
              </p>
            </div>
             </a>
             </div>`;
        })
        .join('');
    refs.container.insertAdjacentHTML('beforeend', markup);
    
  simpleLightbox();
  scroll();
};

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
};

function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
   
    captionsData: 'alt',
    captionDelay: 250,
   navText: ['←','→'],
    widthRatio: 0.9,
    heightRatio: 1,
    fadeSpeed: 300,
    spinner: true,
  });
  lightbox.refresh();
};
