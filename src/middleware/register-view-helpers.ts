import { collapseRange, parseCookies } from "../lib/core";
import { join } from "path";

import nunjucks from "nunjucks";


const status = {
    asset_status: {
        NOT_IN_USE: "warn",
        IN_USE: "success",
        IN_REPAIR: "danger stale",
        DISCARDED: "danger",
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
        OPEN: "info",
        BLOCKED: "danger  stale",
        RESOLVED: "success  stale",
        CLOSED: "warn  stale",
        WAITING: "info stale",
    },

    job_status: {
        DONE: 'success',
        CREATED: 'info',
        PENDING: 'warn',
        DISCARDED: 'danger stale'
    },
};

function registerViewHelpers(req, res, next) {
    res.locals.frame = req.headers["turbo-frame"];
    // configure views
    req.app.set("view engine", "njk");

    let view_opts = {
        autoescape: false,
        lstripBlocks: true,
        trimBlocks: true,
        express: req.app,
        watch: true,
    };
    var env = nunjucks.configure(join(__dirname, "../../views"), view_opts);

    function DateFilter(value: Date) {
        if (!value) {
            return "";
        }
        return new Date(value).toLocaleString("sv").substr(0, 10);
    }

    try {
        res.locals.flash_msgs = JSON.parse(parseCookies(req)["flash_msg"]) || []
    } catch {
        res.locals.flash_msgs = []
    }
    let msgs = []
    res.flash = (level, msg) => {
        msgs.push({ level, msg })
    }
    env.addFilter("date", DateFilter);
    res.locals.title = "Zismith Mini ERP";
    res.locals.tag = function name(type: string, str: string, override: string) {
        return `<span class="tag ${ status[type][str] }">${ override || String(str).replace(/_/g, " ") }</span>`;
    };
    res.locals.breadcrumbs = [];
    res.locals.obj_status = status
    res.locals.collapseRange = collapseRange;
    res.locals.withParam = getWithParam(req.url, req.protocol + "://" + req.headers.host);
    let _writeHead = res.writeHead

    res.writeHead = function (statusCode) {
        res.cookie("flash_msg", JSON.stringify(msgs))
        _writeHead.apply(this, arguments)
    }
    next();

}

function getWithParam(urlstr: string, base) {
    return function (data) {
        let url = new URL(urlstr, base);
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key];
                url.searchParams.set(key, element);
                if (element == null) {
                    url.searchParams.delete(key);
                }
            }
        }
        return url.pathname + url.search;
    };
}

export { registerViewHelpers };
