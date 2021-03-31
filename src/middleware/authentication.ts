import { decrypt, parseCookies } from "../lib/core";


export async function AuthGuard(req, res, next) {
    try {
        req.user = await decrypt(parseCookies(req)["id_token"]);
        next();
    } catch (e) {
        if (![ "/auth/login/", "/auth/forgot/" ].includes(req.originalUrl)) {
            return res.redirect("/auth/login/");
        }
    }
}

