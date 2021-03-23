import "https://cdn.jsdelivr.net/npm/vue-select@3.11.2/dist/vue-select.min.js";
import "./helpers.js";
import "./components.js";

document.addEventListener("turbo:load", () => afterLoad(), false);
let app;
function afterLoad() {
	init();
}
function InitSidebar() {
	const sidebar = document.querySelector(".sidebar");
	if (!sidebar) return;
	if (!localStorage.getItem("sidebar-mode")) {
		localStorage.setItem("sidebar-mode", "open");
	} else {
		sidebar.classList.add(localStorage.getItem("sidebar-mode"));
	}

	let toggle = document.querySelector(".sidebar-toggle");
	if (toggle) {
		toggle.addEventListener("click", function () {
			localStorage.setItem(
				"sidebar-mode",
				localStorage.getItem("sidebar-mode") == "open" ? "collapsed" : "open"
			);
			sidebar.classList.toggle("collapsed");
		});
	}
	sidebar.addEventListener("mouseenter", function name(params) {
		if (localStorage.getItem("sidebar-mode") == "collapsed") {
			sidebar.classList.remove("collapsed");
		}
	});
	sidebar.addEventListener("mouseleave", function name(params) {
		if (localStorage.getItem("sidebar-mode") == "collapsed") {
			sidebar.classList.add("collapsed");
		}
	});
	sidebar.addEventListener("transitionend", function () {
		window.dispatchEvent(new Event("resize"));
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
	e.addEventListener("click", () => {
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
	InitSidebar();
	for (let element of document.querySelectorAll("th[data-field]")) {
		InitSortHeader(element);
	}
}
