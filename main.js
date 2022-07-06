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

class Country {
  constructor(name, nativeNames, population, region, subRegion, capital, domain, currencies, languages) {
    this.name = name;
    this.nativeNames = nativeNames;
    this.population = population;
    this.region = region;
    this.subRegion = subRegion;
    this.capital = capital;
    this.domain = domain;
    this.currencies = currencies;
    this.languages = languages;
  }

  getName() { return this.name; }
};

function createCountries(countryList) {
  let countries = []
  countryList.forEach(function(country) {
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
    countries.push(new Country(name, nativeNames, population, region, subRegion, capital, domain, currencies, languages));
  })
  return countries;
};

window.onload = async function() {
  const countries = await getCountries();
  console.log(countries); 

}
