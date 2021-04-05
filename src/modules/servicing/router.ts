import { Router } from "express";
import { ServicesJobRouter } from "./service-job.router";

const router = Router();

router.use("/", (req, res, next) => {
    res.locals.breadcrumbs.push({ name: "Servicing & Maintenance", link: "/servicing/" });
    next();
});

router.use("/jobs", ServicesJobRouter)

router.get("/", (req, res) => {
    res.redirect("jobs")
})

export const ServicingModuleRouter = router;
