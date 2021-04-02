import wrap from "./vendor/vue-wc-wrapper.min.js";
import { VueSelect } from "./vendor/vue-select";

let getPairs = (obj, keys = []) =>
    Object.entries(obj).reduce((pairs, [key, value]) => {
        if (typeof value === "object") pairs.push(...getPairs(value, [...keys, key]));
        else pairs.push([[...keys, key], value]);
        return pairs;
    }, []);

export function objToQueryString(obj) {
    console.log(obj);
    return getPairs(obj)
        .map(
            ([[key0, ...keysRest], value]) => `${key0}${keysRest.map((a) => `[${a}]`).join("")}=${value}`
        )
        .join("&");
}

Vue.component("v-select", VueSelect);
let FilterBarComponent = {
    props: ["fields_data"],
    data: function () {

        return {
            fields: [],
            filter: {},
        };
    },
    template: `
        <div class="mb-2" style="display:flex; align-items:flex-end;flex-wrap:wrap">
		  <link href="https://cdn.jsdelivr.net/gh/dalanad/helix@0.0.14/dist/helix.css" rel="stylesheet">
		  <link href="https://cdn.jsdelivr.net/npm/vue-select@3.11.2/dist/vue-select.css" rel="stylesheet">
		  <link href="/css/main.css" rel="stylesheet">
            <div class="me-2 mb-2" v-for="(field, index) in fields" :key="field.name">
                <span class="text-nowrap">{{field.label}}</span>
                <v-select class="style-chooser" 
                        v-if="field.type=='select'" 
                        v-bind:multiple="field.multiple || false" 
                        v-model="filter[field.name]" 
                        :options='fields[index].options' 
                        label='label' :reduce="o =>  o.value"
                        @search="fetchOptions($event,index)"
                        >
                </v-select>
                <input  v-if="field.type=='text'" type="search" class="ctrl" v-model="filter[field.name]">    
            </div>
            <button @click="search" class="btn mb-2 ">Filter</button>
        </div>
    `,
    methods: {
        search: function () {
            let filterx = this.filter;
            Object.keys(filterx).forEach((key) =>
                filterx[key] === undefined || filterx[key] === null ? delete filterx[key] : {}
            );

            if ("Turbo" in window) {
                let url = new URL(window.location.href);
                url.search = objToQueryString({filter: filterx});
                Turbo.visit(url.href);
            } else {
                window.location.search = objToQueryString({filter: filterx});
            }
        },
        fetchOptions: function (event, index) {
        }
    },
    mounted: function () {
        let filter_obj = {};
        if (this.fields_data) {
            this.fields = JSON.parse(this.fields_data);
            this.fields.forEach((element) => {
                filter_obj[element.name] = element.value;
            });
        }
        this.filter = {...filter_obj}
        this.fields.forEach((field, index) => {
            if (field.url) {
                fetch(field.url).then(res => res.json()).then(e => {
                    this.fields[index].options = e.content
                })
            }
        })
    }
};


const CustomElement = wrap(Vue, FilterBarComponent);

window.customElements.define("filter-bar", CustomElement);
