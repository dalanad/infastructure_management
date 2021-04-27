import { Request, Response } from "express";
import { Handle } from "../../lib/core";
import { SupportRequestRepository } from "./support-request.repository";
import Joi from "joi";
import { SupportRequest } from "../../db/entity";

export class SupportController {
	middleware = [
		(req, res, next) => {
			res.locals.breadcrumbs.push({ name: "Support Desk", link: "/support/" });
			next();
		},
	];

	constructor(private supportRequestRepository: SupportRequestRepository) {}

	@Handle({ method: "get", path: "/", template: "support/home" })
	async getHomePage(req: Request, res: Response) {
		const params: any = {
			page: parseInt(String(req.query.page || "0")),
			size: parseInt(String(req.query.size || "10")),
			sort: req.query.sort ? Object.assign({}, req.query.sort) : { requestId: "desc" },
		};

		let [items, count] = await req.orm.em.findAndCount(
			SupportRequest,
			{},
			{
				limit: params.size,
				offset: params.page * params.size,
				orderBy: { ...params.sort },
				populate: ["requestType"],
			}
		);

		Object.assign(res.locals, { total: count, ...params });

		res.locals.requests = items;

		if (req.query.view) {
			res.locals.request = await this.supportRequestRepository.getOne(String(req.query.view));
		}
	}

	@Handle({
		method: "get",
		path: "/:id/update",
		schema: { query: { status: Joi.string(), priority: Joi.string() } },
	})
	async UpdateRequest(req: Request, res: Response) {
		try {
			let entity = await this.supportRequestRepository.save(req.params.id, req.query);
			res.flash("success", "Successfully Updated Request : " + entity.requestId);
		} catch (error) {
			console.log(error);
			res.flash("danger", `Update  Failed `);
		} finally {
			res.redirect(303, req.get("Referer"));
		}
	}
}
