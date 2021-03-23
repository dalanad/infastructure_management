import express from "express";
import nunjucks from "nunjucks";
import { join } from "path";
import { InjectORM } from "./db/init";
import { Logger } from "./lib/logging";
import { addAuth } from "./middleware/authentication";
import { CompressionMiddleware } from "./middleware/compression";
import { SideBar } from "./middleware/sidebar";
import { AddTailingSlash } from "./middleware/tailing-slash";
import { AppRouter } from "./routes";

async function bootstrap() {
	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.disable('x-powered-by')

	// configure views
	app.set("view engine", "njk");

	let view_opts = { autoescape: false, express: app, watch: true }
	var env = nunjucks.configure(join(__dirname, "../views"), view_opts);

	function DateFilter(value: Date) {
		if (!value) return ""
		return value.toISOString().substr(0, 10);
	}

	env.addFilter("date", DateFilter);

	app.use(CompressionMiddleware);
	let staticOpts = { cacheControl: true, immutable: true, maxAge: 3600000 }
	app.use(express.static(join(__dirname, "../public")));

	addAuth(app);
	app.use(AddTailingSlash, InjectORM, SideBar);
	app.use(AppRouter) 
	app.use(function (req, res) {
		res.status(404).render("error", { status_code: 404 });
	});

	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(500).render("error", { status_code: 500 });
	});

	app.listen(process.env.PORT || 3000, () => {
		Logger.info("Listening");
	});
}

bootstrap();
