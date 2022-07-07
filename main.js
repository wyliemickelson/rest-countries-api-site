async function getCountries() {
  return fetch('https://restcountries.com/v3.1/all')
  .then((response) => {
    return response.json();
  }).catch (function (error) {
    console.error('Something went wrong retrieving the JSON file.');
    console.error(error);
  });
}

// ----
// MAIN
// ----

async function main() {
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
  
  // ------------
  // DOM CREATION
  // ------------
  
  const create = {
    createCountryCard: function(country) {
      let countryCard = document.createElement('button');
      countryCard.classList.add('countryCard');
      countryCard.classList.add('card_shadow_round');
    
      countryCard.appendChild(this.createCountryCardImg(country));
      countryCard.appendChild(this.createCountryCardInfo(country));
    
      countryCard.addEventListener('click', () => {
        eventHandlers.changePage(true, country);
      });
    
      return countryCard;
    },
    
    createCountryCardImg: function(country) {
      let cardImgContainer = document.createElement('div');
    
      cardImgContainer.classList.add('countryCard_img_container');
      let cardImg = document.createElement('img');
      cardImg.classList.add('countryCard_img');
      cardImg.src = country.flag;
      cardImgContainer.appendChild(cardImg);
    
      return cardImgContainer;
    },
    
    createCountryCardInfo: function(country) {
      let cardInfo = document.createElement('div');
      cardInfo.classList.add('countryCard_info');
    
      let cardName = document.createElement('h2');
      cardName.textContent = country.name;
      cardName.classList.add('countryCard_info_name')
      cardName.classList.add('countryName');
      cardInfo.appendChild(cardName);
    
      cardInfo.appendChild(this.createCountryCardInfoElement('Population', country.population));
      cardInfo.appendChild(this.createCountryCardInfoElement('Region', country.region));
      cardInfo.appendChild(this.createCountryCardInfoElement('Capital', country.capital));
    
      return cardInfo;
    },
    
    createCountryCardInfoElement: function(elementName, value) {
      let infoElement = document.createElement('p');
      infoElement.classList.add('countryCard_info_element')
      let infoElementLabel = document.createElement('span');
      infoElementLabel.classList.add('countryCard_info_label');
      infoElementLabel.textContent = `${elementName}: `;
      infoElement.textContent = value;
      infoElement.prepend(infoElementLabel);
      
      return infoElement;
    },
    
    createBorderCountryButton: function(country) {
      let countryButton = document.createElement('button')
      countryButton.classList.add('border_btn')
      countryButton.textContent = country.name;
      countryButton.addEventListener('click', function() {
        eventHandlers.changePage(false, country);
      });
      return countryButton;
    },
    
    createBorderCountries: function(country, countries) {
      let borderCountries = country.borderCountries;
      const borderList = document.getElementById('borderList');
      if (borderCountries !== undefined) {
        borderCountries = borderCountries.map((countryCode) => {
          let borderCountry = countries.find(c => {
            return c.cca3 == countryCode;
          })
          return borderCountry;
        })
        borderList.textContent = '';
        borderCountries.forEach((border) => borderList.appendChild(create.createBorderCountryButton(border)));
      } else {
        borderList.textContent = 'None';
      }
    }
  }
  
  // -------
  // DISPLAY
  // -------
  
  const displayDOM = {
    displayCountries: function(countryArr) {
      const domCountryList = document.getElementById('countryList');
      countryArr.forEach((country) => {
        let countryCard =  create.createCountryCard(country);
        domCountryList.appendChild(countryCard);
      })
    },
    
    removeCountryCards: function() {
      const domCountryList = document.getElementById('countryList');
      domCountryList.innerHTML = '';
    },
    
    toggleHiddenElement: function(element) {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    },
  
    editCountryDetails: function(country) {
      detailsSection = document.getElementById('countryDetails');
      detailsSection.querySelector('#detailsTitle').textContent = country.name;
      detailsSection.querySelector('#detailsFlag').src = country.flag;
    
      this.editDetail('nativeName', country.nativeName);
      this.editDetail('population', country.population);
      this.editDetail('region', country.region);
      this.editDetail('subRegion', country.subRegion);
      this.editDetail('capital', country.capital);
      this.editDetail('tld', country.domain);
    
      let currencyArr = Object.values(country.currencies);
      let currenciesStr = currencyArr.reduce(function(prev, current) {
        return prev + ", " + current.name;
      }, "");
      currenciesStr = currenciesStr.slice(2);
      this.editDetail('currencies', currenciesStr);
    
      let languagesArr = Object.values(country.languages);
      let languagesStr = languagesArr.join(", ");
      this.editDetail('languages', languagesStr);
    
      create.createBorderCountries(country, countries);
    },
  
    editDetail: function(id, newValue) {
      // childNodes[1].nodeValue being used to change only the text and not the span before it
      document.getElementById(id).childNodes[1].nodeValue = newValue;
    }
  }
  
  // --------------
  // EVENT HANDLERS
  // --------------
  
  const eventHandlers = {
    regionFilterOptionHandler: function(regionFilterOption, countries) {
      let selectedOption = regionFilterOption.options[regionFilterOption.selectedIndex].text;
      displayDOM.removeCountryCards();
      if (selectedOption == 'Filter by Region') {
        displayDOM.displayCountries(countries);
      } else {
        let filteredCountries = countries.filter((country) => country.region == selectedOption);
        displayDOM.displayCountries(filteredCountries);
      }
    },
  
    searchFilterHandler: function(searchFilter, countries) {
      displayDOM.removeCountryCards();
      let searchParameter = searchFilter.value.toLowerCase();
      let filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(searchParameter));
      displayDOM.displayCountries(filteredCountries);
    },
  
    changePage: function (pageToggle, country) {
      if (country !== undefined) {
        displayDOM.editCountryDetails(country);
      }
      if (pageToggle) {
        let filters = document.getElementById('filters');
        let details = document.getElementById('countryDetails');
        let countryList = document.getElementById('countryList');
        displayDOM.toggleHiddenElement(filters);
        displayDOM.toggleHiddenElement(details);
        displayDOM.toggleHiddenElement(countryList);
      }
    }
  }

  const countries = createCountries(await getCountries());

  countries.sort((a, b) => a.name.localeCompare(b.name));
  let htmlFileName = window.location.pathname.split("/").pop();
  if (htmlFileName == 'index.html') {
    displayDOM.displayCountries(countries);

    const regionFilterOption = document.getElementById('filterByRegion');
    regionFilterOption.addEventListener('change', () => {
      eventHandlers.regionFilterOptionHandler(regionFilterOption, countries);
    });
  
    const searchFilter = document.getElementById('filterBySearch');
    searchFilter.addEventListener('input', () => {
      eventHandlers.searchFilterHandler(searchFilter, countries);
    });

    const backToHomeBtn = document.getElementById('backToHomeBtn');
    backToHomeBtn.addEventListener('click', () => {
      eventHandlers.changePage(true);
    });
  
  }
}

main();