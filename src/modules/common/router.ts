import { Router } from "express";
import { ActivityFeedRouter } from "./activity-feed.router";
import { SuppliersRouter } from "./suppliers.router";
import { guard } from "./../../middleware/authentication";

const router = Router();

router.use("/feed", guard.authenticated, ActivityFeedRouter);
router.use("/suppliers", guard.authenticated, SuppliersRouter);

export const CommonModuleRouter = router;
