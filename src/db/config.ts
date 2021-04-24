import { Connection, IDatabaseDriver, Options } from "@mikro-orm/core";
import {
	Activity,
	ActivityFeed,
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
	SupportRequest,
	SupportRequestField,
	SupportRequestTypeField,
	SupportRequestType,
} from "./entity";
import { Logger } from "../lib/logging";

const ORMLogger = new Logger("orm");

const ORMConfig: Options<IDatabaseDriver<Connection>> = {
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
		ServiceDoneBy,
		Config,
		Activity,
		ActivityFeed,
		SupportRequest,
		SupportRequestField,
		SupportRequestTypeField,
		SupportRequestType,
	],
	type: "postgresql",
	clientUrl: process.env.DATABASE_URL || "postgres://postgres:abc123@127.0.0.1:5432/itim",
	debug: false,
	logger: ORMLogger.info,
	migrations: { emit: "js", pattern: /^[\w-]+\d+\.js$/ },
};

export { ORMConfig, ORMLogger };
