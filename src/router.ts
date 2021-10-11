import { Request, Router } from "express";
import { ServicingModuleRouter } from "./modules/servicing/router";
import { AssetModuleRouter } from "./modules/asset/router";
import { SettingsModuleRouter } from "./modules/settings/router";
import { CommonModuleRouter } from "./modules/common/router";
import { AuthModuleRouter } from "./modules/auth";
import { SupportModuleRouter } from "./modules/support";
import { guard } from "./lib/middleware/authentication";
import { Asset } from "./lib/db/entity";

const route = Router();

route.all("/home", guard.authenticated, home);
route.all("/", (req, res) => res.redirect("/home"));

route.use("/auth", AuthModuleRouter);
route.use("/servicing", guard.authenticated, ServicingModuleRouter);
route.use("/assets", guard.authenticated, AssetModuleRouter);
route.use("/settings", guard.authenticated, SettingsModuleRouter);
route.use(SupportModuleRouter);
route.use(CommonModuleRouter);

export const AppRouter = route; 

async function home(req: Request, res) {
	let result = await req.orm.em.getConnection().execute("select status, count(*) from asset group by status ");
	let asset_status = [result.map((e) => e.status), result.map((e) => e.count)];
	res.render("home", { asset_status });
}
