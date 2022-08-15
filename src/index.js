import './css/styles.css';

import { debounce } from 'debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(inputResult, DEBOUNCE_DELAY));

function inputResult(event) {
  const inputText = event.target.value.trim();

  let promise = fetchCountries(inputText);

  promise.then(
    countries => {
      countryInfo.innerHTML = ' ';
      countryList.innerHTML = ' ';
      if (countries.length === 1) {
        let html = createCountryInfo(countries);
        countryInfo.innerHTML = html;
      } else if (countries.length <= 10) {
        let htmlList = createCountryList(countries);
        countryList.innerHTML = htmlList;
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    },
    error => {
      countryInfo.innerHTML = ' ';
      countryList.innerHTML = ' ';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  );
  return inputText;
}

const createCountryInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40"> ${
        name.official
      }</h1>
    <p>capital: ${capital}</p>
    <p>population: ${population}</p>
    <p>languages: ${Object.values(languages).join(', ')}</p>`
  );
};

const createCountryList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="20"> ${name.official}</li>`
    )
    .join('');
};

countryList.style.cssText = `list-style: none;`;