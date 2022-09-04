import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import 'core-js';
import 'regenerator-runtime';

// API
// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
	try {
		// Get the id from the URL hash
		const id = window.location.hash.slice(1);
		if (!id) return;

		// Render a spinner animation during loading
		recipeView.renderSpinner();

		// 1. Load Recipe
		await model.loadRecipe(id);

		// 2. Render the recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError(s);
	}
};

const controlSearchResults = async function () {
	try {
		// 1. Get the user query from the value in the searchbar
		const query = searchView.getQuery();
		if (!query) return;

		// 2. Load the search results
		await model.loadSearchResults(query);

		// 3. Render results
		console.log(model.state.search.results);
	} catch (err) {
		console.log(err);
	}
};

// Subscribers
const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	searchView.addHandlerSearch(controlSearchResults);
};

init();
