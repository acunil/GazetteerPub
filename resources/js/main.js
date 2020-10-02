("use strict");

import { countryListAllIsoData } from "./data.js";
import {
  getMyLocationInfo,
  restCountries,
  openExchangeRates,
} from "./apiCalls.js";
import { renderDom } from "./functions.js";
//
//
//
// DOCUMENT READY
//
//
//
$(() => {
  // Global object to store current country information.
  // - used as reference to build DOM
  // - added to localstorage (and database) under Gazetteer['gbr']
  window.countryInfo = {};

  // initialize Gazetteer object to local storage if not currently there
  if (!localStorage.getItem("Gazetteer")) {
    localStorage.setItem("Gazetteer", JSON.stringify({})); // '{}'
  }

  // forEach through the countries list to populate options for the select box
  countryListAllIsoData.forEach(country => {
    let code3 = country["code3"].toLowerCase();
    let name = country["name"];
    let flagUrl = `https://restcountries.eu/data/${code3}.svg`;
    let template = `<option value="${code3}" data-img_src="${flagUrl}">${name}</option>`;
    $("#countries").append(template);
  });
  // Convert dropdown to have flag icons
  function custom_template(obj) {
    var data = $(obj.element).data();
    var text = $(obj.element).text();
    if (data && data["img_src"]) {
      let img_src = data["img_src"];
      let template = $(
        `<div class='flex-container option'><img src="${img_src}" style="width:auto;height:1em;"/><p style="position:relative; top:6px;">${text}</p></div>`
      );
      return template;
    }
  }
  var options = {
    placeholder: "Select a country",
    templateSelection: custom_template,
    templateResult: custom_template,
  };
  $("#countries").select2(options);

  // Async wrapper to get navigator location
  (async () => {
    // Get current position
    if (navigator) {
      navigator.geolocation.getCurrentPosition(result => {
        let lat = result.coords.latitude;
        let long = result.coords.longitude;
        if (lat && long) {
          console.log("Success from navigator");
          console.log(lat, long);
          //

          getMyLocationInfo(lat, long, options);
        } else {
          console.warn("Location not found for user");
        }
      });
    } else {
      console.warn("Location not found for user");
    }
  })(); // end of async wrapper

  // add flag element to DOM flag
  let flag = $(`<img src="" id="flag" style="width:200px"/>`);
  $("#scroll-area").append(flag);

  // select onchange run code
  $("#countries").on("change", () => {
    let currentCountryCode = $("#countries option:selected").val(); // gbr
    console.warn(`Active country changed to ${currentCountryCode}`);

    // Define function which runs API chain --- put in separate js file and import!!!!!!!!!
    const runApiChain = async function (countryCode) {
      console.error("Running API chain with: " + countryCode);
      // OpenExchangeRates
      await openExchangeRates();
      // RestCountries
      await restCountries(countryCode);
    };

    // localStorage convert Gazetteer from string to usable object
    let gazetteerObj = JSON.parse(localStorage.getItem("Gazetteer"));

    if (!gazetteerObj[currentCountryCode]) {
      // if local object DOESN't have 'gbr' key
      // run APIs with 'gbr' query
      // global countryInfo will be assigned all the data
      // add that to localStorage under Gazetteer['gbr']
      (async () => {
        await runApiChain(currentCountryCode);
        gazetteerObj[currentCountryCode] = countryInfo;
        console.warn(
          `API chain run. countryInfo applied to gazetteerObj @ ${currentCountryCode} : `
        );
        console.log(gazetteerObj);
        // Added to localStorage for future requests
        localStorage.setItem("Gazetteer", JSON.stringify(gazetteerObj));
      })();
    } else {
      // else pull data from localStorage and apply to global variable countryInfo
      countryInfo = JSON.parse(localStorage.getItem("Gazetteer"))[
        currentCountryCode
      ];
    }

    console.warn("Current Country Info (countryInfo) to be used in DOM: ");
    console.log(countryInfo);

    // RENDER DOM FROM countryInfo object
    //
    //
    //

    // Call renderDom with current countryInfo object
    renderDom(countryInfo);
  }); // end of onchange
});
