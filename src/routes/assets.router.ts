import express from "express";
import { Asset, AssetLocation, Category, Manufacturer, Supplier } from "../db/entity";
import { objToQueryString } from "../lib/core";
import { getNextVal, ID_SEQUENCES } from "./../lib/data";
const route = express.Router();
// create-device
route.get("/", async (req, res) => {
	res.render("asset/asset-management-home");
});

route.get("/all", async (req, res) => {
	const params: any = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
		sort: Object.assign({}, req.query.sort),
		filter: Object.assign({}, req.query.filter)
	};

	if (params.filter.category) {
		params.filter.category = params.filter.category.map(x => Number(x))
	}

	if (params.filter.location) {
		params.filter.location = params.filter.location.map(x => Number(x))
	}

	res.locals.asset_categories = await req.orm.em.find(Category, {}, { fields: [ "id", "name" ], orderBy: { name: "asc" } });
	res.locals.asset_locations = await req.orm.em.find(AssetLocation, {}, { fields: [ "id", "name" ], orderBy: { name: "asc" } });
	res.locals.client_vars = { params }
	res.locals.filterConfig = [
		{ label: "Category", name: "category", options: res.locals.asset_categories, type: "select", value: params.filter.category },
		{ label: "Location", name: "location", options: res.locals.asset_locations, type: "select", value: params.filter.location }
	]

	let [ items, count ] = await req.orm.em.findAndCount(Asset, params.filter, { limit: params.size, offset: params.page * params.size, orderBy: { ...params.sort } });
	res.render("asset/asset-list", { items, total: count, ...params, sort: objToQueryString({ sort: params.sort, filter: params.filter }) });
});

// create-device
route.get("/create", async (req, res) => {
	res.locals.asset_categories = await req.orm.em.find(Category, {});
	res.locals.asset_locations = await req.orm.em.find(AssetLocation, {});
	res.locals.asset_suppliers = await req.orm.em.find(Supplier, {});
	res.locals.asset_manufacturers = await req.orm.em.find(Manufacturer, {});
	res.render("asset/asset-form");
});

route.post("/create", async (req, res) => {
	let asset = req.orm.em.create(Asset, req.body);
	try {
		// id generation not concurrent so re try if duplicates
		asset.assetCode = await getNextVal(ID_SEQUENCES.ASSET_CODE, { prefix: "D" })
		await req.orm.em.persistAndFlush(asset);
		res.redirect(303, req.baseUrl + '/all/');
	}
	catch (e) {
		console.log(e)
		let errors = {}
		res.locals.asset_categories = await req.orm.em.find(Category, {});
		res.locals.asset_locations = await req.orm.em.find(AssetLocation, {});
		res.locals.asset_suppliers = await req.orm.em.find(Supplier, {});
		res.locals.asset_manufacturers = await req.orm.em.find(Manufacturer, {});
		if (e.name == 'UniqueConstraintViolationException' && e.constraint == 'asset_serial_no_unique') {
			errors[ 'serialNo' ] = "Duplicate Serial Number ";
		}
		res.status(400).render("asset/asset-form", { errors, ...asset });
	}
});

// edit
route.get("/:id/edit", async (req: any, res) => {
	let asset = await req.orm.em.findOneOrFail(Asset, req.params.id);

	res.locals.asset_categories = await req.orm.em.find(Category, {});
	res.locals.asset_locations = await req.orm.em.find(AssetLocation, {});
	res.locals.asset_suppliers = await req.orm.em.find(Supplier, {});
	res.locals.asset_manufacturers = await req.orm.em.find(Manufacturer, {});

	res.render("asset/asset-form", { ...asset });
});

route.post("/:id/edit", async (req, res) => {
	let supplier = await req.orm?.em.findOne(Asset, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl + '/all/');
});

route.get("/:id", async (req: any, res) => {
	let asset = await req.orm.em.findOneOrFail(Asset, req.params.id);
	res.render("asset/asset-summery", { asset });
})

export const AssetsRouter = route;
