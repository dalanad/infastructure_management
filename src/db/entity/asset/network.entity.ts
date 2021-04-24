import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Asset } from "./asset";

@Entity()
export class Network {
	@PrimaryKey() id: number;
	@Property() description: string;
	@Property() cidr: string;
	// @OneToMany(() => Asset, "e => e.net.subnet")
	// assets: Asset[];
}
