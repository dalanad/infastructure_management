import { Request, Response } from "express";
import { Handle } from "../../lib/core";
import { SupportRequestRepository } from "./support-request.repository";
import Joi from "joi";


export class SupportController {
    middleware = [(req, res, next) => {
        res.locals.breadcrumbs.push({ name: "Support Desk", link: "/support/" });
        next();
    }]

    constructor(private supportRequestRepository: SupportRequestRepository) { }

    @Handle({ method: "get", path: "/", template: "support/home" })
    async getHomePage(req: Request, res: Response) {
        res.locals.requests = await this.supportRequestRepository.getAll();

        if (req.query.view) {
            res.locals.request = await this.supportRequestRepository.getOne(String(req.query.view))
        }
    }

    @Handle({ method: "get", path: "/:id/update", schema: { query: { status: Joi.string(), priority: Joi.string() } } })
    async UpdateRequest(req: Request, res: Response) {
        try {
            let entity = await this.supportRequestRepository.save(req.params.id, req.query);
            res.flash("success", "Successfully Updated Request : " + entity.requestId)
        } catch (error) {
            console.log(error)
            res.flash("danger", `Update  Failed `)
        } finally {
            res.redirect(303, req.get("Referer"));
        }
    }

}