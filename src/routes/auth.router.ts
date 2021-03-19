import express from "express";

const router = express.Router();

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

	const users = [ { id: "2f24vvg", email: "test@test.com", password: "password" } ];
	const user = users[ 0 ];
	if (req.body.email === user.email && req.body.password === user.password) {
		req.session.uid = user.id;
		res.redirect("/");
	}
	res.render("auth/login", { err: true });
});

export const AuthRouter = router;
