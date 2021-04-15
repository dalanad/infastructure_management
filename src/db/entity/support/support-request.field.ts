import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { SupportRequestTypeField } from "./support-request-type.field";
import { SupportRequest } from "./support-request.entity";


@Entity()
export class SupportRequestField {
    @ManyToOne(() => 'SupportRequest', { primary: true })
    request: SupportRequest;

    @ManyToOne(() => SupportRequestTypeField, { primary: true })
    field: SupportRequestTypeField;

    @Property()
    data: string;
}