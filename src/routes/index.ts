import express from "express";

import { AssetCategoryRouter } from './asset-category.router';
import { AssetLocationRouter } from './asset-location.router';
import { AssetManufacturerRouter } from './asset-manufacturer.router';
import { AssetsRouter } from './assets.router';
import { AuthRouter } from "./auth.router";
import { SuppliersRouter } from "./suppliers.router";
import { UsersRouter } from "./users.router";
import { RolesRouter } from "./roles.router";

const route = express.Router();

route.all("/support", (req, res) => {
    res.render("home");
});

route.all("/home", (req, res) => {
    res.render("home");
});

route.all("/", (req, res) => res.redirect("/home"));

route.use("/auth", AuthRouter);
route.use("/suppliers", SuppliersRouter);
route.use("/assets-category", AssetCategoryRouter);
route.use("/assets-manufacturer", AssetManufacturerRouter);
route.use("/assets-location", AssetLocationRouter);
route.use("/assets", AssetsRouter);
route.use("/settings/", (req, res, next) => {
    res.locals.breadcrumbs.push({ name: "Settings", link: "/settings/users/" });
    next();
});
route.use("/settings/users", UsersRouter);
route.use("/settings/roles", RolesRouter);


export const AppRouter = route;