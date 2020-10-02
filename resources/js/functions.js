// Function which accepts one argument - info - will be the countryInfo object with all the data
export const renderDom = info => {
  // function to add commas to thousands
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Check currency object is valid
  var currencies = info.restCountries.data.currencies;
  var currencyObject;
  for (let i = 0; i < currencies.length; i++) {
    if (currencies[i].code.length === 3) {
      currencyObject = currencies[i];
      break;
    }
  }

  // Access data and assign to variables
  var countryName = info.restCountries.data.name,
    population = info.restCountries.data.population,
    languages = info.restCountries.data.languages,
    capitalName = info.restCountries.data.capital,
    currencyCode = currencyObject.code,
    currencyName = currencyObject.name,
    currencySymbol = currencyObject.symbol,
    exchangeRates = info.openExchangeRates.data.rates,
    currencyValueToUSD = exchangeRates[currencyCode];

  // CURRENCIES
  //
  // variable to deal with low value currencies
  let adjustmentMultiplier = 1;
  console.error(exchangeRates[currencyCode]);
  while (adjustmentMultiplier < exchangeRates[currencyCode]) {
    adjustmentMultiplier *= 10;
    console.log("adjustmentMultiplier is now " + adjustmentMultiplier);
  }

  // exchangeRates of relevant currencies to be manipulated
  const xrConverted = {
    GBP: new Number(exchangeRates.GBP),
    USD: new Number(exchangeRates.USD),
    EUR: new Number(exchangeRates.EUR),
    SELF: new Number(exchangeRates[currencyCode]),
  };

  // format numbers correctly
  for (let code in xrConverted) {
    xrConverted[code] *= adjustmentMultiplier;
    xrConverted[code] /= xrConverted.SELF;
    xrConverted[code] = Math.round(xrConverted[code] * 100) / 100;
    xrConverted[code] = xrConverted[code].toFixed(2);
  }

  // multiply SELF
  if (adjustmentMultiplier > 1) {
    xrConverted.SELF *= adjustmentMultiplier;
  }

  // add non-main currency to DOM
  $("#SELF").hide();
  if (["GBP", "EUR", "USD"].includes(currencyCode)) {
    $("#SELF").hide();
  } else {
    $("#SELF").show();
  }

  // Proceed to populate DOM with jQuery
  //
  //
  //
  $("#country-name span").html(countryName);
  $("#population span").html(
    numberWithCommas(Math.round(population / 10000) * 10000)
  );

  // languages loop
  let languageNames = languages.reduce((acc, el) => {
    acc.push(el.name);
    return acc;
  }, []);
  $("#languages span").html(languageNames.join(", ")); // switch to forEach for multiple langs

  $("#capital-name span").html(capitalName);
  $("#currency-name span").html(currencyName + " " + currencyCode);
  $("#currency-code span").html(
    currencySymbol + numberWithCommas(xrConverted.SELF) + " is worth..."
  );

  // exchange rates here
  $("#GBP span").html(xrConverted.GBP);
  $("#USD span").html(xrConverted.USD);
  $("#EUR span").html(xrConverted.EUR);
  $("#SELF").html(
    `${currencyCode}: <span>${numberWithCommas(xrConverted.SELF)}</span>`
  );
};
