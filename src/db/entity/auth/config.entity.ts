import { BaseEntity } from "../base.entity";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "auth_config" })
export class Config extends BaseEntity {
	@PrimaryKey()
	id: number;

	@Property()
	token: string;

	@Property({ type: "jsonb" })
	data: Record<string, unknown>;
}
