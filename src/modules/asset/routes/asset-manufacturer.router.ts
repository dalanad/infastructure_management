import express from "express";
import { Manufacturer } from "../../../lib/db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	// Object.assign(params, req.query);
	let [items, count] = await req.orm.em.findAndCount(
		Manufacturer,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("asset/manufacturer/manufacturer-home", { items, total: count, ...params });
});

// create-device
route.get("/create", (req, res) => {
	res.render("asset/manufacturer/manufacturer-form");
});

route.post("/create", async (req, res) => {
	let asset = req.orm.em.create(Manufacturer, req.body);
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/:id/edit", async (req: any, res) => {
	let data = await req.orm.em.findOne(Manufacturer, req.params.id);
	res.render("asset/manufacturer/manufacturer-form", { ...data });
});

route.post("/:id/edit", async (req, res) => {
	let supplier = await req.orm?.em.findOne<Manufacturer>(Manufacturer, Number(req.params.id));
	supplier?.assign({
		name: req.body.name,
		computer: Boolean(req.body.computer),
		networked: Boolean(req.body.networked),
	});
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

route.get("/:id/delete", async (req: any, res: any) => {
	try {
		let entity = await req.orm.em.findOneOrFail(Manufacturer, req.params.id);
		await req.orm.em.remove(entity);
		await req.orm.em.flush();
		res.flash("success", "Successfully Deleted Manufacturer : " + entity.name);
	} catch (error) {
		res.flash("danger", `Deletion Failed : There are Assets which use this Manufacturer`);
	} finally {
		res.redirect(303, req.baseUrl);
	}
});
export const AssetManufacturerRouter = route;
