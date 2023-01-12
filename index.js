//STATE
const state = {
    breweries: [],
    listOfCities: [],
    filterByType: "",
    filterByName: "",
    filterByCity: ""
  };

//SELECT ELEMENTS
const listOfBreweriesUL = document.querySelector('#breweries-list')
const inputField = document.querySelector('#select-state-form')
const searchThisState = document.querySelector(`#select-state`)
const filterSelector = document.querySelector(`#filter-by-type-form`)
const typeOfFilter = document.querySelector('#filter-by-type')
const brewerySeachBar = document.querySelector('#search-breweries-form')
const searchThisBrewery = document.querySelector('search-breweries')
const filterByCity = document.querySelector('#filter-by-city-form')

// EX2
// Select form for right hand side ID filter-by-city-form TICK
// Create function and call it from the render function 
// For each loop round breweries within filtered breweries
// Create new elements with input and lable (lable type checkbox, name + value = STATE NAME taken from breweries)
// Label innertext = STATENAME
// Append

// function filterCheckboxList(filteredBreweries) {
//     console.log(filteredBreweries)
//     filteredBreweries.forEach((brewery) => {
//         const breweryNameForListInput = document.createElement('input')
//         breweryNameForListInput.getAttribute('type', "checkbox")
//         const breweryNameForListLabel = document.createElement('label')
//         breweryNameForListLabel.getAttribute('for', "statename")
//         breweryNameForListLabel.innerText = brewery.name
//         filterByCity.append(breweryNameForListInput, breweryNameForListLabel)

//     })
// }

// Drop Down event listener
filterSelector.addEventListener('input', function(event){
    event.preventDefault
    state.filterByType = event.target.value
    renderBreweries()
})

//Inial search for Breweries
inputField.addEventListener('submit', function(event){
    event.preventDefault()
    const stateName = searchThisState.value
    if(stateName.length > 0){
        getBreweriesByStateFromAPI(stateName)
    } else {
        console.log("Please give us a state mate?")
    }
})

// Search bar event listener
brewerySeachBar.addEventListener('input', function(event){
    event.preventDefault
    state.filterByName = event.target.value.toLowerCase()
    renderBreweries()
})

// Checkbox event listener
filterByCity.addEventListener('input', function(event){
    event.preventDefault
    state.filterByCity = event.target.value
    renderBreweries()
})
  
//NETWORK

function getBreweriesByStateFromAPI(stateName){
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${stateName}&per_page=50`)
        .then((response) => {
            return response.json()
        })
        .then((breweriesDataFromServer) => {
            state.breweries = breweriesDataFromServer
            renderBreweries()
        })
}

//RENDERING

function renderBreweries(){
    listOfBreweriesUL.innerHTML = ""
    // filterByCity.innerHTML = ""
    // create filter variable and filter by type
    let filteredBreweries = state.breweries.filter((brewery) => {
        if(state.filterByType.length > 0){
            if(brewery.brewery_type === state.filterByType){
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    })
    // Filter By name
    filteredBreweries = filteredBreweries.filter((brewery) => {
        if(state.filterByName.length > 0){
            if (state.filterByName.length === 0){
                return true; 
            } if (brewery.name.includes(state.filterByName)) {
                return true;
            } if (brewery.name.toLowerCase().includes(state.filterByName)){
                return true;
            } else {    
                return false;
            }
        } else {
            return true
        }
    })
    // Create City List
    filteredBreweries.forEach((brewery) => {
        if(!state.listOfCities.includes(brewery.city)){
            state.listOfCities.push(brewery.city)
            renderCitiesList()
        }
    })

    // Filter by City

    filteredBreweries = filteredBreweries.filter((brewery) => {
        if (state.filterByCity.length > 0) {
            if (state.filterByCity.length === 0) {
                return true
            } if (brewery.city.includes(state.filterByCity)){
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    })

    filteredBreweries.forEach((brewery) => {
        creatingBreweriesList(brewery)
    })
}

function creatingBreweriesList(brewery){
    const breweryDataLiConstainer = document.createElement("li")

        const breweryName = document.createElement('h2')
        breweryName.innerText = brewery.name

        const breweryAddressContainer = document.createElement('section')
        breweryAddressContainer.setAttribute("class", "address")
        const breweryAddressH3 = document.createElement('h3')
        breweryAddressH3.innerText = "Address:"
        const breweryAddressStreet = document.createElement('p')
        breweryAddressStreet.innerText = brewery.street
        const breweryAddressCity = document.createElement('p')
        breweryAddressCity.innerText = `${brewery.city}, ${brewery.state}, ${brewery.postal_code}`
        breweryAddressContainer.append(breweryAddressH3, breweryAddressStreet, breweryAddressCity)

        const breweryPhoneContainer = document.createElement('section')
        const breweryPhoneH3 = document.createElement('h3')
        breweryPhoneH3.setAttribute("class", "phone")
        breweryPhoneH3.innerText = `Phone:`
        const breweryPhoneNumber = document.createElement('p') 
        breweryPhoneNumber.innerText = brewery.phone
        breweryPhoneContainer.append(breweryPhoneH3, breweryPhoneNumber)


        const breweryType = document.createElement("span")
        breweryType.setAttribute("class", "type")
        breweryType.innerText = brewery.brewery_type

        const breweryLinkContainer = document.createElement("section")
        breweryLinkContainer.setAttribute("class", "link")
        const breweryLink = document.createElement("a")
        breweryLink.setAttribute("href", `${brewery.website_url}`)
        breweryLink.innerText = "Visit Website"
        breweryLinkContainer.append(breweryLink)
        
        breweryDataLiConstainer.append(breweryName, breweryAddressContainer, breweryPhoneContainer, breweryType, breweryLinkContainer)

        listOfBreweriesUL.append(breweryDataLiConstainer)
}

function renderCitiesList(){
    filterByCity.innerHTML = ""
    state.listOfCities.forEach((city) => {
        const breweryNameForListInput = document.createElement('input')
        breweryNameForListInput.setAttribute('type', "checkbox")
        breweryNameForListInput.setAttribute('name', city)
        breweryNameForListInput.setAttribute('value', city)
        const breweryNameForListLabel = document.createElement('label')
        breweryNameForListLabel.setAttribute('for', city)
        breweryNameForListLabel.innerText = city
        filterByCity.append(breweryNameForListInput, breweryNameForListLabel)
    })
} 

// function renderAllBreweries(){
//     listOfBreweriesUL.innerHTML = ""
//     state.breweries.forEach((brewery) => {
//         creatingBreweriesList(brewery)
//     })
// }

// -- LOGIC --
// 1.) Create State object and include breweries
// 2.) Create Event Listener on the <form> #select-state-form
//  - REMEMBER 'SUBMIT'
//  - Prevent default behabviour to stop the page reloading and messing with the request
//  - check the state length (input.innertext > 0)
//  - Call function that will deal with the fetch request getBreweriesByStateFromAPI(stateName)
//  - COMMIT TO GITHUB

// 3.) Create function to fetch breweries by state
//  - If state has 2 words replace "" with "_" (start with one word first then do this bit) 
//  - from resource - https://api.openbrewerydb.org/breweries?by_state=US_STATE_NAME&per_page=50
//  - Can we use ${STATENAME} here?? (REMEMBER `)
//  - On response, save data to local state.breweries (do we need all info here? we can deal with that in render)
//  - Call render renderAllBreweries()
//  COMMIT TO GITHUB

// 4.) Render Function - renderAllBreweries
//  - Clear list (innerHTML = "")
//  - For Each loop state.breweries (REMEMBER PLURALS AND SINGULAR HERE)
//      - Creat li (const li) document.createElement ('li")
//      - Store ID, Name, Address (.address), Phone Number (.phone), Type (.breweries-list li .type), and website (.link) in li
//      - Append li to Ul
//  COMMIT TO GITHUB

// 5.) Filter Section (This might need to be in the renderAllBreweries)
//  - If submit innertext === micro call function - RenderMicro
//  - If submit innertext === regional call function - renderRegional
//  - If submit innertext === brewpub call function - renderBrewpub

// 6.) Functions for each type
//  - clear list
//  - Filter state.breweries
//      - state.breweries.filter(.type === "micro")
//  - Render 

