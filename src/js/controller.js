import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import 'core-js';
import 'regenerator-runtime';

// HTML Elements
const recipeContainer = document.querySelector('.recipe');

// API
// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;

		recipeView.renderSpinner();

		// 1. Loading Recipe
		await model.loadRecipe(id);

		// 2. Rendering the recipe
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

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	searchView.addHandlerSearch(controlSearchResults);
};

init();
