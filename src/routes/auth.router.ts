import express from "express";
import { AuthUser } from "../db/entity";
import { encrypt, hash } from "../lib/core";
const router = express.Router();

router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.get("/logout", function (req, res) {
	res.cookie('id_token', '', { expires: new Date() });
	res.redirect("/auth/login");
});

router.post("/login", async (req, res, next) => {
	const user = await req.orm.em.findOne(AuthUser, { uid: String(req.body.uid).toLowerCase().trim() });
	if (user && hash(req.body.password) === user.password) {
		res.cookie('id_token', await encrypt(JSON.stringify({ uid: user.uid })));
		res.redirect("/");
	} else {
		res.render("auth/login", { err: true });
	}
});

export const AuthRouter = router;
