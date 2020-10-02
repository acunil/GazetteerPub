"use strict";
import { APIkeys } from "./keys.js";

// MY LOCATION
export const getMyLocationInfo = async (lat, long, options) => {
  try {
    return await $.ajax({
      url: `https://api.opencagedata.com/geocode/v1/json?key=${APIkeys.openCage}&q=${lat}%2C${long}`,
      type: "GET",
      dataType: "json",
      data: {
        lat: lat,
        long: long,
      },
      success(result) {
        console.log("Success from OpenCage");
        console.log(result);
        const code = result.results[0].components[
          "ISO_3166-1_alpha-3"
        ].toLowerCase();
        $(`#countries option:selected`).attr("selected", null);
        $(`#countries option[value='${code}']`).attr("selected", "selected");
        $("#countries").val(code);
        $("#countries").select2(options).trigger("change");
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log(
          "There was something wrong with the getMyLocationInfo request"
        );
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } catch (e) {
    console.log(e);
  }
}; // end of my location

// RESTCOUNTRIES
export const restCountries = async countryCode => {
  try {
    return await $.ajax({
      url: "resources/php/restCountries.php",
      type: "GET",
      dataType: "json",
      data: {
        code: countryCode,
      },
      success(jsonObj) {
        if (jsonObj.status.name == "ok") {
          console.log("Success from restCountries for: " + countryCode);
          window.countryInfo.restCountries = jsonObj;
          console.log("restCountries applied to window.countryInfo");
        }
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log("Restcountries went wrong!!");
        // logError(...arguments);
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } catch (e) {
    console.log(e);
  }
}; // end of restcountries

//OpenExchangeRates
export const openExchangeRates = async () => {
  try {
    return await $.ajax({
      url: "resources/php/openExchangeRates.php",
      type: "GET",
      dataType: "json",
      data: {
        key: APIkeys.openExchangeRates,
      },
      success(jsonObj) {
        if (jsonObj.status.name == "ok") {
          window.countryInfo.openExchangeRates = jsonObj;
          console.log("Success from OpenExchangeRates");
          console.log(window.countryInfo.openExchangeRates);
        }
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log("OpenExchangeRates went wrong!!");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } catch (e) {
    console.log(e);
  }
}; // end of open exchange rates
