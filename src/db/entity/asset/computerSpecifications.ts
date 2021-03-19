import { Embeddable } from "@mikro-orm/core";
import { Property } from "@mikro-orm/core";

@Embeddable()
export class ComputerSpecifications {
    @Property({ nullable: true }) ram: string;
    @Property({ nullable: true }) cpu: string;
    @Property({ nullable: true }) hddCapacity: string;
}