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

route.get("/asset-list", async (req, res) => {
 
	let data = await req.orm.em.getConnection("read").execute(`
        select 
            l.name "Location", a.asset_code, c.name "Category", m.name "Manufacturer", a.model "model", a.serial_no "Serial Number",
            (a.computer_ram::text  || 'GB' )"Computer RAM", a.computer_cpu "Computer CPU", (a.computer_hdd_capacity::text  || 'GB') "Computer HDD",
            a.net_ip, a.net_gateway, a.owner, s.company_name "Supplier" ,
            (
                SELECT string_agg( (JsonString::json -> 'name')::text,  ', ')
                FROM jsonb_array_elements(a.software) JsonString
            ) 
            "software"
        from asset a 
            inner join device_location l on l.id= a.location_id
            inner join device_category c on c.id= a.category_id
            inner join device_manufacturer m on m.id= a.manufacturer_id
            inner join supplier s on s.id= a.supplier_id
        order by a.asset_code
        `);
	res.render("asset/reports/report-view", {
		data: data,
		name: `Asset List`,
		config: { verticalHeaders: false },
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

route.get("/backup-assets", async (req, res) => {
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
            inner join device_category c on c.id= a.category_id and a.status='NOT_IN_USE'
        group by l.name order by l.name  
        `);

	let cat_totals = await req.orm.em.getConnection("read").execute(`
        select 
            'TOTAL (All Locations)', 
            ${asset_categories.map((e) => `COUNT(a.category_id) filter (where category_id = ${e.id}) as "${e.name}"`)},
            count(*) Total
        from asset a 
            inner join device_category c on c.id= a.category_id where a.status='NOT_IN_USE'
        `);

	data.push(cat_totals[0]);
	res.render("asset/reports/report-view", {
		data: data,
		name: "Backup Assets (STATUS=NOT IN USE)",
		config: { verticalHeaders: true },
	});
});

route.get("/service-time-analysis", async (req, res) => {


	let data = await req.orm.em.getConnection("read").execute(`
    select j.job_id "Job ID",
        a.asset_code "Asset Code",
        TO_CHAR( j.created_at, 'DD-MM-YYYY HH12:MI PM' ) created_Time,
        j.status,
        TO_CHAR(j.start, 'DD-MM-YYYY HH12:MI PM' ) "start",
        TO_CHAR( j.end, 'DD-MM-YYYY HH12:MI PM' ) "end",
        DATE_PART('day',(j.end::timestamp  - j.start::timestamp  )) + 1 "completion Time (days)",
        j.duration "Work duration (Min)",
        j.cost
    from service_job j 
        inner join asset a on a.id = j.asset_id 
    order by j.created_at desc
    `);
	res.render("asset/reports/report-view", {
		data: data,
		name: "Service Time Analysis",
		config: { verticalHeaders: true },
	});
});
export const AssetReportsRouter = route;
