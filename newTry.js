let currentlyRenderedBreweries = [];

//Build brewery card
const buildCard = (brewery) => {
  if (
    brewery.brewery_type != "micro" &&
    brewery.brewery_type != "regional" &&
    brewery.brewery_type != "brewpub"
  ) {
    return;
  }

  const li = document.createElement("li");
  li.classList.add("brewery-card");

  const h2 = document.createElement("h2");
  h2.innerText = brewery.name;
  li.append(h2);

  const div = document.createElement("div");
  div.innerText = brewery.brewery_type;
  div.classList.add("type");
  li.append(div);

  const addSection = document.createElement("section");
  addSection.classList.add("address");

  const addressH3 = document.createElement("h3");
  addressH3.innerText = "Address:";
  addSection.append(addressH3);

  const line1P = document.createElement("p");
  line1P.innerText = brewery.address_1;
  addSection.append(line1P);

  const line2P = document.createElement("p");
  const strongText = document.createElement("strong");
  strongText.innerText = `${brewery.city}, ${brewery.postal_code}`;
  line2P.append(strongText);
  addSection.append(line2P);

  li.append(addSection);

  const phoneSection = document.createElement("section");
  phoneSection.classList.add("phone");

  const phoneH3 = document.createElement("h3");
  phoneH3.innerText = "Phone:";
  phoneSection.append(phoneH3);

  const phoneP = document.createElement("p");
  if (brewery.phone) {
    phoneP.innerText = brewery.phone;
  } else {
    phoneP.innerText = "N/A";
  }
  phoneSection.append(phoneP);

  li.append(phoneSection);

  if (brewery.website_url) {
    const linkSection = document.createElement("section");
    linkSection.classList.add("link");
    const link = document.createElement("a");
    link.innerText = "Visit Website";
    link.setAttribute("target", "_blank");
    link.setAttribute("href", brewery.website_url);
    linkSection.append(link);
    li.append(linkSection);
  }

  if (!currentlyRenderedBreweries.includes(brewery)) {
    currentlyRenderedBreweries.push(brewery);
  }

  return li;
};

//Render cards
const render = async () => {
  const breweryList = document.querySelector("#breweries-list");
  breweryList.innerHTML = "";
  const cityFilterCheckboxes = document.querySelector(".check-boxes");
 
  cityFilterCheckboxes.innerHTML = "";
  currentlyRenderedBreweries = [];

  let url = "https://api.openbrewerydb.org/v1/breweries?";

  if (getState()) {
    url += `by_state=${getState()}&`;
  }

  if (getFilter()) {
    url += `by_type=${getFilter()}&`;
  }

  if (getName()) {
    url += `by_name=${getName()}&`;
  }

  const data = await fetch(url);
  const json = await data.json();

  json.forEach((element) => {
    const li = buildCard(element);
    if (li) {
      breweryList.append(li);
      renderCityCheckboxes(element.city);
    }
  });

  renderPageButtons()
};

//State functionality
const getState = () => {
  return document.querySelector("#select-state").value;
};

const stateForm = document.querySelector("#select-state-form");
stateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

//Filter functionality
const getFilter = () => {
  return document.querySelector(`#filter-by-type`).value;
};

const typeFilter = document.querySelector("#filter-by-type");
typeFilter.addEventListener("change", (event) => {
  event.preventDefault();
  render();
});

//Search functionality
const getName = () => {
  return document.querySelector("#search-bar").value;
};

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("keyup", (event) => {
  event.preventDefault();
  render();
});

//Build city input checkboxes and labels
const renderCityCheckboxes = (city) => {
  const cityFilterCheckboxes = document.querySelector(".check-boxes");

  if (cityFilterCheckboxes.innerHTML.includes(city)) {
    return;
  }

  const input = document.createElement("input");
  input.type = "checkbox";
  input.value = city;
  input.name = city;
  input.checked = true;
  input.addEventListener("change", () => {
    renderBreweriesByCheckbox(event);
  });

  const label = document.createElement("label");
  label.setAttribute("for", city);
  label.innerText = city;

  cityFilterCheckboxes.append(input);
  cityFilterCheckboxes.append(label);
};

//Render according to available cities
const renderBreweriesByCheckbox = () => {
  const breweryList = document.querySelector("#breweries-list");
  breweryList.innerHTML = "";

  const cityFilterCheckboxes = document.querySelectorAll("input[type=checkbox]");

  currentlyRenderedBreweries.forEach((brewery) => {
    for (let i = 0; i < cityFilterCheckboxes.length; i++) {
      if (
        cityFilterCheckboxes[i].checked &&
        cityFilterCheckboxes[i].defaultValue === brewery.city
      ) {
        const breweryToAdd = buildCard(brewery);
        breweryList.append(breweryToAdd);
      }
    }
  });   
};

//Cities clear-all functionality
const clearAllButton = document.querySelector('.clear-all-btn')
clearAllButton.addEventListener('click', () => {
    clearAll()
    
})

const clearAll = () => {
    const cityFilterCheckboxes = document.querySelectorAll("input[type=checkbox]");

    cityFilterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false
    })
    renderBreweriesByCheckbox()
}


//Pagination elements
const renderPageButtons = () => {
const breweryList = document.querySelector("#breweries-list");
  
const nextButton = document.createElement('button')
nextButton.innerText = 'Next Page'

const prevButton = document.createElement('button')
prevButton.innerText = 'Prev Page'

breweryList.append(prevButton, nextButton)

console.log(currentlyRenderedBreweries)
}

