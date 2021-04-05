import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UsersRepository } from "./users.repository";

const authService = new AuthService(new UsersRepository())

export async function login(req: Request, res: Response) {
    try {
        res.cookie("id_token", await authService.generateUserToken(req.body.uid, req.body.password));
        res.redirect("/");
    } catch (e) {
        console.log(e)
        res.status(401).render("auth/login", { err: true });
    }
}

export async function logout(req: Request, res: Response) {
    res.cookie("id_token", "", { expires: new Date() });
    res.redirect("/auth/login");
}

