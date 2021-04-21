import { Entity, Enum, JsonType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { SupportRequestType } from "./support-request-type";
import { SupportRequest } from "./support-request.entity";


export interface SupportFieldValidators {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string
}

export enum SupportFieldType {
    TEXT = "TEXT", EMAIL = "EMAIL", NUMBER = "NUMBER", SELECT = "SELECT", TEXTAREA = "TEXTAREA"
}

export interface SupportFieldMetadata {
    validators?: SupportFieldValidators
}

@Entity()
export class SupportRequestTypeField {

    @PrimaryKey()
    order: number;

    @ManyToOne(() => SupportRequestType, { hidden: true, primary: true })
    requestType: SupportRequestType;

    @Property()
    name: string;

    @Enum(() => SupportFieldType)
    type: SupportFieldType;

    @Property({ type: JsonType, default: '{}' })
    metadata: SupportFieldMetadata
}