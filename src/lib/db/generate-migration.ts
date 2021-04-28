import { InitORM } from "./init";
import { ORMLogger } from "./config";

(async () => {
	const orm = await InitORM();
	const migrator = orm.getMigrator();
	let migration = await migrator.createMigration();
	console.log(migration);
	ORMLogger.info("migration generated");
	process.exit(0);
})();
