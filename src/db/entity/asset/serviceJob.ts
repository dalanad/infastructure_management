import { AssetLocation } from './base';
import { Asset, ServiceSchedule } from "./asset";
import { ServiceDoneBy } from "./serviceDoneBy";
import { AuthUser } from "../auth/auth-user.entity";
import { Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from "./../base.entity";

export enum JobStatus {
    CREATED = "CREATED", DONE = "DONE", PENDING = "PENDING", DISCARDED = "DISCARDED"
}

export enum ServiceType {
    ON_REQUEST = 'ON_REQUEST', AD_HOC = 'AD_HOC', ROUTINE = 'ROUTINE'
}

@Entity()
export class ServiceJob extends BaseEntity {

    @PrimaryKey() id: number;
    @Property({ default: '', nullable: true }) done: string;
    @Property({ default: '', nullable: true }) todo: string;
    @Enum(() => ServiceType) type: ServiceType;

    @Property({ default: JobStatus.CREATED }) status: JobStatus;

    @ManyToOne(() => Asset, { eager: true }) device: Asset;
    @ManyToOne(() => AssetLocation, { eager: true }) location: AssetLocation;

    @OneToMany(() => ServiceDoneBy, u => u.service, { nullable: true, eager: true })
    doneBy: ServiceDoneBy[];

    @Property({ nullable: true }) doneOn: Date;
    @Property({ nullable: true }) finishedOn: Date;

    @Property({ nullable: true }) cost: number;
    @Property({ default: 0 }) duration: number;

    @ManyToOne(() => AuthUser, { eager: true })
    creationBy: AuthUser;


    schedule: ServiceSchedule;

    // @BeforeInsert()
    // async updateDates() {
    //     if (this.status == null) this.status = JobStatus.CREATED;
    //     if (this.timeline == null)
    //         this.timeline = await getConnection().getRepository(ActivityFeed)
    //             .save({});
    // }
}

