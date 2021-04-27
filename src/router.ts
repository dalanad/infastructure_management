import { Router } from "express";
import { ServicingModuleRouter } from "./modules/servicing/router";
import { AssetModuleRouter } from "./modules/asset/router";
import { SettingsModuleRouter } from "./modules/settings/router";
import { CommonModuleRouter } from "./modules/common/router";
import { AuthModuleRouter } from "./modules/auth";
import { SupportModuleRouter } from "./modules/support";
import { guard } from "./middleware/authentication";

const route = Router();

route.all("/home", guard.authenticated, (req, res) => res.render("home"));
route.all("/", (req, res) => res.redirect("/home"));

route.use("/auth", AuthModuleRouter);
route.use("/servicing", guard.authenticated, ServicingModuleRouter);
route.use("/assets", guard.authenticated, AssetModuleRouter);
route.use("/settings", guard.authenticated, SettingsModuleRouter);
route.use(SupportModuleRouter);
route.use(CommonModuleRouter);

export const AppRouter = route;
