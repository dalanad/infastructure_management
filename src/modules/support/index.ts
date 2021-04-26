import { SupportController } from "./support.controller";
import { generateRouter } from "../../lib/core";
import { SupportRequestTypeRepository } from "./support-request-type.repository";
import { SupportConfigController } from "./support-config-controller";
import { SupportPublicController } from "./support-public-controller";
import { SupportRequestRepository } from "./support-request.repository";
import { Router } from "express";
import { guard } from "../../middleware/authentication";

let supportRequestTypeRepository = new SupportRequestTypeRepository();
let supportRequestRepository = new SupportRequestRepository();

let supportConfigController = new SupportConfigController(supportRequestTypeRepository);
let supportPublicController = new SupportPublicController(supportRequestTypeRepository, supportRequestRepository);
let supportController = new SupportController(supportRequestRepository);

const router = Router();

router.use("/support/", guard.authenticated, generateRouter(supportController));
router.use("/support/config", guard.authenticated, generateRouter(supportConfigController));
router.use("/support-desk", generateRouter(supportPublicController));

export const SupportModuleRouter = router;
