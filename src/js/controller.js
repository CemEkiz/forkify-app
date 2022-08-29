import icons from '../img/icons.svg';
import 'core-js';
import 'regenerator-runtime';

// HTML Elements
const recipeContainer = document.querySelector('.recipe');

/* NOTE:
C'est un timer qui va s'utiliser comme cela : timeout(5) pour 5 secondes d'attentes par exemple
Si l'attente est d'au moins 5 second, alors la Promise est rejected et le message d'erreur s'affiche.
> console.log(timeout(5))
*/
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

/* NOTE:
- Cette fonction est ré-utilisable, elle prend en paramètre le container ou le "markup" va s'afficher
*/
const renderSpinner = function (parentEl) {
	const markup = `
	<div class="spinner">
		<svg>
			<use href="${icons}#icon-loader"></use>
  		</svg>
	</div>
	`;

	parentEl.innerHTML = '';
	parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
	try {
		/* NOTE:
    - window.location = l'url entier
    - .hash = ce qui se situe après le #
    - .slice(1) = va récupérer récupérer l'id (hash) sans le # (d'où le "1")
    */
		const id = window.location.hash.slice(1);
		if (!id) return;

		/* NOTE:
    
    - renderSpinner : le temps que l'api load puis render, un spinner animé sera affiché
    - const res : cela va fetch des données en arrière-plan, puis retourner une réponse
    - Les données sont stockés dans /recipes/id, pour chaque "id" il y a un object différent dans l'API
    > console.log(res)
    - const data : depuis la réponse retournée on va prendre et stocker les données  fetch grâce à la 
    method .json(), la variable "data" contiendra un object avec les données correspondant à l'id de l'API
    > console.log(data) 
    */
		// 1. Loading Recipe

		renderSpinner(recipeContainer);

		const res = await fetch(
			`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
		);
		const data = await res.json();

		/* NOTE:
    Si le fetch api a un identifiant incorrect par exemple, alors un message d'erreur sera retourné
    - res : il contiendra "ok: false" pour informer qu'il y a une erreur
    - data : il contiendra "message: message d'erreur" pour informer sur la nature de l'erreur
    > On peut alors s'en servir pour créer une erreur et l'utiliser plus tard dans "catch" :
    - Si "res.ok" est falsy alors "throw new Error()"
    - Entre les () on peut écrire le message que l'on souhaite, ici on va retourner "data.message" et "res.status"

    */
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		/* NOTE:
    - Ici le but est de récupérer les propriétés des data et de les renommer "source_url" > sourceUrl, etc.
    - let { recipe } = data.data : on destructure recipe qui est contenu dans "data.data.recipe", maintenant
    "recipe" a été décomposé et est accessible directement via "console.log(recipe)" par exemple.
    - Tip : on pense à destructurer quand on se retrouve dans ce type de situation : "let recipe = data.data.recipe"
    (la propriété "recipe" est des 2 côtés)
    - Il reste qu'à renommer, par exemple : "sourceUrl: recipe.source_url", etc. 
    > console.log(recipe) avant et après le renommage
    */
		let { recipe } = data.data;
		recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};

		/* NOTE: 
    - Maintenant que nous avons chargé les données de l'API et renommé les propriétés, on peut les manipuler
    - On crée donc une variable "markup" dans laquelle on va stocker un template literal du HTML
    à render, on peut leur donner des valeurs dynamiques telles que ${recipe.image} etc.
    - On va également importer les "icons" et utiliser la méthode classique du <svg> avec <use>
    - Pour la liste des ingrédients on va loop (avec .map car on veut retourner qqch) dans recipe.ingredients et afficher
    une <li> à chaque itération avec ses "quantity", "unit" et "decription" correspondant puis on va .join le tout
    */
		// 2. Rendering the recipe
		const markup = `
		<figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
			recipe.title
		}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
				recipe.cookingTime
			}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
				recipe.servings
			}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
			${recipe.ingredients
				.map((ing) => {
					return `
				<li class="recipe__ingredient">
				<svg class="recipe__icon">
				  <use href="${icons}#icon-check"></use>
				</svg>
				<div class="recipe__quantity">${ing.quantity}</div>
				<div class="recipe__description">
				  <span class="recipe__unit">${ing.unit}</span>
				  ${ing.description}
				</div>
			  </li>
				`;
				})
				.join('')}
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
				recipe.publisher
			}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
		`;

		recipeContainer.innerHTML = '';
		recipeContainer.insertAdjacentHTML('afterbegin', markup);
	} catch (err) {
		/* NOTE:
    Si une erreur a été capturé avec "throw new Error", alors on l'affichera dans une alerte
    > Essayer avec un faux id lors du fetch api pour voir si l'erreur s'affiche correctement
    */
		alert(err);
	}
};

// showRecipe();

/* NOTE:
- hashchange event : il est déclenché lorsque l'identificateur de fragment de l'URL a changé 
(la partie de l'URL qui suit le symbole #, y compris le symbole # lui-même).
- load event : il est déclenché lorsque la page et toutes ses ressources dépendantes 
(telles que des feuilles de style et des images) sont complètement chargées
- Si l'utilisateur rentre l'URL qui contient déjà le hash, alors il faut listen l'event load
- Si l'utilisateur est sur le site et qu'il recherche ou clique et que l'url et le hash change
alors il faut listen le hashchange event
- Grâce à forEach on peut déclencher la même fonction pour 2 events différents ou tout simplement
créer 2 lignes séparées comme ci-dessous.
*/
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
['hashchange', 'load'].forEach((ev) => window.addEventListener(ev, showRecipe));
