import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '39292315-4a49a35cd99dea9ef99c54ebb'; // Замените на свой уникальный ключ доступа от Pixabay
const perPage = 40; // Количество изображений на странице

// Элементы формы и контейнер для отображения результатов
const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input[name="searchQuery"]');
const resultsContainer = document.querySelector('.results-container');
const loadMoreButton = document.getElementById('load-more'); // Получаем кнопку "Load more" по id

let currentPage = 1; // Изначально страница равна 1

// Функция для выполнения поискового запроса с учетом пагинации
async function searchImages(query) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage, // Указываем количество изображений на странице
        page: currentPage, // Указываем текущую страницу
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      // Если нет совпадающих изображений, выводим сообщение
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      resultsContainer.innerHTML = '';
      hideLoadMoreButton();
    } else {
      // Очищаем контейнер результатов перед отображением новых результатов
      resultsContainer.innerHTML = '';

      // Создаем и добавляем карты изображений в галерею
      images.forEach((image) => {
        const card = createImageCard(image);
        resultsContainer.appendChild(card);
      });

      // Проверяем, нужно ли показать кнопку "Load more"
      if (images.length === perPage) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Обработчик события для отправки формы
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const searchQuery = searchInput.value;

  if (searchQuery) {
    currentPage = 1; // Сбрасываем текущую страницу при новом поиске
    searchImages(searchQuery);
  }
});

// Обработчик события для кнопки "Load more"
loadMoreButton.addEventListener('click', () => {
  currentPage++; // Увеличиваем номер текущей страницы
  const searchQuery = searchInput.value;
  searchImages(searchQuery); // Выполняем поиск для следующей страницы
});

// Функция для скрытия кнопки "Load more"
function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

// Функция для отображения кнопки "Load more"
function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

// Функция для создания карточки изображения
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.largeImageURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  infoDiv.appendChild(likes);
  infoDiv.appendChild(views);
  infoDiv.appendChild(comments);
  infoDiv.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(infoDiv);

  return card;
}

// Инициализация приложения
function init() {
  hideLoadMoreButton(); // Скрываем кнопку "Load more" изначально
}

init(); // Вызываем инициализацию приложения
