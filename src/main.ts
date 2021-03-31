import express from "express";
import nunjucks from "nunjucks";
import { join } from "path";
import { InjectORM } from "./db/init";
import { Logger } from "./lib/logging";
import { AuthGuard } from "./middleware/authentication";
import { CompressionMiddleware } from "./middleware/compression";
import { SideBar } from "./middleware/sidebar";
import { AddTailingSlash } from "./middleware/tailing-slash";
import { AppRouter } from "./routes";
import { registerViewHelpers } from "./middleware/register-view-helpers";

async function bootstrap() {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.disable("x-powered-by");

    // configure views
    app.set("view engine", "njk");

    let view_opts = {
        autoescape: false,
        lstripBlocks: true,
        trimBlocks: true,
        express: app,
        watch: true,
    };
    var env = nunjucks.configure(join(__dirname, "../views"), view_opts);

    function DateFilter(value: Date) {
        if (!value) return "";
        return new Date(value).toISOString().substr(0, 10);
    }

    env.addFilter("date", DateFilter);

    app.use(CompressionMiddleware);
    let staticOpts = { cacheControl: true, immutable: true, maxAge: 3600000 };
    app.use(express.static(join(__dirname, "../public")));

    app.use(AddTailingSlash, AuthGuard, InjectORM, registerViewHelpers, SideBar);
    app.use(AppRouter);
    app.use(function (req, res) {
        res.status(404).render("error", { status_code: 404, msg: "Page Not Found" });
    });

    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(500).render("error", { status_code: 500, msg: "Internal Server Error" });
    });

    app.listen(process.env.PORT || 3000, () => {
        Logger.info("Listening");
    });
}

bootstrap();
