import { createCipheriv, createDecipheriv, randomFill, scryptSync, randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";
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

let getPairs = (obj, keys = []) =>
	Object.entries(obj).reduce((pairs, [key, value]) => {
		if (typeof value === "object") pairs.push(...getPairs(value, [...keys, key]));
		else pairs.push([[...keys, key], value]);
		return pairs;
	}, []);

export function objToQueryString(obj) {
	return getPairs(obj)
		.map(
			([[key0, ...keysRest], value]) => `${key0}${keysRest.map((a) => `[${a}]`).join("")}=${value}`
		)
		.join("&");
}
