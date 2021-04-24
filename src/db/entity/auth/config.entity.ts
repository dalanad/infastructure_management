import { BaseEntity } from "../base.entity";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "sys_config" })
export class Config extends BaseEntity {
	@PrimaryKey()
	id: string;

	@Property({ type: "jsonb" })
	data: Record<string, unknown>;
}
