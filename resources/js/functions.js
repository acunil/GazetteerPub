// exchangeRate calculator, returns an object
const exchangeRatesConverted = () => {
  let n = {
    GBP: exchangeRates.GBP,
    USD: exchangeRates.USD,
    EUR: exchangeRates.EUR,
    SELF: exchangeRates[currencyCode],
  };

  // variable to deal with low value currencies
  let adjustmentMultiplier = 1;
  switch (n.SELF) {
    case n.SELF >= 10:
      adjustmentMultiplier *= 10;
    case n.SELF >= 100:
      adjustmentMultiplier *= 10;
    case n.SELF >= 1000:
      adjustmentMultiplier *= 10;
    case n.SELF >= 10000:
      adjustmentMultiplier *= 10;
  }

  for (let code in n) {
    n[code] = Math.round(n[code] * 100 * adjustmentMultiplier) / 100;
    n[code] /= n.self;
  }

  return n;
};

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
  $("#currency-name span").html(
    currencyName + " " + currencySymbol + exchangeRatesConverted.SELF
  );
  $("#currency-code span").html(currencyCode);

  // exchange rates here
  $("#GBP span").html(exchangeRatesConverted.GBP);
  $("#USD span").html(exchangeRatesConverted.USD);
  $("#EUR span").html(exchangeRatesConverted.EUR);
};
