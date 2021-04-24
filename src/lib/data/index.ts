import { LockMode } from "@mikro-orm/core";
import { Config } from "../../db/entity";
import { orm } from "../../db/init";

export * from "./validator";

enum ID_SEQUENCES {
	ASSET_CODE = "ASSET_CODE_SEQUENCE",
	JOB_ID = "JOB_ID",
	SUPPORT_REQ = "SUPPORT_REQ",
}

async function getSequence(
	sequence: ID_SEQUENCES,
	creation_options: { prefix: string },
	lock = false
): Promise<Config> {
	let config = await orm.em.findOne(
		Config,
		{ id: sequence },
		{ lockMode: lock ? LockMode.PESSIMISTIC_WRITE : undefined }
	);

	if (config == null) {
		config = orm.em.create(Config, { id: sequence, data: { prefix: creation_options.prefix || "", currentVal: 0 } });
	}
	return config;
}

async function getNextVal(sequence: ID_SEQUENCES, creation_options: { prefix: string }) {
	let config = await getSequence(sequence, creation_options);

	config.data.currentVal = Number(config.data.currentVal) + 1;
	orm.em.persist(config);
	return `${config.data.prefix}` + `${config.data.currentVal}`.padStart(6, "0");
}

async function peekNextVal(sequence: ID_SEQUENCES, creation_options: { prefix: string }) {
	let config = await getSequence(sequence, creation_options);
	return `${config.data.prefix}` + `${Number(config.data.currentVal) + 1}`.padStart(6, "0");
}

export { getNextVal, peekNextVal, ID_SEQUENCES };
