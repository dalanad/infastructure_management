import wrap from "./vendor/vue-wc-wrapper.min.js";
import { VueSelect } from "./vendor/vue-select";

Vue.component("v-select", VueSelect);

import { FilterBarComponent } from './components/filter-bar'


const CustomElement = wrap(Vue, FilterBarComponent);

window.customElements.define("filter-bar", CustomElement);
