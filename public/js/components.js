let getPairs = (obj, keys = []) =>
	Object.entries(obj).reduce((pairs, [key, value]) => {
		if (typeof value === "object") pairs.push(...getPairs(value, [...keys, key]));
		else pairs.push([[...keys, key], value]);
		return pairs;
	}, []);

function objToQueryString(obj) {
	return getPairs(obj)
		.map(
			([[key0, ...keysRest], value]) => `${key0}${keysRest.map((a) => `[${a}]`).join("")}=${value}`
		)
		.join("&");
}

Vue.component("v-select", VueSelect.VueSelect);
Vue.component("filter-bar", {
	props: ["fields"],
	data: function () {
		let filtere = {};
		this.fields.forEach((element) => {
			filtere[element.name] = element.value;
		});
		return { filter: { ...filtere } };
	},
	template: `
        <div class="mb-2 align-items-end d-flex flex-wrap filter-bar">
            <div class="mr-2 mb-2" v-for="(field, index) in fields" :key="field.name">
                <span class="text-nowrap">{{field.label}}</span>
                <v-select @input="search" class="style-chooser" v-model="filter[field.name]" :options='field.options' label='name' :reduce="country =>
                    country.id" multiple ></v-select>
            </div>
        </div>
    `,
	methods: {
		search: function () {
			let filterx = this.filter;
			Object.keys(filterx).forEach((key) =>
				filterx[key] === undefined ? delete filterx[key] : {}
			);

			if ("Turbo" in window) {
				let url = new URL(window.location.href);
				url.search = objToQueryString({ filter: filterx });
				Turbo.visit(url.href);
			} else {
				window.location.search = objToQueryString({ filter: filterx });
			}
		},
	},
});
