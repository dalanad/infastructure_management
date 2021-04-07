import express from "express";
import * as authController from './auth.controller'
import { AuthUser } from "../../db/entity";

const router = express.Router();


router.get("/login", (req, res) => res.render("auth/login"));
router.post("/login", authController.login);

// reset pw
router.get("/forgot", (req, res) => res.render("auth/forgot"));
router.post("/forgot", (req, res) => res.render("auth/forgot"));

// preferences
router.get("/profile", async (req, res) => {
    res.locals.user = await req.orm.em.findOneOrFail(AuthUser, req.user.uid)
    res.render("auth/profile")
});
router.post("/profile", (req, res) => res.render("auth/profile"));

router.get("/logout", authController.logout);

export const AuthModuleRouter = router;
