import { decrypt, parseCookies } from "../lib/core";

export async function AuthGuard(req, res, next) {
    try {
        req.user = JSON.parse(await decrypt(parseCookies(req)["id_token"]));
    } catch (e) {
        if (![ "/auth/login/", "/auth/forgot/" ].includes(req.originalUrl)) {
            return res.redirect("/auth/login/");
        }
    }
    next();
}

