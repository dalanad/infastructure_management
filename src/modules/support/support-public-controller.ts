import { SupportRequestTypeRepository } from "./support-request-type.repository";
import { Handle } from "../../lib/core";
import Joi from "joi";
import { Request, Response } from "express";
import { SupportRequestRepository } from "./support-request.repository";


export class SupportPublicController {

    constructor(
        private reqTypeRepo: SupportRequestTypeRepository,
        private supportRequestRepository: SupportRequestRepository) { }

    @Handle({ method: "get", path: "/", template: "support/desk/home" })
    async getAvailableRequestTypes(req: Request, res: Response) {
        res.locals.types = await this.reqTypeRepo.getAll();
    }

    @Handle({
        method: "get", path: "/:id", template: "support/desk/request-form",
        schema: {
            params: {
                id: Joi.number().required()
            }
        }
    })
    async getRequestTypeForm(req: Request, res: Response) {
        const requestType = await this.reqTypeRepo.getOne(parseInt(req.params.id));
        res.locals = { ...res.locals, ...requestType }
    }

    @Handle({
        method: "post", path: "/:id",
        schema: {
            params: {
                id: Joi.number().required()
            }
        }
    })
    async createSupportRequest(req: Request, res: Response) {
        let request = await this.supportRequestRepository.create(req.body)
        res.redirect("/support-desk/view/" + request.requestId + "/success/")
    }

    @Handle({ method: "get", path: "/view/:requestId/success", template: "support/desk/request-success" })
    async getSupportTicketSuccess(req: Request, res: Response) {
        res.locals.request = await this.supportRequestRepository.getOne(req.params.requestId)
    }

    @Handle({ method: "get", path: "/view/:requestId", template: "support/desk/request-view" })
    async getSupportTicket(req: Request, res: Response) {
        res.locals.layout = "base"
        res.locals.request = await this.supportRequestRepository.getOne(req.params.requestId)
    }

}