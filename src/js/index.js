import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '39292315-4a49a35cd99dea9ef99c54ebb';
const perPage = 40;

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.querySelector('.search-form');
  const searchInput = searchForm.querySelector('input[name="searchQuery"]');
  const resultsContainer = document.querySelector('.results-container');
  const loadMoreButton = document.getElementById('load-more');
  const notification = document.getElementById('end-message');

  let currentPage = 1;
  let endOfResults = false;

  async function getImages(query, page) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: apiKey,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: perPage,
          page: page,
        },
      });

      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async function loadMoreImages() {
    if (endOfResults) {
      return;
    }

    try {
      const response = await getImages(searchInput.value.trim(), currentPage + 1);
      const images = response.data.hits;

      if (images.length === 0) {
        endOfResults = true;
        hideLoadMoreButton();
        showNotification();
        return;
      }

      images.forEach((image) => {
        const card = createImageCard(image);
        resultsContainer.appendChild(card);
      });

      currentPage++;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function hideLoadMoreButton() {
    loadMoreButton.style.display = 'none';
  }

  function showLoadMoreButton() {
    loadMoreButton.style.display = 'block';
  }

  function createImageCard(image) {
    const cardHTML = `
      <div class="photo-card">
        <img src="${image.largeImageURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;

    const card = document.createElement('div');
    card.innerHTML = cardHTML;

    return card.firstElementChild;
  }

  async function searchImages(query) {
    try {
      if (!query.trim()) {
        Notiflix.Notify.failure('Please enter a search query.');
        return;
      }

      currentPage = 1;
      endOfResults = false;
      resultsContainer.innerHTML = '';
      hideNotification();

      const response = await getImages(query, currentPage);
      const images = response.data.hits;

      if (images.length === 0) {
        Notiflix.Notify.failure("We're sorry, but there are no images matching your search query.");
        hideLoadMoreButton();
      } else {
        images.forEach((image) => {
          const card = createImageCard(image);
          resultsContainer.appendChild(card);
        });

        if (images.length < perPage) {
          hideLoadMoreButton();
          endOfResults = true;
          showNotification();
        } else {
          showLoadMoreButton();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchQuery = searchInput.value.trim();
    searchImages(searchQuery);
  });

  loadMoreButton.addEventListener('click', () => {
    loadMoreImages();
  });

  function hideNotification() {
    notification.style.display = 'none';
  }

  function showNotification() {
    notification.style.display = 'block';
  }

  function init() {
    hideLoadMoreButton();
    hideNotification();
  }

  init();
});

