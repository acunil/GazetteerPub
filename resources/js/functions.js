// Function which accepts one argument - info - will be the countryInfo object with all the data
export const renderDom = info => {
  // Access data and assign to variables
  var countryName = info.restCountries.data.name,
    population = info.restCountries.data.population,
    languages = info.restCountries.data.languages[0].name,
    capitalName = info.restCountries.data.capital,
    currencyCode = info.restCountries.data.currencies[0].code,
    currencyName = info.restCountries.data.currencies[0].name,
    currencySymbol = info.restCountries.data.currencies[0].symbol,
    exchangeRates = info.openExchangeRates.data.rates[currencyCode];

  // Proceed to populate DOM with jQuery
  //
  //
  //
};
