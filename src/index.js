import './css/styles.css';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
countryList.style.cssText = `list-style: none;`;

inputField.addEventListener(
  'input',
  debounce(() => {
    const trimmedValue = inputField.value.trim();
    cleanHtml();
    if (trimmedValue !== '') {
      fetchCountries(trimmedValue).then(country => {
        if (country.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length >= 2 && country.length <= 10) {
          renderCountryList(country);
        } else if (country.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (country.length === 1) {
          renderOneCountry(country);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

///Рендеринг списка стран///
function renderCountryList(countries) {
  const markupHTML = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
        <b>${country.name.official}</p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markupHTML;
}
///Рендеринг одной страны///
function renderOneCountry(countries) {
  const markupHTML = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="flag of ${
        country.name.official
      }" width="30" hight="20">
        <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markupHTML;
}
