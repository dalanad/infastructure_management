import express from "express";
import { AuthUser } from "../db/entity";
import { encrypt, hash } from "../lib/core";
const router = express.Router();
import * as bcrypt from "bcryptjs";

router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.get("/forgot", (req, res) => {
	res.render("auth/forgot");
});

router.post("/forgot", (req, res) => {
	res.render("auth/forgot");
});

router.get("/logout", function (req, res) {
	res.cookie("id_token", "", { expires: new Date() });
	res.redirect("/auth/login");
});

router.post("/login", async (req, res, next) => {
	const user = await req.orm.em.findOne(AuthUser, {
		uid: String(req.body.uid).toLowerCase().trim(),
	});

	if (user && (await bcrypt.compare(req.body.password, user.password))) {
		res.cookie("id_token", await encrypt(JSON.stringify({ uid: user.uid })));
		res.redirect("/");
	} else {
		res.status(401).render("auth/login", { err: true });
	}
});

export const AuthRouter = router;
