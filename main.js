class Country {
  constructor(name, nativeNames, population, region, subRegion, capital, domain, currencies, languages, flag) {
    this.name = name;
    this.nativeNames = nativeNames;
    this.population = population;
    this.region = region;
    this.subRegion = subRegion;
    this.capital = capital;
    this.domain = domain;
    this.currencies = currencies;
    this.languages = languages;
    this.flag = flag;
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
    let nativeNames;
    if (country.name.nativeName){
      nativeNames = country.name.nativeName;
    } else {
      nativeNames = country.name.official;
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
    countries.push(new Country(name, nativeNames, population, region, subRegion, capital, domain, currencies, languages, flagImgLink));
  })
  return countries;
};

window.onload = async function() {
  const countries = await getCountries();
  console.log(countries);
  displayCountries(countries);
}

function displayCountries(countryArr) {
  const domCountryList = document.getElementById('countryList');
  countryArr.forEach((country) => {
    let countryCard =  createCountryCard(country);
    domCountryList.appendChild(countryCard);
  })
}

function createCountryCard(country) {
  let countryCard = document.createElement('div');
  countryCard.classList.add('countryCard')

  countryCard.appendChild(createCountryCardImg(country));
  countryCard.appendChild(createCountryCardInfo(country));
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
  cardInfo.appendChild(cardName);

  // come back to reformat the title with a span for bold
  let cardPop = document.createElement('p');
  cardPop.textContent = country.population;
  cardInfo.appendChild(cardPop);

  let cardRegion = document.createElement('p');
  cardRegion.textContent = country.region;
  cardInfo.appendChild(cardRegion);

  let cardCapital = document.createElement('p');
  cardCapital.textContent = country.capital;
  cardInfo.appendChild(cardCapital);

  return cardInfo;
}