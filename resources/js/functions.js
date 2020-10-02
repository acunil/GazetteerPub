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

  // exchangeRates of relevant currencies to be manipulated
  const xrConverted = {
    GBP: exchangeRates.GBP,
    USD: exchangeRates.USD,
    EUR: exchangeRates.EUR,
    SELF: exchangeRates[currencyCode],
  };

  // variable to deal with low value currencies
  let adjustmentMultiplier = 1;
  switch (xrConverted.SELF) {
    case xrConverted.SELF >= 10:
      adjustmentMultiplier *= 10;
    case xrConverted.SELF >= 100:
      adjustmentMultiplier *= 10;
    case xrConverted.SELF >= 1000:
      adjustmentMultiplier *= 10;
    case xrConverted.SELF >= 10000:
      adjustmentMultiplier *= 10;
    case xrConverted.SELF >= 100000:
      adjustmentMultiplier *= 10;
  }

  for (let code in xrConverted) {
    xrConverted[code] = Math.round(xrConverted[code] * 100) / 100;
    xrConverted[code] /= xrConverted.SELF;
  }

  // Proceed to populate DOM with jQuery
  //
  //
  //
  $("#country-name span").html(countryName);
  $("#population span").html(population);
  $("#languages span").html(languages); // switch to forEach for multiple langs
  $("#capital-name span").html(capitalName);
  $("#currency-name span").html(
    currencyName + " " + currencySymbol + xrConverted.SELF
  );
  $("#currency-code span").html(currencyCode);

  // exchange rates here
  $("#GBP span").html(xrConverted.GBP);
  $("#USD span").html(xrConverted.USD);
  $("#EUR span").html(xrConverted.EUR);
};
