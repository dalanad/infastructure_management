import { BaseEntity } from "./base.entity";
import { Embeddable, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Embeddable()
export class Contact {
	@Property() email: string;
	@Property() address: string;
	@Property() city: string;
	@Property() phone: string;
	@Property() mobile: string;
}

@Entity()
export class Supplier extends BaseEntity {
	@PrimaryKey() id: number;
	@Property() displayName: string;
	@Property() companyName: string;
	@Property({ default: "" }) contactName: string;
	@Embedded(() => Contact) contactInfo: Contact;
	@Property({ default: 0 })
	creditPeriod: number;

	@Property({ persist: false })
	get addressFormatted() {
		return `
    ${this.contactInfo.address}
    ${this.contactInfo.city}
    ${this.contactInfo.phone}
    ${this.contactInfo.email}`.trim();
	}
}
