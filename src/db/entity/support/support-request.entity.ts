import { SupportRequestType } from "./support-request-type";
import { Entity, ManyToOne, OneToMany, PrimaryKey } from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { SupportRequestField } from "./support-request.field";


@Entity()
export class SupportRequest extends BaseEntity {
    @PrimaryKey()
    requestId: string;

    @ManyToOne(() => SupportRequestType)
    requestType: SupportRequestType;

    @OneToMany(() => SupportRequestField, o => o.request)
    data: SupportRequestField[]
}