import { collapseRange, decrypt, parseCookies } from "../lib/core";

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

	app.use(async (req, res, next) => {
		res.locals.frame = req.headers[ "turbo-frame" ];
		try {
			req.user = await decrypt(parseCookies(req)[ "id_token" ])
		} catch {
			if (![ "/auth/login/", "/auth/forgot/" ].includes(req.originalUrl)) {
				return res.redirect("/auth/login/");
			}
		}
		res.locals.title = "IT Management";
		res.locals.tag = function name(type: string, str: string) {
			return `<span class="tag ${status[ type ][ str ]}">${String(str).replace(/_/g, " ")}</span>`;
		};
		res.locals.collapseRange = collapseRange;
		next();
	});
}

export { addAuth };

