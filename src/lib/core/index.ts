import { createCipheriv, createDecipheriv, scryptSync } from "crypto";
import * as bcrypt from "bcryptjs";
import express, { Router } from "express";
import { validate, ValidateSchema } from "../data";


const algorithm = "aes-192-cbc";
const password = "9bejJHkZScfVPVhT7n5XzWxTqh9Bcj";

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
const key = scryptSync(password, "salt", 24);
const iv = Buffer.from("77fce4a9f8d2128ae47f254ad4f01fc2", "hex");

export function encrypt(sourceData: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(sourceData, "utf8", "hex");
        encrypted += cipher.final("hex");
        resolve(encrypted);
    });
}

export function decrypt(encrypted: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const decipher = createDecipheriv(algorithm, key, iv);
            // Encrypted using same algorithm, key and iv.
            let decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");
            resolve(decrypted);
        } catch (e) {
            reject(new Error("INVALID"));
        }
    });
}

export async function hash(str: string) {
    const salt = "10";
    return await bcrypt.hash(str, 10);
}

export * from "./collapseRange";
export * from "./parseCookies";

export function getPairs(obj, keys = []) {
    return Object.entries(obj).reduce((pairs, [key, value]) => {
        if (typeof value === "object") {
            pairs.push(...getPairs(value, [...keys, key]));
        } else {
            pairs.push([[...keys, key], value]);
        }
        return pairs;
    }, []);
}

export function objToQueryString(obj) {
    return getPairs(obj)
        .map(([[key0, ...keysRest], value]) => `${ key0 }${ keysRest.map((a) => `[${ a }]`).join("") }=${ value }`)
        .join("&");
}

export interface Route {
    method: "get" | "post",
    path: string;
    template?: string
    handler?: Function
    middleware?: Function[],
    schema?: ValidateSchema
}

export function Handle(cfg: Route) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target._routes = [...(target._routes || []), { ...cfg, handler: propertyKey }]
    };
}

export function getRouter(x): Router {
    let _router = express.Router();
    for (const route of x._routes) {
        let handlers = []

        if (route.middleware) {
            handlers.push(...route.middleware)
        }

        if (route.schema) {
            handlers.push(validate(route.schema))
        }
        if (route.handler && !route.template) {
            handlers.push(x[route.handler].bind(x))
        }

        if (route.handler && route.template) {
            handlers.push(async (r, res, n) => {
                await x[route.handler](r, res, n)
                n()
            })
        }

        if (route.template) {
            handlers.push((req, res) => res.render(route.template))
        }

        _router[route.method](route.path, ...handlers)
    }
    return _router
}

