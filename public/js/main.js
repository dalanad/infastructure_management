import "./helpers.js";
import "./components.js";


document.addEventListener("turbo:load", () => init(), false);
let app;

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
            localStorage.setItem("sidebar-mode", localStorage.getItem("sidebar-mode") === "open" ? "collapsed" : "open");
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

function InitSortHeaders() {
    for (let e of document.querySelectorAll("th[data-field]")) {
        e.classList.add("sort-header");
        e.dataset.dir = new URLSearchParams(window.location.search).getAll(`sort[${ e.dataset.field }]`);
        let i = document.createElement("i")
        e.appendChild(i)
        i.classList = e.dataset.dir ? `fa fa-arrow-${ e.dataset.dir === "ASC" ? "down" : "up" }` : "";
        e.addEventListener("click", () => {
            if (e.dataset.dir == "DESC") {
                delete e.dataset.dir;
            } else {
                e.dataset.dir = e.dataset.dir == "ASC" ? "DESC" : "ASC";
            }
            if (e.dataset.dir) {
                params({ [`sort[${ e.dataset.field }]`]: e.dataset.dir });
            } else {
                params({ [`sort[${ e.dataset.field }]`]: null });
            }
        });
    }
}

function autoSizeTextarea() {
    /* textarea auto resize*/
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
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

function confirmAction() {
    document.querySelectorAll('[confirm-action]').forEach(el => {

        el.addEventListener("click", e => {
            if (!e.target.dataset.confirmed) {
                e.preventDefault();
                MicroModal.show('modal-confirm', {
                    awaitCloseAnimation: true, onClose: (modal, el, ev) => {
                        if (ev.target.dataset["micromodalClose"] === "confirm") {
                            console.log(ev.target.dataset["micromodalClose"]);
                            e.target.dataset.confirmed = "yes";
                            let event;
                            event = document.createEvent("HTMLEvents");
                            event.initEvent("click", true, true);
                            event.eventName = "click";
                            e.target.dispatchEvent(event);
                        }
                    }
                });
            } else {
                delete e.target.dataset.confirmed;
            }
        })
    })
}

function selectBoxes() {
    document.querySelectorAll('select.init-select').forEach(select => {
        let container = document.createElement("div")
        container.innerHTML = `
            <v-select :options="options" @input="setSelected" class="styled" :multiple="multiple" :clearable="clear" v-model="val" :reduce="c => c.value">
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching"> 
                      <div> No results found</div> 
<!--                  <div><button type="button" class="btn link">Create Option</button></div>-->
                    </template>
                  <span style="opacity: 0.5;" v-else>Start typing to search  </span>
                </template>
            </v-select>`
        select.parentNode.insertBefore(container, select)
        let options = Array.from(select.options).map(o => ({ value: o.value, label: o.innerHTML }))
        let selected = select.value;
        select.style.display = 'none'
        app = new Vue({
            mounted: function () {
                if (select.dataset.url) {
                    fetch(select.dataset.url).then(res => res.json()).then(e => {
                        this.options = e.content
                    })
                }
                if (select.dataset["allowClear"]) {
                    this.clear = true
                }
                if (select.dataset["multiple"]) {
                    this.multiple = true
                }
            }, methods: {
                setSelected: function () {
                    if (Array.from(select.options).filter(o => o.value === this.val).length === 0) {
                        let option = document.createElement("option");
                        option.value = this.val
                        select.appendChild(option);
                    }
                    select.value = this.val
                }
            }, el: container, data: { options, val: selected, clear: false, multiple: false },
        });

    })
}

function FormValidation() {
    document.querySelectorAll('form').forEach(form => {
        var pristine = new Pristine(form, { // class of the parent element where the error/success class is added
            classTo: 'field', errorClass: 'p-error', successClass: 'suscwcess', // class of the parent element where error text element is appended
            errorTextParent: 'field', // type of element to create for the error text
            errorTextTag: 'span', errorTextClass: 'field-msg text-danger'
        });

        form.addEventListener('submit', function (e) {
            if (!pristine.validate()) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    })

}

function init() {
    // app = new Vue({ el: "#mount" });
    FormValidation();
    InitSidebar();
    autoSizeTextarea();
    InitSortHeaders();
    selectBoxes();

}


