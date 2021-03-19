import express from "express";
import { Category } from "../db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	// Object.assign(params, req.query);
	let [ items, count ] = await req.orm.em.findAndCount(
		Category,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("asset/category/category-home", { items, total: count, ...params });
});

// create-device
route.get("/create", (req, res) => {
	res.render("asset/category/category-form");
});

route.post("/create", async (req, res) => {
	let asset = req.orm.em.create(Category, req.body);
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/edit/:id", async (req: any, res) => {
	let data = await req.orm.em.findOne(Category, req.params.id);
	res.render("asset/category/category-form", { ...data });
});

route.post("/edit/:id", async (req, res) => {
	let supplier = await req.orm?.em.findOne<Category>(Category, Number(req.params.id));
	supplier?.assign({ name: req.body.name, computer: Boolean(req.body.computer), networked: Boolean(req.body.networked) });
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const AssetCategoryRouter = route;
