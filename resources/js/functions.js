import { APIkeys } from "./keys.js";

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
    latlng = info.restCountries.data.latlng,
    area = info.restCountries.data.area,
    continent = info.restCountries.data.subregion,
    nativeName = info.restCountries.data.nativeName;

  // CURRENCIES
  //
  // variable to deal with low value currencies
  let adjustmentMultiplier = 1;
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
  $("#population span").html(numberWithCommas(population));
  $("#area span").html(numberWithCommas(area) + " km&sup2");
  $("#continent span").html(continent);

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

  /**
   *
   *
   *             M A P
   *
   *
   *
   */

  // determine zoom level based on country area:
  let zoomLevel;

  if (area > 10000000) {
    // Russia
    zoomLevel = 2;
  } else if (area > 8000000) {
    // USA
    zoomLevel = 3;
  } else if (area > 300000) {
    // Finland
    zoomLevel = 4;
  } else if (area > 40000) {
    // Estonia
    zoomLevel = 5;
  } else if (area > 10000) {
    zoomLevel = 6;
  } else {
    // Liechtenstein
    zoomLevel = 8;
  }

  let test = 5;
  switch (test) {
    case test > 4:
      console.log("greater than 4");
      break;
    case test > 1:
      console.log("greater than 1");
      break;
    default:
      console.log("default");
  }

  // create the map and set view
  mymap.setView([latlng[0], latlng[1]], zoomLevel);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 17,
      minZoom: 2,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: APIkeys.mapbox,
    }
  ).addTo(mymap);

  if (window.myCoords) {
    if (!window.myCoords.flagAdded) {
      var myPosition = L.marker([myCoords.lat, myCoords.long]).addTo(mymap);
      window.myCoords.flagAdded = true;
      myPosition
        .bindPopup(`<b>You are here in<br>${nativeName}</b>`)
        .openPopup();
    }
  }
};
