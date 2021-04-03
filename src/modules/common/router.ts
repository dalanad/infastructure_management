import { Router } from "express";
import { ActivityFeedRouter } from "./activity-feed.router";
import { SuppliersRouter } from "./suppliers.router";

const router = Router();

router.use("/feed", ActivityFeedRouter);
router.use("/suppliers", SuppliersRouter);

export const CommonModuleRouter = router;
