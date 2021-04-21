import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property, QueryOrder } from "@mikro-orm/core";
import { SupportRequestTypeField } from "./support-request-type.field";


@Entity()
export class  SupportRequestType {

    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @OneToMany(() => SupportRequestTypeField, e => e.requestType, { eager: true, cascade: [Cascade.ALL], orderBy: { order: QueryOrder.ASC } })
    fields: Collection<SupportRequestTypeField>
}

