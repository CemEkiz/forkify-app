import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// import 'core-js';
// import 'regenerator-runtime';

// API
// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////

const handleRecipes = async function () {
  try {
    // Get the id from the URL hash
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render a spinner animation during loading
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Load Recipe
    await model.loadRecipe(id);

    // 2. Render the recipe
    recipeView.render(model.state.recipe);
    // resultsView.render(model.getSearchResultsPage(1));
  } catch (err) {
    recipeView.renderError();
  }
};

const handleSearchResults = async function () {
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
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const handlePagination = function (goToPage) {
  // 3. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const handleServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const handleAddBookmark = function () {
  // 1. Add or remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const handleBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const handleAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    // setTimeout(function () {
    // 	addRecipeView.toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// Subscribers
const init = function () {
  bookmarksView.addHandlerRender(handleBookmarks);
  recipeView.addHandlerRender(handleRecipes);
  recipeView.addHandlerUpdateServings(handleServings);
  recipeView.addHandlerAddBookmark(handleAddBookmark);
  searchView.addHandlerSearch(handleSearchResults);
  paginationView.addHandlerClick(handlePagination);
  addRecipeView.addHandlerUpload(handleAddRecipe);
};

init();
