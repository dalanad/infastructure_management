import express from "express";
import { Asset, AssetLocation, Category, Manufacturer, Supplier } from "../db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	// Object.assign(params, req.query);
	let [items, count] = await req.orm.em.findAndCount(
		Asset,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("asset/asset-home", { items, total: count, ...params });
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
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/edit/:id", async (req: any, res) => {
	let asset = await req.orm.em.findOne(Asset, req.params.id);

	res.locals.asset_categories = await req.orm.em.find(Category, {});
	res.locals.asset_locations = await req.orm.em.find(AssetLocation, {});
	res.locals.asset_suppliers = await req.orm.em.find(Supplier, {});
	res.locals.asset_manufacturers = await req.orm.em.find(Manufacturer, {});

	res.render("asset/asset-form", { ...asset });
});

route.post("/edit/:id", async (req, res) => {
	let supplier = await req.orm?.em.findOne(Asset, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const AssetsRouter = route;
