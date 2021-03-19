import { MikroORM } from "@mikro-orm/core";

declare global {
	namespace Express {
		interface Request {
			orm: MikroORM;
			login: any;
			session: any;
			user: any;
			logout();
		}
	}
}
