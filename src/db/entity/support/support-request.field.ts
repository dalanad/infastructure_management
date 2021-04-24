import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";
import { SupportRequestTypeField } from "./support-request-type.field";
import { SupportRequest } from "./support-request.entity";
import { SupportRequestType } from "./support-request-type";

@Entity()
export class SupportRequestField {
	@ManyToOne(() => SupportRequest, { primary: true })
	request: SupportRequest;

	@PrimaryKey()
	order: number;

	@Property()
	field: SupportRequestTypeField;

	@Property()
	data: string;
}
