import express from "express";
import * as authController from './auth.controller'

const router = express.Router();


router.get("/login", (req, res) => res.render("auth/login"));
router.get("/forgot", (req, res) => res.render("auth/forgot"));
router.post("/forgot", (req, res) => res.render("auth/forgot"));

router.get("/logout", authController.logout);
router.post("/login", authController.login);

export const AuthModuleRouter = router;
