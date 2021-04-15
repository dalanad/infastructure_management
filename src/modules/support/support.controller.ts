import { Request, Response } from "express";
import { Handle } from "../../lib/core";
import { SupportRequestTypeRepository } from "./support-request-type.repository";


export class SupportController {

    constructor(private reqTypeRepo: SupportRequestTypeRepository) { }

    @Handle({ method: "get", path: "/", template: "support/home" })
    async getHomePage(req: Request, res: Response) { }

}