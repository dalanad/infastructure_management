
import { Cascade, Embedded, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { AssetLocation, Category, Manufacturer } from './base';
import { ComputerSpecifications } from "./computerSpecifications";
import { NetworkConfigurations } from "./networkConfigurations";
import { ServiceJob } from "./serviceJob";
import { Supplier } from "../supplier.entity";
import { BaseEntity } from '../base.entity';

export enum AssetStatus {
    NOT_IN_USE = 'NOT_IN_USE',
    IN_USE = 'IN_USE',
    IN_REPAIR = 'IN_REPAIR',
    DECOMMISSIONED = 'DECOMMISSIONED',
}

export enum AssetCondition {
    FUNCTIONAL = 'FUNCTIONAL',
    BROKEN = 'BROKEN'
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

    @ManyToOne(t => Manufacturer, { eager: true })
    manufacturer: Manufacturer;

    @ManyToOne(t => Category, { eager: true })
    category: Category;

    @ManyToOne(_ => AssetLocation, { eager: true })
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
    decommissioned: Date;

    @Property({ nullable: true })
    decommissionReason: string;

    @Property({ nullable: false, default: 0 })
    expectedLifespan: number;

    @Property({ nullable: false, default: 0 })
    purchaseCost: number;

    @Property({ nullable: true, default: '' })
    owner: string;

    @Property({ columnType: "jsonb", nullable: true, default: "[]" })
    software: any;

    @Enum(() => AssetStatus)
    status: AssetStatus = AssetStatus.NOT_IN_USE;

    @Enum(() => AssetCondition)
    condition: AssetCondition = AssetCondition.FUNCTIONAL;

    @Embedded(() => ComputerSpecifications)
    computer: ComputerSpecifications;

    @Embedded(() => NetworkConfigurations)
    net: NetworkConfigurations;

    @OneToMany(() => ServiceSchedule, e => e.asset, { cascade: [ Cascade.ALL ], eager: true })
    schedule: ServiceSchedule[];

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
    description: string

    @Property()
    active: boolean
}
