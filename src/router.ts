import { Router } from "express";
import { ServicingModuleRouter } from "./modules/servicing/router";
import { AssetModuleRouter } from "./modules/asset/router";
import { SettingsModuleRouter } from "./modules/settings/router";
import { CommonModuleRouter } from "./modules/common/router";
import { AuthModuleRouter } from "./modules/auth";
import { SupportModuleRouter } from "./modules/support";


const route = Router();

route.all("/home", (req, res) => res.render("home"));
route.all("/", (req, res) => res.redirect("/home"));

route.use("/auth", AuthModuleRouter);
route.use("/servicing", ServicingModuleRouter);
route.use("/assets", AssetModuleRouter);
route.use("/settings", SettingsModuleRouter);
route.use(SupportModuleRouter);
route.use(CommonModuleRouter)

export const AppRouter = route;