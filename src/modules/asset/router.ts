import { Router } from "express";
import { AssetsRouter } from "./routes/assets.router";
import { AssetCategoryRouter } from "./routes/asset-category.router";
import { AssetManufacturerRouter } from "./routes/asset-manufacturer.router";
import { AssetLocationRouter } from "./routes/asset-location.router";
import { AssetParentLocationRouter } from "./routes/asset-parent-location.router";
import { AssetReportsRouter } from "./routes/asset-reports.router";
const route = Router();

route.use("/", AssetsRouter);
route.use("/category", AssetCategoryRouter);
route.use("/manufacturer", AssetManufacturerRouter);
route.use("/location", AssetLocationRouter);
route.use("/parent-location", AssetParentLocationRouter);
route.use("/reports", AssetReportsRouter);

export const AssetModuleRouter = route;
