import express from "express";
import { AssetLocation } from "../db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	// Object.assign(params, req.query);
	let [ items, count ] = await req.orm.em.findAndCount(
		AssetLocation,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("asset/location/location-home", { items, total: count, ...params });
});

// create-device
route.get("/create", (req, res) => {
	res.render("asset/location/location-form");
});

route.post("/create", async (req, res) => {
	let asset = req.orm.em.create(AssetLocation, req.body);
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/edit/:id", async (req: any, res) => {
	let data = await req.orm.em.findOne(AssetLocation, req.params.id);
	res.render("asset/location/location-form", { ...data });
});

route.post("/edit/:id", async (req, res) => {
	let supplier = await req.orm?.em.findOne<AssetLocation>(AssetLocation, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const AssetLocationRouter = route;
