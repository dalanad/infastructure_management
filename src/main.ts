import compression from "compression";
import express from "express";
import nunjucks from "nunjucks";
import { join } from "path";
import { AddTailingSlash } from "./middleware/tailing-slash";
import { InjectORM } from "./db/init";
import { Logger } from "./lib/logging";
import { SideBar } from "./middleware/sidebar";
import { addAuth } from "./middleware/authentication";
import {
	AuthRouter,
	SuppliersRouter,
	AssetsRouter,
	AssetCategoryRouter,
	AssetLocationRouter,
	AssetManufacturerRouter,
} from "./routes";

async function bootstrap() {
	const app = express();

	app.use(express.urlencoded({ extended: true }));

	// configure views
	app.set("view engine", "njk");

	var env = nunjucks.configure(join(__dirname, "views"), {
		autoescape: false,
		express: app,
		watch: true,
	});

	function DateFilter(value: Date) {
		return value.toISOString().substr(0, 10);
	}

	env.addFilter("date", DateFilter);
	app.use(compression());

	app.use(
		express.static(
			join(__dirname, "../", "public") /* {cacheControl: true, immutable: true,  maxAge: 3600000}*/
		)
	);
	addAuth(app);

	app.use(AddTailingSlash);
	app.use(InjectORM);
	app.use(SideBar);

	app.use("/auth", AuthRouter);
	app.use("/suppliers", SuppliersRouter);
	app.use("/assets-category", AssetCategoryRouter);
	app.use("/assets-manufacturer", AssetManufacturerRouter);
	app.use("/assets-location", AssetLocationRouter);
	app.use("/assets", AssetsRouter);

	app.all("/home", (req, res) => {
		res.render("home");
	});
	app.all("/", (req, res) => res.redirect("/home"));

	app.use(function (req, res) {
		res.status(404).render("error", { status_code: 404 });
	});

	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(500).send("Something broke!");
	});

	app.listen(process.env.PORT || 3000, () => {
		Logger.info("Listening");
	});
}

bootstrap();
