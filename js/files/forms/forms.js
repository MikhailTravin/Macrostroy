// Работа с полями формы. Добавление классов, работа с placeholder
function formFieldsInit(options = {
	viewPass: false
}) {
	const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
	if (formFields.length) formFields.forEach((formField => {
		if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
	}));
	document.body.addEventListener("focusin", (function (e) {
		const targetElement = e.target;
		if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
			if (targetElement.dataset.placeholder) targetElement.placeholder = "";
			if (!targetElement.hasAttribute("data-no-focus-classes")) {
				targetElement.classList.add("_form-focus");
				targetElement.parentElement.classList.add("_form-focus");
			}
			formValidate.removeError(targetElement);
		}
	}));
	document.body.addEventListener("focusout", (function (e) {
		const targetElement = e.target;
		if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
			if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
			if (!targetElement.hasAttribute("data-no-focus-classes")) {
				targetElement.classList.remove("_form-focus");
				targetElement.parentElement.classList.remove("_form-focus");
			}
			if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
		}
	}));
	if (options.viewPass) document.addEventListener("click", (function (e) {
		let targetElement = e.target;
		if (targetElement.closest('[class*="__viewpass"]')) {
			let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
			targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
			targetElement.classList.toggle("_viewpass-active");
		}
	}));
}

// Валидация форм
let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll("*[data-required]");
		if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
			if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
		}));
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if ("email" === formRequiredItem.dataset.required) {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else this.removeError(formRequiredItem);
		} else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else if (!formRequiredItem.value.trim()) {
			this.addError(formRequiredItem);
			error++;
		} else this.removeError(formRequiredItem);
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add("_form-error");
		formRequiredItem.parentElement.classList.add("_form-error");
		let inputError = formRequiredItem.parentElement.querySelector(".form__error");
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove("_form-error");
		formRequiredItem.parentElement.classList.remove("_form-error");
		if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
	},
	formClean(form) {
		form.reset();
		setTimeout((() => {
			let inputs = form.querySelectorAll("input,textarea");
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove("_form-focus");
				el.classList.remove("_form-focus");
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll(".checkbox__input");
			if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
				const checkbox = checkboxes[index];
				checkbox.checked = false;
			}
			if (flsModules.select) {
				let selects = form.querySelectorAll(".select");
				if (selects.length) for (let index = 0; index < selects.length; index++) {
					const select = selects[index].querySelector("select");
					flsModules.select.selectBuild(select);
				}
			}
		}), 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};

// Отправка форм
function formSubmit(options = {
	validate: true
}) {
	const forms = document.forms;
	if (forms.length) for (const form of forms) {
		form.addEventListener("submit", (function (e) {
			const form = e.target;
			formSubmitAction(form, e);
		}));
		form.addEventListener("reset", (function (e) {
			const form = e.target;
			formValidate.formClean(form);
		}));
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
		if (0 === error) {
			const ajax = form.hasAttribute("data-ajax");
			if (ajax) {
				e.preventDefault();
				const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
				const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
				const formData = new FormData(form);
				form.classList.add("_sending");
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove("_sending");
					formSent(form, responseResult);
				} else {
					alert("Ошибка");
					form.classList.remove("_sending");
				}
			} else if (form.hasAttribute("data-dev")) {
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			const formError = form.querySelector("._form-error");
			if (formError && form.hasAttribute("data-goto-error")) gotoBlock(formError, true, 1e3);
		}
	}
	function formSent(form, responseResult = ``) {
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form
			}
		}));
		setTimeout((() => {
			if (flsModules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? flsModules.popup.open(popup) : null;
			}
		}), 0);
		formValidate.formClean(form);
		formLogging(`Форма отправлена!`);
	}
	function formLogging(message) {
		FLS(`[Формы]: ${message}`);
	}
}
formSubmit();

//Маска телефон
const telephone = document.querySelectorAll(".telephone");
if (telephone) Inputmask({
	mask: "+7 (999) - 999 - 99 - 99"
}).mask(telephone);