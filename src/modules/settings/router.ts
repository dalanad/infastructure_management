import { Router } from "express";
import { UsersRouter } from "./users.router";
import { RolesRouter } from "./roles.router";

const route = Router();

route.use("/", (req, res, next) => {
    res.locals.breadcrumbs.push({ name: "Settings", link: "/settings/users/" });
    next();
});

route.use("/users", UsersRouter);
route.use("/roles", RolesRouter);

export const SettingsModuleRouter = route;
