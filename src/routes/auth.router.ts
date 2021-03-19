import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		res.redirect("/auth/login");
	});
});

router.post("/login", (req, res, next) => {
	const users = [{ id: "2f24vvg", email: "test@test.com", password: "password" }];
	const user = users[0];
	if (req.body.username === user.email && req.body.password === user.password) {
		req.session.uid = user.id;
		req.session.save()
		res.redirect("/");
	} else {
		res.render("auth/login", { err: true });
	}
});

export const AuthRouter = router;
