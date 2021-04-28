import { BaseEntity } from "../base.entity";
import { AuthRole } from "./auth-role.entity";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class AuthUser extends BaseEntity {
	@PrimaryKey()
	uid: string;

	@Property({ unique: true })
	email: string;

	@Property({ nullable: false, columnType: "varchar" })
	avatar = "/assets/static/avatar/avatar-male.jpg";

	@Property({ hidden: true })
	password: string;

	@Property({ nullable: true })
	name: string;

	@Property({ nullable: false, default: true })
	isActive: boolean;

	@Property({ nullable: false, default: false })
	emailVerified: boolean;

	@Property({ nullable: true, hidden: true })
	resetCode?: number;

	@ManyToOne({ eager: true, cascade: [] })
	role: AuthRole;
}
