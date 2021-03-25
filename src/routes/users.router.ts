import express from "express";
import { AuthRole, AuthUser } from "../db/entity";
import { hash } from "../lib/core";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};
	let [ items, count ] = await req.orm.em.findAndCount(
		AuthUser,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("settings/users/users-list", { items, total: count, ...params });
});

route.get("/create", async (req, res) => {
	let roles = await req.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
	res.render("settings/users/user-form", { roles });
});

route.post("/create", async (req, res) => {
	req.body.password = hash(req.body.password)
	let asset = req.orm.em.create(AuthUser, req.body);
	asset.uid = String(asset.uid).toLowerCase().trim()
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/edit/:id", async (req: any, res) => {
	let data = await req.orm.em.findOne(AuthUser, req.params.id);
	let roles = await req.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
	delete data.password
	res.render("settings/users/user-form", { ...data, roles });
});

route.post("/edit/:id", async (req, res) => {
	let entity = await req.orm?.em.findOne<AuthUser>(AuthUser, { uid: req.params.id });
	entity?.assign({ name: req.body.name, isActive: parseInt(req.body.isActive), email: req.body.email });
	if (req.body.password) {
		entity.password = await hash(req.body.password);
	}
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const UsersRouter = route;
