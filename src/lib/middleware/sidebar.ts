function SideBar(req, res, next) {
	res.locals.sidebar = [
		{ label: "Home", href: "/home/", icon: "fa fa-home" },
		{
			label: "Assets",
			href: "/assets/",
			icon: "fa fa-sitemap",
			links: [
				{ label: "Assets", href: "/assets/all/" },
				{ label: "Locations", href: "/assets/location/" },
				{ label: "Category", href: "/assets/category/" },
				{ label: "Manufacturer", href: "/assets/manufacturer/" },
				{ label: "Suppliers", href: "/suppliers/" },
				{ label: "Reports", href: "/assets/reports/" },
			],
		},
		// { label: "Support", href: "/support/", icon: "fa fa-headset", links: undefined },
		{ label: "Servicing", href: "/servicing/", icon: "fa fa-tools", links: undefined },
		{
			label: "Settings",
			href: "/settings/users",
			icon: "fa fa-cog",
			links: [
				{ label: "Users", href: "/settings/users/" },
				{ label: "Roles", href: "/settings/roles/" },
				{ label: "Parent Locations", href: "/assets/parent-location/" },
			],
		},
	].map((x) => ({
		...x,
		active:
			req.url.includes(x.href) ||
			x?.links?.map((link) => ({ ...link, active: req.url.includes(link.href) })).filter((x) => x.active).length,
		links: x?.links?.map((link) => ({ ...link, active: req.url.includes(link.href) })),
	}));
	next();
}

export { SideBar };
