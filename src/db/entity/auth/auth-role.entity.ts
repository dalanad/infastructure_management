import { BaseEntity } from "../base.entity";
import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class AuthRole extends BaseEntity {
	@PrimaryKey()
	id: number;

	@Property()
	name: string;

	@Property({ columnType: "boolean" })
	editable = true;

	@Property({ nullable: true })
	description: string;

	@ManyToMany({ entity: () => AuthTask })
	tasks = new Collection<AuthTask>(this);
}

@Entity()
export class AuthTask {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property({ nullable: true })
	moduleId?: string;
}
