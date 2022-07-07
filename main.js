class Country {
  constructor(name, nativeName, population, region, subRegion, capital, domain, currencies, languages, flag, cca3, borderCountries) {
    this.name = name;
    this.nativeName = nativeName;
    this.population = population;
    this.region = region;
    this.subRegion = subRegion;
    this.capital = capital;
    this.domain = domain;
    this.currencies = currencies;
    this.languages = languages;
    this.flag = flag;
    this.cca3 = cca3;
    this.borderCountries = borderCountries;
  }
};

async function getCountries() {
  return fetch('https://restcountries.com/v3.1/all')
  .then((response) => response.json())
  .then((countries) => {
    return createCountries(countries);
  }).catch (function (error) {
    console.error('Something went wrong retrieving the JSON file.');
    console.error(error);
  });
}

function createCountries(countryArr) {
  let countries = []
  countryArr.forEach(function(country) {
    let name = country.name.common;
    let nativeName;
    if (country.name.nativeName){
      nativeName = Object.values(country.name.nativeName)[0].official;
    } else {
      nativeName = country.name.official;
    }
    let population = country.population;
    let region = country.region;
    let subRegion = country.subregion;
    let capital = country.capital;
    let domain;
    if (country.tld) {
      domain = country.tld[0];
    } else {
      domain = 'none';
    }
    let currencies = country.currencies;
    let languages = country.languages;
    let flagImgLink = country.flags.svg;
    let cca3 = country.cca3;
    let borderCountries = country.borders;
    countries.push(new Country(name, nativeName, population, region, subRegion, capital, domain, currencies, languages, flagImgLink, cca3, borderCountries));
  })
  return countries;
};

function displayCountries(countryArr) {
  const domCountryList = document.getElementById('countryList');
  countryArr.forEach((country) => {
    let countryCard =  createCountryCard(country);
    domCountryList.appendChild(countryCard);
  })
}

function createCountryCard(country) {
  let countryCard = document.createElement('button');
  countryCard.classList.add('countryCard');
  countryCard.classList.add('card_shadow_round');

  countryCard.appendChild(createCountryCardImg(country));
  countryCard.appendChild(createCountryCardInfo(country));

  countryCard.addEventListener('click', function() {
    changePage(country, true);
  });

  return countryCard;
}

function createCountryCardImg(country) {
  let cardImgContainer = document.createElement('div');

  cardImgContainer.classList.add('countryCard_img_container');
  let cardImg = document.createElement('img');
  cardImg.classList.add('countryCard_img');
  cardImg.src = country.flag;
  cardImgContainer.appendChild(cardImg);

  return cardImgContainer;
}

function createCountryCardInfo(country) {
  let cardInfo = document.createElement('div');
  cardInfo.classList.add('countryCard_info');

  let cardName = document.createElement('h2');
  cardName.textContent = country.name;
  cardName.classList.add('countryCard_info_name')
  cardName.classList.add('countryName');
  cardInfo.appendChild(cardName);

  cardInfo.appendChild(createCountryCardInfoElement('Population', country.population));
  cardInfo.appendChild(createCountryCardInfoElement('Region', country.region));
  cardInfo.appendChild(createCountryCardInfoElement('Capital', country.capital));

  return cardInfo;
}

function createCountryCardInfoElement(elementName, value) {
  let infoElement = document.createElement('p');
  infoElement.classList.add('countryCard_info_element')
  let infoElementLabel = document.createElement('span');
  infoElementLabel.classList.add('countryCard_info_label');
  infoElementLabel.textContent = `${elementName}: `;
  infoElement.textContent = value;
  infoElement.prepend(infoElementLabel);
  
  return infoElement;
}

function editDetail(id, newValue) {
  // childNodes[1].nodeValue being used to change only the text and not the span before it
  document.getElementById(id).childNodes[1].nodeValue = newValue;
}

function editCountryDetails(country) {
  detailsSection = document.getElementById('countryDetails');
  detailsSection.querySelector('#detailsTitle').textContent = country.name;
  detailsSection.querySelector('#detailsFlag').src = country.flag;

  editDetail('nativeName', country.nativeName);
  editDetail('population', country.population);
  editDetail('region', country.region);
  editDetail('subRegion', country.subRegion);
  editDetail('capital', country.capital);
  editDetail('tld', country.domain);

  let currencyArr = Object.values(country.currencies);
  let currenciesStr = currencyArr.reduce(function(prev, current) {
    return prev + ", " + current.name;
  }, "");
  currenciesStr = currenciesStr.slice(2);
  editDetail('currencies', currenciesStr);

  let languagesArr = Object.values(country.languages);
  let languagesStr = languagesArr.join(", ");
  editDetail('languages', languagesStr);

  createBorderCountries(country);
}

async function createBorderCountries(country) {
  let borderCountries = country.borderCountries;
  const borderList = document.getElementById('borderList');
  if (borderCountries !== undefined) {
    const countries = await getCountries();
    borderCountries = borderCountries.map((countryCode) => {
      let borderCountry = countries.find(c => {
        return c.cca3 == countryCode;
      })
      return borderCountry;
    })
    borderList.textContent = '';
    borderCountries.forEach((border) => borderList.appendChild(createBorderCountryButton(border)));
  } else {
    borderList.textContent = 'None';
  }
}

function createBorderCountryButton(country) {
  let countryButton = document.createElement('button')
  countryButton.classList.add('border_btn')
  countryButton.textContent = country.name;
  countryButton.addEventListener('click', function() {
    changePage(country, false);
  });
  return countryButton;
}

function removeCountryCards() {
  const domCountryList = document.getElementById('countryList');
  domCountryList.innerHTML = '';
}

function toggleHiddenElement(element) {
  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

window.onload = async function() {
  const countries = await getCountries();
  countries.sort((a, b) => a.name.localeCompare(b.name));
  let htmlFileName = window.location.pathname.split("/").pop();
  if (htmlFileName == 'index.html') {
    displayCountries(countries);

    const regionFilterOption = document.getElementById('filterByRegion');
    regionFilterOption.addEventListener('change', regionFilterOptionHandler);
  
    const searchFilter = document.getElementById('filterBySearch');
    searchFilter.addEventListener('input', searchFilterHandler);

    const backToHomeBtn = document.getElementById('backToHomeBtn');
    backToHomeBtn.addEventListener('click', function() {
      changePage(undefined, true);
    });
  
  }

  function regionFilterOptionHandler() {
    let selectedOption = this.options[this.selectedIndex].text;
    removeCountryCards();
    if (selectedOption == 'Filter by Region') {
      displayCountries(countries);
    } else {
      let filteredCountries = countries.filter((country) => country.region == selectedOption);
      displayCountries(filteredCountries);
    }
  }

  function searchFilterHandler() {
    removeCountryCards();
    let searchParameter = this.value.toLowerCase();
    let filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(searchParameter));
    displayCountries(filteredCountries);
  }
}

function changePage(country, pageToggle) {
  if (country !== undefined) {
    editCountryDetails(country);
  }
  if (pageToggle) {
    let filters = document.getElementById('filters');
    let details = document.getElementById('countryDetails');
    let countryList = document.getElementById('countryList');
    toggleHiddenElement(filters);
    toggleHiddenElement(details);
    toggleHiddenElement(countryList);
  }
}