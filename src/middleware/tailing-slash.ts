export function AddTailingSlash(req, res, next) {
	res.set("Cache-Control", "public, max-age=0");

	if (req.path.indexOf("/js/") === -1 && req.path.indexOf("/css/") === -1) {
		if (req.path.substr(-1) !== "/") {
			res.redirect(301, req.url + "/");
			return; // returning here will skip the call to next() below
		}
	}
	// continue routing if we get here
	next();
}
