function SideBar(req, res, next) {
	res.locals.sidebar = [
		{ label: "Dashboard", href: "/home/", icon: "fa fa-home" },
		{
			label: "Assets", href: "/assets/", icon: "fa fa-sitemap", links: [
				{ label: "Locations", href: "/assets-location/" },
				{ label: "Category", href: "/assets-category/" },
				{ label: "Manufacturer", href: "/assets-manufacturer/" },
				{ label: "Suppliers", href: "/suppliers/" },
			],
		},
		{
			label: "Support",
			href: "/support/",
			icon: "fa fa-headset",
			links: undefined,
		},
	].map((x) => ({
		...x,
		active: req.url.includes(x.href) || x?.links?.map((link) => ({ ...link, active: req.url.includes(link.href) })).filter(x => x.active).length,
		links: x?.links?.map((link) => ({ ...link, active: req.url.includes(link.href) })),
	}));
	next();
}

export { SideBar };
