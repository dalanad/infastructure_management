import { SupportController } from "./support.controller";
import { generateRouter } from "../../lib/core";
import { SupportRequestTypeRepository } from "./support-request-type.repository";
import { SupportConfigController } from "./support-config-controller";
import { SupportPublicController } from "./support-public-controller";


let supportRequestTypeRepository = new SupportRequestTypeRepository();

let supportController = new SupportController(supportRequestTypeRepository)
let supportConfigController = new SupportConfigController(supportRequestTypeRepository)
let supportPublicController = new SupportPublicController(supportRequestTypeRepository)

const router = generateRouter(supportController);

router.use("/config", generateRouter(supportConfigController))
router.use("/public", generateRouter(supportPublicController))

export const SupportModuleRouter = router
