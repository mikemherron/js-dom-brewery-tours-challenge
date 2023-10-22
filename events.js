
//FILTER BY TYPE OR BY STATE AND TYPE

const getBreweriesByStateAndType = (t) => {

     if(state.selectedState) {
        fetch(`https://api.openbrewerydb.org/v1/breweries?by_state=${state.selectedState}&&by_type=${t}`)
        .then(r => r.json())
        .then(d => {
            state.filteredByStateAndType = d 
            renderBreweries(state.filteredByStateAndType)
        })
     } else {
        console.log('no state chosen')
        fetch(`https://api.openbrewerydb.org/v1/breweries?by_type=${t}`)
        .then(r => r.json())
        .then(d => {
            state.filteredByType = d 
            console.log(state.filteredByType)
            renderBreweries(state.filteredByType)
        })
     }
}

chooseFilter.addEventListener('change', change => {
  
    if (change.target.value === "micro") {
        getBreweriesByStateAndType("micro")
    } 
    if (change.target.value === "regional") {
        getBreweriesByStateAndType("regional")
    }
    if (change.target.value === "brewpub") {
        getBreweriesByStateAndType("brewpub")
    }
})


//FILTER BY STATE


selectStateForm.addEventListener('submit', event => {
        event.preventDefault()
        const stateName = spacesToUnderscores(event.target[0].value) 
        state.selectedState = stateName.toLowerCase()  
        getBreweriesByState(state.selectedState )
    
})


const getBreweriesByState = (usState) => {
    
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_state=${usState}`)
    .then(r => r.json())
    .then(d => {
        state.filteredByState = d 
        renderBreweries(state.filteredByState)
        getAndRenderCities(state.filteredByState)
    })
}

//SEARCH BY NAME - THE LIST UPDATES AS THE USER TYPES

    const searchBreweries =  document.querySelector('#search-breweries')

    searchBreweries.addEventListener('input', event => {

        event.preventDefault()
        const searchParameter = event.target.value

        fetch(`https://api.openbrewerydb.org/v1/breweries/search?query={${searchParameter}}`)
        .then(r => r.json())
        .then(d => {
            state.filteredByName = d 
            renderBreweries(state.filteredByName)
        })

    })
    

//FILTER BY CITY

const filterByCity = (selectedCity) => {
    return state.filteredByState.filter(brewery => brewery.city === selectedCity)
}
let filteredByCities = []

const addEventToCheckbox = (cityCheckbox) => {
    cityCheckbox.addEventListener('change', event => {     
        filteredByCities = filteredByCities.concat(filterByCity(event.target.value))
        renderBreweries(filteredByCities)
    })
}