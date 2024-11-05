// Global variables
let countriesData = [];
let currentPage = 1;
const pageSize = 20;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch countries data
async function fetchCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  countriesData = await response.json();
  displayCountries();
}

// Display countries with pagination
function displayCountries() {
  const countryList = document.getElementById('country-list');
  countryList.innerHTML = '';

  const query = document.getElementById('search-bar').value.toLowerCase().trim();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  paginatedCountries.forEach(country => {
    const countryCard = document.createElement('div');
    countryCard.className = 'country-card';
    countryCard.innerHTML = `
      <h4>${country.name.common}</h4>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="80">
      <span class="heart-icon ${isFavorite(country.name.common) ? 'favorite' : ''}" onclick="toggleFavorite('${country.name.common}', this)">&#9829;</span>
    `;
    countryCard.addEventListener('click', () => showCountryDetails(country));
    countryList.appendChild(countryCard);
  });

  document.getElementById('show-more').style.display = endIndex < filteredCountries.length ? 'block' : 'none';
}

// Helper function to check if a country is in favorites
function isFavorite(countryName) {
  return favorites.includes(countryName);
}
// Toggle favorite functionality for heart icon
function toggleFavorite(countryName, icon, event) {
  // Prevent the click from propagating to the parent (card) click event
  event.stopPropagation();

  if (favorites.includes(countryName)) {
    favorites = favorites.filter(fav => fav !== countryName);
    icon.classList.remove('favorite');
  } else if (favorites.length < 15) {
    favorites.push(countryName);
    icon.classList.add('favorite');
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}
// Display favorite countries in the sidebar
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = ''; // Clear current list before adding updated favorites

  favorites.forEach(favoriteName => {
    // Find the full country data by name from countriesData
    const country = countriesData.find(c => c.name.common === favoriteName);

    if (country) {
      const favoriteCard = document.createElement('div');
      favoriteCard.className = 'favorite-card';
      favoriteCard.innerHTML = `
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="40">
        <span>${country.name.common}</span>
      `;
      favoritesList.appendChild(favoriteCard);
    }
  });
}

// Initial setup
fetchCountries();
displayFavorites();

// Display countries with pagination
function displayCountries() {
  const countryList = document.getElementById('country-list');
  countryList.innerHTML = '';

  const query = document.getElementById('search-bar').value.toLowerCase().trim();
  const filteredCountries = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  paginatedCountries.forEach(country => {
    const countryCard = document.createElement('div');
    countryCard.className = 'country-card';
    countryCard.innerHTML = `
      <h4>${country.name.common}</h4>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="80">
      <span class="heart-icon ${isFavorite(country.name.common) ? 'favorite' : ''}" 
        onclick="toggleFavorite('${country.name.common}', this, event)">&#9829;</span>
    `;
    countryCard.addEventListener('click', () => showCountryDetails(country));
    countryList.appendChild(countryCard);
  });

  document.getElementById('show-more').style.display = endIndex < filteredCountries.length ? 'block' : 'none';
}

// Show more countries
document.getElementById('show-more').addEventListener('click', () => {
  currentPage++;
  displayCountries();
});

// Search functionality with input event
document.getElementById('search-bar').addEventListener('input', () => {
  currentPage = 1;
  displayCountries();
});

// Filter by region or language
document.getElementById('region-filter').addEventListener('change', filterCountries);
document.getElementById('language-filter').addEventListener('input', filterCountries);

function filterCountries() {
  const region = document.getElementById('region-filter').value;
  const language = document.getElementById('language-filter').value.toLowerCase().trim();

  const filteredCountries = countriesData.filter(country => {
    const matchesRegion = !region || country.region === region;
    const matchesLanguage = !language || (country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(language)));
    return matchesRegion && matchesLanguage;
  });

  countriesData = filteredCountries;
  currentPage = 1;
  displayCountries();
}

// Show country details
function showCountryDetails(country) {
  // Redirect to the details page with country information in the URL
  const params = new URLSearchParams({
    name: country.name.common,
    capital: country.capital || 'N/A',
    region: country.region,
    population: country.population,
    area: country.area,
    languages: Object.values(country.languages || {}).join(', ') || 'N/A',
    flag: country.flags.png
  });

  window.location.href = `details.html?${params.toString()}`;
}

// Initial setup
fetchCountries();
displayFavorites();
