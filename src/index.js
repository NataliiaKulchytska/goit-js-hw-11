import '../css/index.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './js/getRefs';
import  NewsApiService  from './js/createAPI';


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

const refs = getRefs();
const newsApiService = new NewsApiService;
const success = newsApiService.perPage;
const page = newsApiService.page;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoad);

hideButton();

async function onSearch(e) {
    e.preventDefault();

    if (!refs.loadMoreBtn.classList.contains('is-hidden')) {

      hideButton;
    };
     newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
    newsApiService.resetPage();

  try {
     
        if (newsApiService.searchQuery === '') {
            resetRenderGallery();
         return Notiflix.Notify.warning('Enter your search query');
        }
        
          const response = await newsApiService.createAPI();
            const {
                data: { hits,  totalHits },
            } = response;
          resetRenderGallery();
  
     
  if (hits.length === 0) {
             return   Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.');
            }    
      showButton();
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
         minTotalHits(hits);        
              createImageEl(hits);          
          
        
    } catch (error) {
       
    console.log(error);
        } 
      // e.target.reset();  
};
async function minTotalHits() {

  const response = await newsApiService.createAPI();
            const {
                data: {totalHits },
  } = response;


  const totalPerPage = parseInt(`${totalHits}` / success);  
 
  if (page >= totalPerPage) {  
    
    hideButton();
   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    return;       
  }
  showButton();
}

async function onLoad() {  
    
 const response = await newsApiService.createAPI();
    const {
    data: { hits },
    } = response;

    if (hits.length === 0) {
     return  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  createImageEl(hits); 
  
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
    // lightbox.refresh('show.simpleLightbox');
};
function showButton() {
    refs.loadMoreBtn.classList.remove("is-hidden");
};

function hideButton() {
    refs.loadMoreBtn.classList.add("is-hidden");
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