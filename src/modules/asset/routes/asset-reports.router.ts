import express from "express";

const route = express.Router();

route.get("/", async (req, res) => {
	res.render("asset/reports/report-list");
});

route.get("/asset-count-category", async (req, res) => {
	let asset_categories = await req.orm.em
		.getConnection("read")
		.execute(`select id,name from device_category order by name `);

	let data = await req.orm.em.getConnection("read").execute(`
        select 
            l.name "Location", 
            ${asset_categories.map((e) => `COUNT(a.category_id) filter (where category_id = ${e.id}) as "${e.name}"`)},
            count(*) Total
        from asset a 
            inner join device_location l on l.id= a.location_id
            inner join device_category c on c.id= a.category_id
        group by l.name order by l.name 
        `);

	let cat_totals = await req.orm.em.getConnection("read").execute(`
        select 
            'TOTAL(All Locations)', 
            ${asset_categories.map((e) => `COUNT(a.category_id) filter (where category_id = ${e.id}) as "${e.name}"`)},
            count(*) Total
        from asset a 
            inner join device_category c on c.id= a.category_id
        `);
        
	data.push(cat_totals[0]);
	res.render("asset/reports/report-view", {
		data: data,
		name: "Location Based Count of Category",
		config: { verticalHeaders: true },
	});
});

route.get("/asset-user-ip", async (req, res) => {
	let asset_categories = await req.orm.em
		.getConnection("read")
		.execute(`select id from device_category where networked=true`);
	let data = await req.orm.em.getConnection("read").execute(`
        select 
           a.asset_code,c.name "Category", l.name "Location", a.owner , a.net_ip
        from asset a 
            inner join device_location l on l.id= a.location_id
            inner join device_category c on c.id= a.category_id
        where a.net_ip ${req.query.noip ? "" : "!"}= ''  
		  and a.category_id in (${asset_categories.map((e) => e.id)})   
        order by a.asset_code
        `);
	res.render("asset/reports/report-view", {
		data: data,
		name: `User / IP Details ${req.query.noip ? "(Empty IP Devices)" : ""}`,
		config: { verticalHeaders: false },
	});
});

export const AssetReportsRouter = route;
