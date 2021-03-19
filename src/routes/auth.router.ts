import express from "express";

const router = express.Router();
const passport = require("passport");

router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.get("/logout", function (req, res) {
	req.logout();
	req.session.destroy(function (err) {
		res.redirect("/auth/login");
	});
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		console.log(err);
		req.login(user, (err) => {
			console.log(err);
			return res.redirect("/suppliers");
		});
	})(req, res, next);
});

export const AuthRouter = router;
