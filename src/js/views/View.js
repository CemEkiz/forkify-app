import icons from '../../img/icons.svg';

export default class View {
	_data;

	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	_clear() {
		this._parentElement.innerHTML = '';
	}

	update(data) {
		// if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

		this._data = data;
		const newMarkup = this._generateMarkup();

		// Virtual DOM living in the memory (not in the page)
		const newDOM = document.createRange().createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll('*'));
		const curElements = Array.from(this._parentElement.querySelectorAll('*'));

		// Update the servings and see the difference between curElements and newElements
		// => Open up li then check element on index 13 then innerHTML (or innerText)
		// console.log(curElements);
		// console.log(newElements);

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];

			// true if the element has changed, false if it does'nt
			// console.log(!newEl.isEqualNode(curEl));
			// console.log(curEl);

			// UPDATE CHANGED TEXT
			// Condition : if the new element is different than the current element
			//						 && if the new element first child got a value (it should'nt be equal to empty)
			//                         ^  check DOM Advanced Course  ^
			if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
				// console.log('❤️', newEl.firstChild.nodeValue.trim());
				curEl.textContent = newEl.textContent;
			}

			// UPDATE CHANGED ATTRIBUTES
			if (!newEl.isEqualNode(curEl)) {
				// console.log(newEl.attributes);
				// console.log(Array.from(newEl.attributes));
				Array.from(newEl.attributes).forEach((attr) => {
					curEl.setAttribute(attr.name, attr.value);
				});
			}
		});
	}

	renderSpinner() {
		const markup = `
		<div class="spinner">
			<svg>
				<use href="${icons}#icon-loader"></use>
				</svg>
		</div>
		`;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderMessage(message = this._message) {
		const markup = `
    <div class="message">
      <div>
        <svg>
          <use href=${icons}icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
