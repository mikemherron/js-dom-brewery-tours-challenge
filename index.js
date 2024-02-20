const state = {
  breweries: [],
  titleFilter: "",
  locationFilter: "",
};

// SELECT STATIC ELEMENT
const brewerUlElement = document.getElementById("breweries-list");

// INITIALIZE FUNCTIONS
function renderWebsite() {
  brewerUlElement.innerHTML = "";

  for (const brewerie of state.breweries) {
    const liElement = createCardElement(brewerie);
    brewerUlElement.appendChild(liElement);
  }
}

function createCardElement(brewerie) {
  /*
<li>
  <h2>Snow Belt Brew</h2>
  <div class="type">micro</div>
  <section class="address">
    <h3>Address:</h3>
    <p>9511 Kile Rd</p>
    <p><strong>Chardon, 44024</strong></p>
  </section>
  <section class="phone">
    <h3>Phone:</h3>
    <p>N/A</p>
  </section>
  <section class="link">
    <a href="null" target="_blank">Visit Website</a>
  </section>
</li>
*/
  const liElement = document.createElement("li");

  const h2Element = document.createElement("h2");
  h2Element.innerText = brewerie.name;
  liElement.appendChild(h2Element);

  const divElement = document.createElement("div");
  divElement.className = "type";
  divElement.innerText = brewerie.brewery_type;
  liElement.appendChild(divElement);

  const section1Element = document.createElement("section");
  section1Element.className = "address";

  const section1h3element = document.createElement("h3");
  section1h3element.innerText = brewerie.address_2;
  section1Element.appendChild(section1h3element);

  const section1p1Element = document.createElement("p");
  section1p1Element.innerText = brewerie.street;
  section1Element.appendChild(section1p1Element);

  const section1p2Element = document.createElement("p");
  const strongElement = document.createElement("strong");
  strongElement.innerText = `${brewerie.city} ${brewerie.postal_code}`;
  section1p2Element.appendChild(strongElement);
  section1Element.appendChild(section1p2Element);
  liElement.appendChild(section1Element);

  const section2Element = document.createElement("section");
  section2Element.className = "phone";

  const section2h3Element = document.createElement("h3");
  section2h3Element.innerText = brewerie.phone;
  section2Element.appendChild(section2h3Element);

  const section2pElement = document.createElement("p");
  section2pElement.innerText = "N/A"; // <-- ?
  section2Element.appendChild(section2pElement);
  liElement.appendChild(section2Element);

  const section3Element = document.createElement("section");
  section3Element.className = "link";

  const section3aElement = document.createElement("a");
  section3aElement.setAttribute("href", brewerie.website_url);
  section3aElement.setAttribute("target", "_blank");
  section3aElement.innerText = "Visit Website";
  section3Element.appendChild(section3aElement);

  liElement.appendChild(section3Element);

  return liElement;
}

// CRUD FUNCTIONS
function getBreweriesApi() {
  console.log("FETCH /breweries");
  fetch("http://localhost:3000/breweries", {})
    .then((res) => {
      console.log("2");
      return res.json();
    })
    .then((resData) => {
      console.log("3");
      console.log("FETCH response data: ", resData);

      state.breweries = resData;
      renderWebsite();
    });
}
function initialize() {
  console.log("Initializing...");
  getBreweriesApi();
  console.log("Initialized!");
}

initialize();

// TEMPLATES
/*
<li>
  <h2>Snow Belt Brew</h2>
  <div class="type">micro</div>
  <section class="address">
    <h3>Address:</h3>
    <p>9511 Kile Rd</p>
    <p><strong>Chardon, 44024</strong></p>
  </section>
  <section class="phone">
    <h3>Phone:</h3>
    <p>N/A</p>
  </section>
  <section class="link">
    <a href="null" target="_blank">Visit Website</a>
  </section>
</li>
*/
