import { SupportRequestTypeRepository } from "./support-request-type.repository";
import { Handle } from "../../lib/core";
import Joi from "joi";
import { Request, Response } from "express";


export class SupportPublicController {

    constructor(private reqTypeRepo: SupportRequestTypeRepository) { }

    @Handle({
        method: "get", path: "/:id", template: "support/request-form",
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
}