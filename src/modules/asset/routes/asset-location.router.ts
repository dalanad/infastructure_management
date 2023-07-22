import express from "express";
import { AssetLocation, Category } from "../../../lib/db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
		sort: Object(req.query.sort ? Object.assign({}, req.query.sort) : { id: "DESC" }),
	};

	let [items, count] = await req.orm.em.findAndCount(
		AssetLocation,
		{},
		{
			populate: ['parent'],
			limit: params.size,
			offset: params.page * params.size,
			orderBy: { ...params.sort },
		}
	);
	res.render("asset/location/location-home", { items, total: count, ...params });
});

route.get("/options", async (req, res) => {
	let items = await req.orm.em.find(
		AssetLocation,
		{ name: { $like: `%${req.query.q || ""}%` } },
		{
			orderBy: { name: "ASC" },
			fields: ["name", "id"],
		}
	);
	res.json({ content: items.map((x) => ({ value: x.id, label: x.name })) });
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
route.get("/:id/edit", async (req: any, res) => {
	let data = await req.orm.em.findOne(AssetLocation, req.params.id);
	res.render("asset/location/location-form", { ...data });
});

route.post("/:id/edit", async (req, res) => {
	let supplier = await req.orm?.em.findOne<AssetLocation>(AssetLocation, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

route.get("/:id/delete", async (req: any, res: any) => {
	try {
		let supplier = await req.orm.em.findOne(AssetLocation, req.params.id);
		await req.orm.em.remove(supplier);
		await req.orm.em.flush();
		res.flash("success", "Deletion Successful");
	} catch (error) {
		res.flash("danger", "Deletion Failed : There are assets in this location");
	} finally {
		if (req.header("Referer")) return res.redirect(req.header("Referer"));
		res.redirect(303, req.baseUrl);
	}
});

export const AssetLocationRouter = route;
