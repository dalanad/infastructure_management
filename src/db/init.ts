import { MikroORM, RequestContext } from "@mikro-orm/core";
import { Asset, AssetLocation, AuthRole, AuthTask, AuthUser, Category, ComputerSpecifications, Contact, Manufacturer, Network, NetworkConfigurations, Organization, ServiceDoneBy, ServiceJob, ServiceSchedule, Supplier } from "./entity";

let orm: MikroORM;

async function InitORM() {
	if (orm) return orm;
	orm = await MikroORM.init({
		entities: [ AuthUser, AuthRole, AuthTask, Supplier, Contact, Organization, Asset, Manufacturer, AssetLocation, Category, ComputerSpecifications, NetworkConfigurations, ServiceSchedule, Network, ServiceJob, ServiceDoneBy ],
		type: "postgresql",
		clientUrl: "postgres://postgres:123@127.0.0.1:5432/itim",
		debug: false,
	});
	const migrator = orm.getMigrator();
	let migration = await migrator.createMigration("temp");
	console.log(migration)
	if (false &&  migration.diff.length > 0 && migration.diff[ 0 ] != '') {
		let migration = await migrator.createMigration();
		await migrator.up();
	}
	return orm;
}
InitORM();
async function InjectORM(req: any, res, next) {
	req.orm = await InitORM();
	RequestContext.create(req.orm.em, next);
}

export { InjectORM };

