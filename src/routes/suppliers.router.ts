import express from "express";
import { Supplier } from "../db/entity";
import { Form } from "../lib/forms/index";

let SupplierForm = () =>
	new Form({
		fields: {
			displayName: { label: "Display Name" },
			companyName: { label: "Company Name" },
			contactName: { label: "Contact Person" },
			creditPeriod: { label: "Credit Period", type: "number" },
			contactInfo: new Form({
				title: "Contact Information",
				fields: {
					email: { label: "Email", type: "email" },
					address: { label: "Address" },
					city: { label: "City" },
					phone: { label: "Phone", type: "number" },
					mobile: { label: "Mobile", type: "number" },
				},
			}),
		},
	});

const route = express.Router();

route.get("/", async (req, res) => {
	const params = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
	};

	// Object.assign(params, req.query);
	let [items, count] = await req.orm.em.findAndCount(
		Supplier,
		{},
		{ limit: params.size, offset: params.page * params.size, orderBy: { id: "ASC" } }
	);
	res.render("asset/supplier/home", { items, total: count, ...params });
});
route.get("/list", async (req, res) => {
	let [items, count] = await req.orm.em.findAndCount(
		Supplier,
		{},
		{ orderBy: { displayName: "ASC" } }
	);
	res.json({ results: items.map((x) => ({ id: x.id, text: x.displayName })), total: count });
});
// create-device
route.get("/create", (req, res) => {
	res.render("asset/supplier/create-supplier", { form: SupplierForm().toObject() });
});

route.post("/create", async (req, res) => {
	let supplier = new Supplier();
	supplier.assign(req.body);
	req.orm.em.persist(supplier);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});
// edit
route.get("/:id/delete", async (req: any, res) => {
	try {
		let supplier = await req.orm.em.findOne(Supplier, req.params.id);
		await req.orm.em.remove(supplier);
		await req.orm.em.flush();
	} catch (error) {
	} finally {
		if (req.header("Referer")) return res.redirect(req.header("Referer"));
		res.redirect(303, req.baseUrl);
	}
});

// edit
route.get("/:id/edit", async (req: any, res) => {
	let form = SupplierForm();
	form.value = await req.orm.em.findOne(Supplier, req.params.id);
	res.render("asset/supplier/create-supplier", { form: form.toObject() });
});

route.post("/:id/edit", async (req, res) => {
	let supplier = await req.orm?.em.findOne(Supplier, Number(req.params.id));
	supplier?.assign(req.body);
	await req.orm?.em.flush();
	res.redirect(303, req.baseUrl);
});

export const SuppliersRouter = route;
