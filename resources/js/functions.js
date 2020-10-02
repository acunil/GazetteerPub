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
    exchangeRates = info.openExchangeRates.data.rates,
    currencyValueToUSD = exchangeRates[currencyCode];

  // Proceed to populate DOM with jQuery
  //
  //
  //
  $("#country-name span").html(countryName);
  $("#population span").html(population);
  $("#languages span").html(languages); // switch to forEach for multiple langs
  $("#capital-name span").html(capitalName);
  $("#currency-name span").html(currencyName + " " + currencySymbol);
  $("#currency-code span").html(currencyCode);

  // exchange rates here, placeholders only!!!!
  $("#GBP span").html(exchangeRates.GBP);
  $("#USD span").html(exchangeRates.USD);
  $("#EUR span").html(exchangeRates.EUR);
};

// exchangeRate calculator
const calculateExchangeRates = () => {
  let n = {
    gbp: exchangeRates.GBP,
    usd: exchangeRates.USD,
    eur: exchangeRates.EUR,
    self: exchangeRates[currencyCode],
  };

  for (let code in n) {
    n[code] = Math.round(n[code] * 100) / 100;
    n[code] /= n.self;
  }
};
