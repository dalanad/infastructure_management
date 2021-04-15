import { BaseRepository, Handle } from "../../lib/core";
import { Request, Response } from "express";
import Joi from "joi";
import { SupportRequestTypeRepository } from "./support-request-type.repository";


export class SupportConfigController {
    
    constructor(private reqTypeRepo: SupportRequestTypeRepository) { }

    @Handle({ method: "get", path: "", template: "support/config" })
    async getConfigurationPage(req: Request, res: Response) {
        res.locals.items = await this.reqTypeRepo.getAll()
    }

    @Handle({ method: "get", path: "/create", template: "support/request-type" })
    async getRequestTypeForm(req: Request, res: Response) { }

    @Handle({ method: "post", path: "/create" })
    async postRequestTypeForm(req: Request, res: Response) {
        await this.reqTypeRepo.create(req.body);
        res.redirect(302, req.baseUrl + "")
    }

    @Handle({
        method: "get", path: "/:id", template: "support/request-type",
        schema: {
            params: {
                id: Joi.number().required()
            }
        }
    })
    async getRequestTypeEditForm(req: Request, res: Response) {
        const requestType = await this.reqTypeRepo.getOne(parseInt(req.params.id));
        res.locals = { ...res.locals, ...requestType }
    }

    @Handle({
        method: "post", path: "/:id",
        schema: {
            params: {
                id: Joi.number().required()
            },
            body: {
                name: Joi.string().required().trim().min(2),
                fields: Joi.array().items({
                    name: Joi.string().trim(true),
                    type: Joi.string().trim(true),
                    order: Joi.number(),
                    requestType: Joi.number().empty('').default(null)
                })
            }
        }
    })
    async postRequestTypeEditForm(req: Request, res: Response) {
        await this.reqTypeRepo.save(parseInt(req.params.id), req.body);
        res.redirect(302, req.baseUrl + "")
    }
}