const session = require("express-session");
var FileStore = require("session-file-store")(session);
const status = {
	asset_status: {
		NOT_IN_USE: "warn",
		IN_USE: "success",
		IN_REPAIR: "danger",
	},
	asset_condition: { FUNCTIONAL: "success", BROKEN: "danger" },
	priority: {
		LOW: "success stale",
		NORMAL: "success  ",
		HIGH: "warn",
		URGENT: "danger",
	},
	bool: {
		true: "success",
		false: "danger",
	},

	ticket: {
		OPEN: "info  stale",
		BLOCKED: "danger  stale",
		RESOLVED: "success  stale",
		CLOSED: "warn  stale",
		WAITING: "info stale",
	},
};

function addAuth(app) {
	app.use(
		session({
			store: new FileStore({ path: require("path").join(require("os").tmpdir(), "sessions") }),
			secret: "sskeyboard cat",
			resave: true,
			saveUninitialized: true,
			// cookie: { secure: true, maxAge: 60000 },
		})
	);

	app.use((req, res, next) => {
		res.locals.frame = req.headers["turbo-frame"];
		if (!req.session.uid && req.originalUrl != "/auth/login/") {
			return res.redirect("/auth/login/");
		}
		res.locals.title = "Application";
		res.locals.tag = function name(type: string, str: string) {
			return `<span class="tag ${status[type][str]}">${String(str).replace(/_/g, " ")}</span>`;
		};
		next();
	});
}

export { addAuth };
