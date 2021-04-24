import { SupportRequestType } from "./support-request-type";
import {
	AfterUpdate,
	Collection,
	Entity,
	Enum,
	EventArgs,
	IdentifiedReference,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Utils,
} from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { SupportRequestField } from "./support-request.field";
import { ChangeSetContent } from "../activity-feed/activity-feed";
import { orm } from "../../init";
import { AuthUser } from "../auth/auth-user.entity";
import { postActivity } from "../../../modules/common/activity-feed";

export enum RequestStatus {
	OPEN = "OPEN",
	RESOLVED = "RESOLVED",
	CLOSED = "CLOSED",
	BLOCKED = "BLOCKED",
	WAITING = "WAITING",
}

export enum RequestPriority {
	LOW = "LOW",
	NORMAL = "NORMAL",
	HIGH = "HIGH",
	URGENT = "URGENT",
}

@Entity()
export class SupportRequest extends BaseEntity {
	@PrimaryKey()
	requestId: string;

	@ManyToOne(() => SupportRequestType)
	requestType: IdentifiedReference<SupportRequestType>;

	@OneToMany(() => SupportRequestField, (o) => o.request)
	data: Collection<SupportRequestField>;

	@Enum(() => RequestStatus)
	status: RequestStatus = RequestStatus.OPEN;

	@Enum(() => RequestPriority)
	priority: RequestPriority = RequestPriority.NORMAL;

	@AfterUpdate()
	async update(params: EventArgs<any>) {
		let cs = params.changeSet;
		const pl = { ...cs.payload };

		delete pl.updatedAt;
		delete pl.createdAt;
		let mapping = {};
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
