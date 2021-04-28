import { decrypt, parseCookies } from "../core";

export async function Authentication(req, res, next) {
	try {
		req.user = JSON.parse(await decrypt(parseCookies(req)["id_token"]));
		req.isLoggedIn = true;
	} catch (e) {}
	next();
}

export const guard = {
	authenticated: function (req, res, next) {
		if (req.user && req.isLoggedIn) {
			next();
		} else {
			return res.redirect("/auth/login/");
		}
	},
	task: (task: string) => (req, res, next) => {
		next();
	},
};
