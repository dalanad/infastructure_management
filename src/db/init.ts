import { MemoryCacheAdapter, MikroORM, RequestContext } from "@mikro-orm/core";
import {
	Asset,
	AssetLocation,
	AuthRole,
	AuthTask,
	AuthUser,
	Category,
	ComputerSpecifications,
	Config,
	Contact,
	Manufacturer,
	Network,
	NetworkConfigurations,
	Organization,
	ServiceDoneBy,
	ServiceJob,
	ServiceSchedule,
	Supplier,
} from "./entity";

let orm: MikroORM;

async function getORM() {
	if (orm) return orm;
	orm = await MikroORM.init({
		entities: [
			AuthUser,
			AuthRole,
			AuthTask,
			Supplier,
			Contact,
			Organization,
			Asset,
			Manufacturer,
			AssetLocation,
			Category,
			ComputerSpecifications,
			NetworkConfigurations,
			ServiceSchedule,
			Network,
			ServiceJob,
			ServiceDoneBy, Config
		],
		type: "postgresql",
		clientUrl: "postgres://postgres:abc123@127.0.0.1:5432/itim",
		debug: false,
	});
	const migrator = orm.getMigrator();

	await migrator.up();

	let migration = await migrator.createMigration("temp");
	if (false && migration.diff.length > 0 && migration.diff[ 0 ] != "") {
		let migration = await migrator.createMigration();
		await migrator.up();
	}
	return orm;
}
getORM();
async function InjectORM(req: any, res, next) {
	req.orm = await getORM();
	RequestContext.create(req.orm.em, next);
}

export { InjectORM, getORM };
