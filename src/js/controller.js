import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js';
import 'regenerator-runtime';

// HTML Elements
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			);
		}, s * 1000);
	});
};

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
		alert(err);
	}
};

// controlRecipes();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
['hashchange', 'load'].forEach((ev) =>
	window.addEventListener(ev, controlRecipes)
);
