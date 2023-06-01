import './style.css';
import Icon from './images/nitro-logo.png';
import showComments from './modules/comment.js';
import Reserve from './modules/reserve.js';

const $ = document;

// Find the logo image element and set its src attribute
const logoImage = $.querySelector('.logo');
logoImage.src = Icon;

const apiUrl = 'https://api.tvmaze.com/shows';
const movieCardsContainer = $.getElementById('movie-cards');
const reserveCard = $.getElementById('reserveCard');

const fetchMovieData = async (showId) => {
  const response = await fetch(`${apiUrl}/${showId}`);
  const data = await response.json();
  return {
    name: data.name,
    image: data.image.medium,
    summary: data.summary,
    genres: data.genres,
    id: data.id,
    showStatus: data.status,
    premiered: data.premiered,
  };
};

const createMovieCard = (movieData) => {
  const card = $.createElement('div');
  card.classList.add('movie-card');

  const title = $.createElement('h2');
  title.innerText = movieData.name;

  const image = $.createElement('img');
  image.src = movieData.image;
  const comment = $.createElement('button');
  comment.innerHTML = 'Comment';

  // event listener for every comment button
  comment.addEventListener('click', () => {
    showComments(movieData);
  });

  const reserv = $.createElement('button');
  reserv.innerHTML = 'reserv';
  reserv.classList.add('reservBtn');

  const genres = $.createElement('p');
  genres.innerHTML = `<strong>Genres:</strong> ${movieData.genres.join(', ')}`;

  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(genres);
  card.appendChild(comment);
  card.appendChild(reserv);
  return { card, reserv };
};

const createMovieCards = async () => {
  const response = await fetch(`${apiUrl}`);
  const showData = await response.json();
  const shows = showData.slice(0, 20);

  // Create movie cards for each TV show
  shows.forEach(async (show) => {
    const movieData = await fetchMovieData(show.id);
    const movieCard = createMovieCard(movieData);
    movieCardsContainer.appendChild(movieCard.card);
    movieCard.reserv.onclick = () => {
      reserveCard.style.display = 'block';
      const aux = new Reserve(movieData);
      reserveCard.appendChild(aux.createTemplate());
    };
  });
};

createMovieCards();