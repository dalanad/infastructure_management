import "https://cdn.jsdelivr.net/gh/dalanad/helix/dist/main.js";
import "https://cdn.jsdelivr.net/npm/@hotwired/turbo@7.0.0-beta.4/dist/turbo.es5-umd.min.js";
import "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js";
import "https://unpkg.com/vue-select@3.11/dist/vue-select.js";
import "./helpers.js";
import "./components.js";

document.addEventListener("turbo:load", () => afterLoad(), false);
let app;
function afterLoad() {
	init();
	var t = document.getElementsByClassName("sidebar")[0];
	document.getElementsByClassName("sidebar-toggle")[0].addEventListener("click", function () {
		t.classList.toggle("collapsed"),
			t.addEventListener("transitionend", function () {
				window.dispatchEvent(new Event("resize"));
			});
	});
}

function validateForms() {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function (form) {
		form.addEventListener(
			"submit",
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
}

function InitSortHeader(e) {
	e.classList.add("sort-header");
	e.dataset.dir = new URLSearchParams(window.location.search).getAll(`sort[${e.dataset.field}]`);
	e.innerHTML += `&nbsp; <i class='fa'></i>`;
	e.querySelector("i").classList = e.dataset.dir
		? `fa fa-arrow-${e.dataset.dir == "ASC" ? "down" : "up"}`
		: "";
	console.log("SS");
	e.addEventListener("click", () => {
		console.log("SS");
		if (e.dataset.dir == "DESC") {
			delete e.dataset.dir;
		} else {
			e.dataset.dir = e.dataset.dir == "ASC" ? "DESC" : "ASC";
		}
		const urlParams = new URLSearchParams(window.location.search);
		if (e.dataset.dir) {
			urlParams.set(`sort[${e.dataset.field}]`, e.dataset.dir);
		} else {
			urlParams.delete(`sort[${e.dataset.field}]`);
		}
		if ("Turbo" in window) {
			let url = new URL(window.location.href);
			url.search = urlParams;
			Turbo.visit(url.href);
		} else {
			window.location.search = urlParams;
		}
	});
}

function init() {
	app = new Vue({ el: "#mount" });
	for (let element of document.querySelectorAll("th[data-field]")) {
		InitSortHeader(element);
	}
}
