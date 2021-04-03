import { Router } from "express";
import { ServicesJobRouter } from "./service-job.router";

const router = Router();

router.use("/jobs", ServicesJobRouter)

export const ServicingModuleRouter = router;
