import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "auth_org" })
export class Organization {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property({ default: "" })
	address: string;

	@Property({ default: "" })
	telephone: string;

	@Property({ default: "/assets/static/store.svg", columnType: "varchar" })
	logo!: any;
}
  