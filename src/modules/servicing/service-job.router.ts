import { Router } from "express";
import { Asset, JobStatus, ServiceJob, ServiceType } from "../../db/entity";
import { getNextVal, ID_SEQUENCES } from "../../lib/data";

const router = Router();

router.use("/", (req, res, next) => {
	res.locals.breadcrumbs.push({ name: "Service Jobs", link: "/servicing/jobs/" });
	next();
});

router.get("/", async (req, res) => {
	const params: any = {
		page: parseInt(String(req.query.page || "0")),
		size: parseInt(String(req.query.size || "10")),
		sort: req.query.sort ? Object.assign({}, req.query.sort) : { jobId: "desc" },
	};

	let [items, count] = await req.orm.em.findAndCount(
		ServiceJob,
		{},
		{
			limit: params.size,
			offset: params.page * params.size,
			orderBy: { ...params.sort },
		}
	);
	res.render("servicing/jobs-home", { items, total: count, ...params });
});

router.get("/create", async (req, res) => {
	res.locals.heading = "Create a Service Job";
	if (req.query.assetCode) {
		res.locals.asset = await req.orm.em.findOneOrFail(Asset, { assetCode: String(req.query.assetCode) });
	}
	res.render("servicing/job-form");
});

router.post("/create", async (req, res, next) => {
	try {
		const asset = await req.orm.em.findOneOrFail(Asset, req.body.asset);
		const job = req.orm.em.create(ServiceJob, {
			description: String(req.body.description),
			asset: asset,
			type: ServiceType.AD_HOC,
			location: asset.location,
			creationBy: req.user.uid,
		});
		job.jobId = await getNextVal(ID_SEQUENCES.JOB_ID, { prefix: "SJ" });
		req.orm.em.persist(job);
		await req.orm.em.flush();
		res.redirect(req.baseUrl + "/" + job.jobId);
	} catch (e) {
		next(e);
	}
});

router.get("/:jobId", async (req, res) => {
	let job = await req.orm.em.findOne(ServiceJob, { jobId: String(req.params.jobId) });
	res.render("servicing/job-view", { ...job });
});

router.get("/:jobId/complete", async (req, res) => {
	let job = await req.orm.em.findOne(ServiceJob, { jobId: String(req.params.jobId) });
	job.status = JobStatus.DONE;
	job.end = new Date();
	await req.orm.em.persist(job);
	await req.orm.em.flush();
	res.flash("success", "Job Completion Successfully Recorded");
	res.redirect(req.baseUrl + "/" + job.jobId);
});

router.get("/:jobId/discard", async (req, res) => {
	let job = await req.orm.em.findOne(ServiceJob, { jobId: String(req.params.jobId) });
	job.status = JobStatus.DISCARDED;
	await req.orm.em.persist(job);
	await req.orm.em.flush();
	res.flash("success", "Job  Successfully Discarded");
	res.redirect(req.baseUrl + "/" + job.jobId);
});

router.post("/:jobId", async (req, res) => {
	let job = await req.orm.em.findOne<ServiceJob>(ServiceJob, { jobId: String(req.params.jobId) });
	job.assign({ start: req.body.start, done: req.body.workDone, cost: req.body.cost, duration: req.body.duration });
	if (job.status == JobStatus.CREATED) {
		job.status = JobStatus.PENDING;
	}
	req.orm.em.persist(job);
	await req.orm.em.flush();
	res.flash("success", "Update Successful");
	res.redirect(req.baseUrl + "/" + job.jobId);
});
export const ServicesJobRouter = router;
