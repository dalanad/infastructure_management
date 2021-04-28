import express from "express";
import { AuthRole, AuthTask } from "../../lib/db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	let [items, count] = await req.orm.em.findAndCount(
		AuthRole,
		{},
		{ limit: params.size, offset: params.page * params.size }
	);
	res.render("settings/roles/roles-list", { items, total: count, ...params });
});

route.get("/create", async (req, res) => {
	let tasks_list = await req.orm.em.find(AuthTask, {}, { orderBy: { id: "ASC" } });
	res.render("settings/roles/role-form", { tasks_list });
});

route.post("/create", async (req, res) => {
	let asset = req.orm.em.create(AuthRole, req.body);
	await req.orm.em.persistAndFlush(asset);
	res.redirect(303, req.baseUrl);
});

// edit
route.get("/edit/:id", async (req: any, res) => {
	let data: AuthRole = await req.orm.em.findOne(AuthRole, req.params.id);
	await data.tasks.init();
	let active_task_ids = data.tasks.getIdentifiers();
	let tasks_list = await req.orm.em.find(AuthTask, {}, { orderBy: { id: "ASC" } });
	res.render("settings/roles/role-form", { ...data, tasks_list, active_task_ids });
});

route.post("/edit/:id", async (req, res) => {
	console.log(req.body);
	let supplier = await req.orm?.em.findOne<AuthRole>(AuthRole, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const RolesRouter = route;
