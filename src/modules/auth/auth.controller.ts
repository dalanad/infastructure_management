import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthUser } from "../../db/entity";
import { Handle } from "../../lib/core";


export class AuthController {

    constructor(private authService: AuthService) { }

    @Handle({
        method: "get", path: "/profile", template: "auth/profile",
        schema: {}
    })
    async profile(req: Request, res: Response) {
        res.locals.user = await req.orm.em.findOneOrFail(AuthUser, req.user.uid)
    }

    @Handle({ method: "get", path: "/login", template: "auth/login" })
    async getLogin(req: Request, res: Response) { }

    @Handle({ method: "post", path: "/login" })
    async login(req: Request, res: Response) {
        try {
            res.cookie("id_token", await this.authService.generateUserToken(req.body.uid, req.body.password));
            res.redirect("/");
        } catch (e) {
            console.log(e)
            res.status(401).render("auth/login", { err: true });
        }
    }

    @Handle({ method: "get", path: "/forgot", template: "auth/forgot" })
    async getForget(req: Request, res: Response) { }

    @Handle({ method: "post", path: "/forgot", template: "auth/forgot" })
    async postForget(req: Request, res: Response) { }

    @Handle({ method: "get", path: "/logout" })
    async logout(req: Request, res: Response) {
        res.cookie("id_token", "", { expires: new Date() });
        res.redirect("/auth/login");
    }

}