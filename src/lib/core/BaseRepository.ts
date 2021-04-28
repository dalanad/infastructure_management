import { orm as appORM } from "./../db/init";
import { MikroORM } from "@mikro-orm/core";

export abstract class BaseRepository {
	protected get orm() {
		if (this._orm) {
			return this._orm;
		} else {
			return appORM;
		}
	}

	constructor(private _orm?: MikroORM) {}
}
