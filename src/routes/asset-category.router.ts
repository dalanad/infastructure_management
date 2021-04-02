import express from "express";
import { Category } from "../db/entity";

const route = express.Router();

route.get("/", async (req, res) => {
    const params = {
        page: parseInt(String(req.query.page || "0")),
        size: parseInt(String(req.query.size || "10")),
    };

    let [ items, count ] = await req.orm.em.findAndCount(
        Category,
        {},
        { limit: params.size, offset: params.page * params.size, orderBy: { id: "ASC" } }
    );
    res.render("asset/category/category-home", { items, total: count, ...params });
});

route.get("/options", async (req, res) => {
    let items = await req.orm.em.find(Category, { name: { $like: `%${ req.query.q || '' }%` } }, {
        orderBy: { name: "ASC" },
        fields: [ "name", "id" ]
    });
    res.json({ content: items.map(x => ({ value: x.id, label: x.name })) });
});

// create-device
route.get("/create", (req, res) => {
    res.render("asset/category/category-form");
});

route.post("/create", async (req, res) => {
    let asset = req.orm.em.create(Category, req.body);
    await req.orm.em.persistAndFlush(asset);
    res.redirect(303, req.baseUrl);
});

// edit
route.get("/:id/edit", async (req: any, res) => {
    let data = await req.orm.em.findOne(Category, req.params.id);
    res.render("asset/category/category-form", { ...data });
});

route.post("/:id/edit", async (req, res) => {
    let supplier = await req.orm?.em.findOne<Category>(Category, Number(req.params.id));
    supplier?.assign({
        name: req.body.name,
        computer: Boolean(req.body.computer),
        networked: Boolean(req.body.networked),
    });
    await req.orm?.em.flush();
    res.redirect(303, req.baseUrl);
});

route.get("/:id/delete", async (req: any, res) => {
    try {
        let entity = await req.orm.em.findOne(Category, req.params.id);
        await req.orm.em.remove(entity);
        await req.orm.em.flush();
        res.flash("success", "Successfully Deleted Category : " + entity.name)
    } catch (error) {
        res.flash("danger", `Deletion Failed : This Category has Assets registered`)
    } finally {
        res.redirect(303, req.baseUrl);
    }
});

export const AssetCategoryRouter = route;
