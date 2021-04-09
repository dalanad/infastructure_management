import { AssetLocation } from './base';
import { Asset, ServiceSchedule } from "./asset";
import { ServiceDoneBy } from "./service-done-by";
import { AuthUser } from "../auth/auth-user.entity";
import {
    AfterUpdate,
    Entity,
    Enum,
    EventArgs,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
    Utils
} from '@mikro-orm/core';
import { BaseEntity } from "./../base.entity";
import { orm } from "../../init";
import { ChangeSetContent } from "../activity-feed/activity-feed";
import { postActivity } from "../../../modules/common/activity-feed";

export enum JobStatus {
    CREATED = "CREATED", DONE = "DONE", PENDING = "PENDING", DISCARDED = "DISCARDED"
}

export enum ServiceType {
    ON_REQUEST = 'ON_REQUEST', AD_HOC = 'AD_HOC', ROUTINE = 'ROUTINE'
}

@Entity()
export class ServiceJob extends BaseEntity {

    @PrimaryKey()
    jobId: string;

    @Property({ default: '', nullable: true })
    done: string;

    @Property({ default: '', nullable: true })
    description: string;

    @Enum(() => ServiceType)
    type: ServiceType;

    @Property({ default: JobStatus.CREATED }) status: JobStatus;

    @ManyToOne(() => Asset, { eager: true }) asset: Asset;
    @ManyToOne(() => AssetLocation, { eager: true }) location: AssetLocation;

    @OneToMany(() => ServiceDoneBy, u => u.service, { nullable: true, eager: true })
    doneBy: ServiceDoneBy[];

    @Property({ nullable: true }) start: Date;
    @Property({ nullable: true }) end: Date;

    @Property({ nullable: true }) cost: number;
    @Property({ default: 0 }) duration: number;

    @ManyToOne(() => AuthUser, { eager: true })
    creationBy: AuthUser;


    schedule: ServiceSchedule;

    @AfterUpdate()
    async update(params: EventArgs<any>) {
        let cs = params.changeSet;
        const pl = { ...cs.payload };

        delete pl.updatedAt;
        delete pl.createdAt;
        let mapping = {
            start: "Start Time",
            end: "Completed Time ",
        }

        let transform = {}

        let ctx: ChangeSetContent[] = []

        Object.keys(pl).forEach((field) => {
            if (pl[field] || cs.originalEntity[field]) {
                if (mapping[field]) {
                    ctx.push({ afi: pl[field], bfi: cs.originalEntity[field], field: mapping[field] })
                } else {
                    ctx.push({ afi: pl[field], bfi: cs.originalEntity[field], field: field })
                }
            }
        });
        let user_ref;
        try {
            user_ref = orm.em.getReference(AuthUser, orm.em.getFilterParams('user').uid)
        } catch {

        } finally {
            setTimeout(async () => {
                await postActivity(`${ cs.name }-${ Utils.extractPK(params.entity) }`, {
                    content: ctx,
                    meta: { action: "updated" },
                    user: user_ref
                })
                orm.em.flush()
            }, 5)
        }

    }
}

