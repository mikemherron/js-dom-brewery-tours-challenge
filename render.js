// removes the current breweries list
const removeCurrentList = () => {
    const currentList = breweriesList.querySelectorAll('li')
    currentList.forEach(e => e.remove())
}

//RENDERS THE LIST WHERE THE BREWERIES ARE DISPLAYED

const renderBrewery = (brewery) => {
    const breweryContainer = document.createElement('li')
    breweriesList.append(breweryContainer)
    renderBreweryLayout(breweryContainer, brewery)
}


// creates and renders the high-level layout for each brewery
const renderBreweryLayout = (breweryContainer, brewery) => {

    const h2 = document.createElement('h2')
    breweryContainer.append(h2)
    h2.innerText = brewery.name

    const div = document.createElement('div')
    div.setAttribute('class', 'type')
    div.innerText = brewery.brewery_type
    breweryContainer.append(div)

    const sectionTypes = ["address", "phone", "link"]
    sectionTypes.forEach(sectionClass => {
        const section = document.createElement('section')
        section.setAttribute('class', `${sectionClass}`)
        breweryContainer.append(section)
        renderSectionContent(sectionClass, section, brewery)
    })

    //extension 4: adds the button that allows a user to add the select breweries to their list of visits (needs refactor)
    const addToVisitListButton = document.createElement('button')
    addToVisitListButton.setAttribute('class', 'add-to-visit-list')
    addToVisitListButton.innerText = 'add to visit list'
    breweryContainer.append(addToVisitListButton)
    addToVisitListButton.addEventListener('click', () => {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(brewery)
        }
    
        fetch("http://localhost:3000/myList", options)
        // .then( () => {})
    })

}

//renders the more detailed layout and contents for each brewery
const renderSectionContent = (sectionClass, section, brewery) => {

    if (sectionClass === "address") {
         
        const h3 = document.createElement('h3')
        h3.innerText = 'Address:'
        section.append(h3)
        const p1 = document.createElement('p')
        p1.innerText = brewery.street
        section.append(p1) 
        const p2 = document.createElement('p')
        section.append(p2)        
        const strong = document.createElement('strong')
        p2.append(strong)
        strong.innerText = `${brewery.city}, ${brewery.postal_code}` 
    }
    if (sectionClass === "phone") {
        const h3 = document.createElement('h3')
        section.append(h3)
        h3.innerText = 'Phone:'
        const p = document.createElement('p')
        section.append(p)
        p.innerText = brewery.phone
    }
    if (sectionClass === "link") {
        const a = document.createElement('a')
        a.setAttribute('href', `${brewery.website_url}`)
         a.setAttribute('target', 'blank')
         a.innerText = 'Visit Website'
        section.append(a)
    }
}

//renders all breweries as part of a list
const renderBreweries = (breweriesArray) => {
    removeCurrentList()
    breweriesArray.forEach(brewery => {
        //only show the breweries that offer tours
        if (brewery.brewery_type === 'micro' || brewery.brewery_type === 'regional' || brewery.brewery_type === 'brewpub') {   
            renderBrewery(brewery) 
        } 
    })
}




//EXTENSION 1
//RENDERS THE NEWLY ADDED SEARCH BAR (SEARCH BY NAME) - 

const renderSearchByNameSearchBar = () => {

    const header = document.createElement('header')
        header.setAttribute('class', 'search-bar')
        main.insertBefore(header, breweriesListContainer)
    const searchByNameForm = document.createElement('form')
        searchByNameForm.setAttribute('id', 'search-breweries-form')
        searchByNameForm.setAttribute('autocomplete', 'off')
        header.append(searchByNameForm)
    const searchByNamelabel = document.createElement('label')
        searchByNamelabel.setAttribute('for', 'search-breweries')
        searchByNameForm.append(searchByNamelabel)
    const h2 = document.createElement('h2')
        h2.innerText = "Search Breweries:"
        searchByNamelabel.append(h2)
    const searchByNameInput = document.createElement('input')
        searchByNameInput.setAttribute('name', 'search-breweries')
        searchByNameInput.setAttribute('type', 'text')
        searchByNameInput.setAttribute('id', 'search-breweries')
        searchByNameForm.append(searchByNameInput)
}




//EXTENSION 2
//RENDERS THE LIST OF CITIES TO CHOOSE FROM 


//needs refactor
const renderCityList = (cities) => {

    //creates and renders the city list container
    const filterByCityHeading = document.createElement('div')
    filterByCityHeading.setAttribute('class','filter-by-city-heading')
    filtersSection.append(filterByCityHeading)

    //creates and renders the title for this section
    const filterByCityH3 = document.createElement('h3')
    filterByCityH3.innerText = 'Cities'
    filterByCityHeading.append(filterByCityH3)

    //creates and renders the clear all button
    const filterByCityButton = document.createElement('button')
    filterByCityHeading.append(filterByCityButton)
    filterByCityButton.setAttribute('class', 'clear-all-btn')
    filterByCityButton.innerText = "clear all"

    //creates and render a list of all the cities found within one state (as returned by the GET request)
    const filterByCityForm = document.createElement('form')
    filterByCityForm.setAttribute('id', 'filter-by-city-form')
    filtersSection.append(filterByCityForm)

    cities.forEach(city => {
        const cityCheckbox = document.createElement('input')
        cityCheckbox.setAttribute('type', 'checkbox')
        cityCheckbox.setAttribute('name', `${city}`)
        cityCheckbox.setAttribute('value', `${city}`)
        filterByCityForm.append(cityCheckbox)
        addEventToCheckbox(cityCheckbox)
        addClearAllEvent(cityCheckbox)

        const cityLabel = document.createElement('label')
        cityLabel.setAttribute('for', `${city}`)
        cityLabel.innerText = city
        filterByCityForm.append(cityLabel)
    })   
}

//clears up the space when a new state is selected and the list of cities displayed must change
const removeCurrentCityList = () => {
    const filterByCityForm = document.querySelector('#filter-by-city-form')
    const filterByCityHeading = document.querySelector('.filter-by-city-heading')

    if (filterByCityForm !== null) {
    filterByCityForm.remove()
    filterByCityHeading.remove()
    }
}

//stores all the cities names returns by a GET request for a given state into an array within the state object
const getAndRenderCities = (array) => {
    state.cities = []
    array.forEach(brewery => {
        if(!state.cities.includes(brewery.city)) {
            state.cities.push(brewery.city)
        }
    })
    removeCurrentCityList()
    renderCityList(state.cities)
}


// EXTENSION 3 : PAGINATION


//TODO: change const pages so that the number of pages depends on the number of results that are available to be displayed (eg: if smaller than 10: no pagination navbar displayed / if between 10 and 20, 2 pages available / etc )
const renderPaginationControlBar = () => {

    //to  be swapped for an array created using the number of results obtained given the current search parameters
    const pages = [1, 2, 3, 4, 5]

    let currentPage = 1

    //renders the pagination bar itself (at the bottom of the page)
    const pagesList = document.createElement('ul')
    pagesList.setAttribute('id', 'page-list')
    const body = document.querySelector('body')
    body.append(pagesList)

    //go back (no functionality as of yet)
    const arrowBack = document.createElement('li')
    arrowBack.innerText = '<'
    arrowBack.setAttribute('class', 'pagination-nav')
    arrowBack.addEventListener('click', event => {
        if (currentPage === 1) {
        } else {
        currentPage = currentPage - 1
        displayPage(currentPage)
        }
    })
    pagesList.append(arrowBack)

    //page by page - renders page numbers, allows navigation (needs refactor)
    pages.forEach(p => {
        const pageNumber = document.createElement('li')
        pageNumber.innerText = `${p}`
        pageNumber.setAttribute('class', 'pagination-nav')
        pageNumber.setAttribute('value', p)
        pagesList.append(pageNumber)
        pageNumber.addEventListener('click', event => {
            currentPage = event.target.value
            displayPage(currentPage)
        })
    })
    if (pages.length > 5) {
        for (let i = 5; i <pages.length; i++) {
            const pageAtIndexI = pagesList.querySelector('li')
            pageAtIndexI.setAttribute('class', 'hidden')
        }
    }

    //go to the next page (no functionality as of yet)
    const arrowNext = document.createElement('li')
    arrowNext.innerText = '>'
    arrowNext.addEventListener('click', event => {
        if (currentPage === 5) {
            
        } else {       
            currentPage = currentPage + 1
            displayPage(currentPage)
        }
    })
    arrowNext.setAttribute('class', 'pagination-nav')
    pagesList.append(arrowNext)
}

//displays the results page by page
const displayPage = (num) => {
    renderBreweries(state.byPage[num -1])
}


// EXTENSION 4 - creates the button linking to my-visit-list.html

const displayMyVisitList = () => {
    const selectStateSection = document.querySelector(".select-state-section")
    const displayMyVisitListButton = document.createElement('a')
    selectStateSection.prepend(displayMyVisitListButton)
    displayMyVisitListButton.innerText = "My brewery tours list"
    displayMyVisitListButton.setAttribute('href', './my-visit-list.html')
}

displayMyVisitList()
renderPaginationControlBar()
renderSearchByNameSearchBar()
