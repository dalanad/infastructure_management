import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("support/home")
})
router.get("/config", (req, res) => {
    res.render("support/config")
})
export const SupportModuleRouter = router;
