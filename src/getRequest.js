import renderBreweryUl from "./renderbreweryUl.js";
import formatState from "./formatState.js";

const getRequest = (selectState, selectBreweryType = "") => {
  const url = "https://api.openbrewerydb.org/breweries?by_state=";
  fetch(url + formatState(selectState))
    .then((res) => res.json())
    .then((breweries) => {
      renderBreweryUl(breweries, selectState, selectBreweryType);
    });
};

export default getRequest;
