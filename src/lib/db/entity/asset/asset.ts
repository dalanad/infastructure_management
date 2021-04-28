import {
	AfterUpdate,
	Cascade,
	Embedded,
	Entity,
	Enum,
	EventArgs,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Utils,
} from "@mikro-orm/core";
import { AssetLocation, Category, Manufacturer } from "./base";
import { ComputerSpecifications } from "./computerSpecifications";
import { NetworkConfigurations } from "./networkConfigurations";
import { ServiceJob } from "./service-job";
import { Supplier } from "../supplier.entity";
import { BaseEntity } from "../base.entity";
import { orm } from "../../init";
import { ChangeSetContent } from "../activity-feed/activity-feed";
import { postActivity } from "../../../../modules/common/activity-feed";
import { AuthUser } from "../auth/auth-user.entity";

export enum AssetStatus {
	NOT_IN_USE = "NOT_IN_USE",
	IN_USE = "IN_USE",
	IN_REPAIR = "IN_REPAIR",
	DISCARDED = "DISCARDED",
}

export enum AssetCondition {
	FUNCTIONAL = "FUNCTIONAL",
	BROKEN = "BROKEN",
}

@Entity()
export class Asset extends BaseEntity {
	@PrimaryKey()
	id: number;

	@Property({ unique: true })
	assetCode: string;

	@Property()
	model: string;

	@Property({ unique: true })
	serialNo: string;

	@ManyToOne((t) => Manufacturer, { eager: true })
	manufacturer: Manufacturer;

	@ManyToOne((t) => Category, { eager: true })
	category: Category;

	@ManyToOne((_) => AssetLocation, { eager: true })
	location: AssetLocation;

	@Property()
	spec: string;

	@ManyToOne(() => Supplier, { eager: true })
	supplier: Supplier;

	@Property({ default: 0 })
	warranty: number;

	@Property({ nullable: true })
	datePurchased: Date;

	@Property({ nullable: true })
	dateCommissioned: Date;

	@Property({ nullable: true })
	stickerPrinted: Date;

	@Property({ nullable: true })
	DISCARDED: Date;

	@Property({ nullable: true })
	decommissionReason: string;

	@Property({ nullable: false, default: 0 })
	expectedLifespan: number;

	@Property({ nullable: false, default: 0 })
	purchaseCost: number;

	@Property({ nullable: true, default: "" })
	owner: string;

	@Property({ nullable: false, default: "" })
	purchaseOrderNo: string;

	@Property({ nullable: false, default: "" })
	grnNo: string;

	@Property({ columnType: "jsonb", nullable: true, default: "[]" })
	software: any;

	@Enum(() => AssetStatus)
	status: AssetStatus = AssetStatus.IN_USE;

	@Enum(() => AssetCondition)
	condition: AssetCondition = AssetCondition.FUNCTIONAL;

	@Embedded(() => ComputerSpecifications)
	computer: ComputerSpecifications;

	@Embedded(() => NetworkConfigurations)
	net: NetworkConfigurations;

	@OneToMany(() => ServiceSchedule, (e) => e.asset, { cascade: [Cascade.ALL], eager: true })
	schedule: ServiceSchedule[];

	get warrantyEnd() {
		let date = this.datePurchased;
		date.setMonth(date.getMonth() + this.warranty);
		return date;
	}

	get onWarranty() {
		return this.warrantyEnd > new Date();
	}

	@AfterUpdate()
	async update(params: EventArgs<any>) {
		let cs = params.changeSet;
		const pl = { ...cs.payload };

		delete pl.updatedAt;
		delete pl.createdAt;
		let mapping = {
			assetCode: "Asset Code",
			serialNo: "Serial No",
			spec: "Specifications",
			warranty: "Warranty Duration",
			datePurchased: "Date Purchased",
			dateCommissioned: "Date Commissioned",
			stickerPrinted: "Sticker Printed Date",
			discarded: "Discarded Date",
			decommissionReason: "Discarding Reason",
			expectedLifespan: "Expected Life Span",
			purchaseCost: "Purchase Cost",
			purchaseOrderNo: "Purchase Order No",
			grnNo: "GRN No",
			software: "software",
			computer: "computer",
			net: "net",
		};
		let transform = {};
		let ctx: ChangeSetContent[] = [];

		Object.keys(pl).forEach((field) => {
			if (pl[field] || cs.originalEntity[field]) {
				if (mapping[field]) {
					ctx.push({ afi: pl[field], bfi: cs.originalEntity[field], field: mapping[field] });
				} else {
					ctx.push({ afi: pl[field], bfi: cs.originalEntity[field], field: field });
				}
			}
		});
		let user_ref;
		try {
			user_ref = orm.em.getReference(AuthUser, orm.em.getFilterParams("user").uid);
		} catch {
		} finally {
			setTimeout(async () => {
				await postActivity(`${cs.name}-${Utils.extractPK(params.entity)}`, {
					content: ctx,
					meta: { action: "updated" },
					user: user_ref,
				});
				orm.em.flush();
			}, 1000);
		}
	}
}

@Entity()
export class ServiceSchedule {
	@PrimaryKey()
	id: number;

	@ManyToOne(() => Asset)
	asset: Asset;

	serviceJobs: ServiceJob[];

	@Property()
	interval: number;

	@Property()
	description: string;

	@Property()
	active: boolean;
}
