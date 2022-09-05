import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import 'core-js';
import 'regenerator-runtime';

if (module.hot) {
	module.hot.accept();
}

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
		// recipeView.render(model.state.recipe);
		resultsView.render(model.getSearchResultsPage(1));
	} catch (err) {
		recipeView.renderError(s);
	}
};

const controlSearchResults = async function () {
	try {
		// Render a spinner animation during loading
		resultsView.renderSpinner();

		// 1. Get the user query from the value in the searchbar
		const query = searchView.getQuery();
		if (!query) return;

		// 2. Load the search results
		await model.loadSearchResults(query);

		// 3. Render results
		// console.log(model.state.search.results);
		resultsView.render(model.getSearchResultsPage(1));
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
