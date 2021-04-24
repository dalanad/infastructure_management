import express from "express";
import { AuthRole, AuthUser } from "../../db/entity";
import { hash } from "../../lib/core";
import { validate } from "../../lib/data";
import Joi from "joi";

const route = express.Router();

route.get(
	"/",
	validate({
		params: {
			page: Joi.number().min(0).default(0),
			size: Joi.number().min(0).default(10),
		},
	}),
	async (req, res) => {
		const { size, page }: any = req.params;
		let [items, count] = await req.orm.em.findAndCount(
			AuthUser,
			{},
			{
				limit: size,
				offset: page * size,
				orderBy: { uid: "asc" },
			}
		);
		res.render("settings/users/users-list", { items, total: count, size, page });
	}
);

route.get("/create", async (req, res) => {
	let roles = await req.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
	res.render("settings/users/user-form", { roles });
});

route.post(
	"/create",
	validate({
		body: {
			uid: Joi.string().trim(true).min(6).lowercase().required(),
			password: Joi.string().min(6).max(30).required(),
			name: Joi.string().trim(),
			email: Joi.string().email({}),
			role: Joi.number().integer(),
			isActive: Joi.boolean().falsy("0").truthy("1").default(true),
		},
	}),
	async function (req, res) {
		req.body.password = hash(req.body.password);
		let asset = req.orm.em.create(AuthUser, req.body);
		await req.orm.em.persistAndFlush(asset);
		res.redirect(303, req.baseUrl);
	}
);

// edit
route.get("/edit/:id", async (req: any, res) => {
	let data = await req.orm.em.findOne(AuthUser, req.params.id);
	let roles = await req.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
	delete data.password;
	res.render("settings/users/user-form", { ...data, roles });
});

route.post(
	"/edit/:uid",
	validate({
		body: {
			uid: Joi.string().trim(true).min(6).lowercase().required(),
			password: Joi.string().allow("").min(6).max(30).empty("").default(null),
			name: Joi.string().trim(),
			email: Joi.string().email({}),
			role: Joi.number().integer(),
			isActive: Joi.boolean().falsy("0").truthy("1").default(true),
		},
		params: {
			uid: Joi.string().trim(true).min(6).lowercase().required(),
		},
		onError: async (e, req, res) => {
			let roles = await req.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
			res.locals.flash_msgs.push({
				level: "danger",
				msg: `<b>Validation Error Occured </b><br/><ul class="mt-2 mb-0"> ${e.details
					.map((er) => "<li>" + er.message + "</li>")
					.join("")}</li></ul>`,
			});
			res.status(400).render("settings/users/user-form", { ...req.body, errors: e.details, roles });
		},
	}),
	async (req, res) => {
		let entity = await req.orm?.em.findOneOrFail<AuthUser>(AuthUser, { uid: req.params.uid });
		entity?.assign({ name: req.body.name, isActive: req.body.isActive, email: req.body.email });
		if (req.body.password) {
			entity.password = await hash(req.body.password);
		}
		await req.orm?.em.flush();
		res.redirect(303, req.baseUrl);
	}
);

export const UsersRouter = route;
