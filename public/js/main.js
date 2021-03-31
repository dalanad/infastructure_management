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
                localStorage.getItem("sidebar-mode") === "open" ? "collapsed" : "open"
            );
            sidebar.classList.toggle("collapsed");
        });
    }
    sidebar.addEventListener("mouseenter", function name(params) {
        if (localStorage.getItem("sidebar-mode") === "collapsed") {
            sidebar.classList.remove("collapsed");
        }
    });
    sidebar.addEventListener("mouseleave", function name(params) {
        if (localStorage.getItem("sidebar-mode") === "collapsed") {
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
        if (e.dataset.dir) {
            params({[`sort[${e.dataset.field}]`]: e.dataset.dir});
        } else {
            params({[`sort[${e.dataset.field}]`]: null});
        }
    });
}

function init() {
    // app = new Vue({ el: "#mount" });
    InitSidebar();
    for (let element of document.querySelectorAll("th[data-field]")) {
        InitSortHeader(element);
    }
}

function params(data) {
    let url = new URL(window.location.href);
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const element = data[key];
            url.searchParams.set(key, element);
            if (element == null) {
                url.searchParams.delete(key);
            }
        }
    }
    visit(url.href);
}

function visit(url) {
    if ("Turbo" in window) {
        Turbo.visit(url);
    } else {
        window.location = url;
    }
}

window.visit = visit;
window.params = params;
