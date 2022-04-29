import render from "./render.js";
import state from "./state.js";

function handleChangeCityFilters(event) {
  const filters = [...event.target.form.elements]
  state.cityFilters.clear()

  filters.forEach(filter => {
    const { checked, value: city} = filter
    if (checked) state.cityFilters.add(city)
  });

  fetch(`${state.currentUrl}${state.typeExtension}${state.nameExtension}`)
  .then(res => res.json())
  .then(data => {
    render(data)
  })
}

export default handleChangeCityFilters