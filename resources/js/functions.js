// Function which accepts one argument - info - will be the countryInfo object with all the data
export const renderDom = info => {
  // function to add commas to thousands
  function numberWithCommas(x) {
    if (!x) {
      return null;
    }
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
  $("#country-name .answer").html(countryName);
  $("#capital-name .answer").html(capitalName);
  $("#continent .answer").html(continent);
  $("#population .answer").html(numberWithCommas(population));
  $("#area .answer").html(
    area ? numberWithCommas(area) + " km&sup2" : "unknown"
  );

  // languages loop
  let languageNames = languages.reduce((acc, el) => {
    acc.push(el.name);
    return acc;
  }, []);
  $("#languages .answer").html(languageNames.join(", ")); // switch to forEach for multiple langs

  $("#currency-name .answer").html(currencyName + " [" + currencyCode + "]");

  $("#currency-worth").html(
    (currencySymbol || currencyCode) +
      numberWithCommas(xrConverted.SELF) +
      "<br>is worth:"
  );

  // exchange rates here
  $("#GBP div").html(xrConverted.GBP);
  $("#USD div").html(xrConverted.USD);
  $("#EUR div").html(xrConverted.EUR);
  $("#SELF").html(
    `${currencyCode}: <div class="xr rounded-pill">${numberWithCommas(
      xrConverted.SELF
    )}</div>`
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
  } else if (area > 240000) {
    // UK
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

  // create the map and set view
  mymap.setView([latlng[0], latlng[1]], zoomLevel);

  /* 
  mapbox styles (replace id):
  streets-v11
  outdoors-v11
  light-v10
  dark-v10
  satellite-v9
  satellite-streets-v11
  */

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
      maxZoom: 9,
      minZoom: 2,
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
