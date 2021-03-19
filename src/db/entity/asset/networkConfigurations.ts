import { Cascade, Embeddable, ManyToOne, Property } from "@mikro-orm/core";
import { Network } from "./network.entity";

@Embeddable()
export class NetworkConfigurations {

    @Property({ nullable: true })
    ip: string;

    @Property({ nullable: true })
    mac: string;

    @ManyToOne(() => Network, { cascade: [ Cascade.ALL ], eager: true })
    subnet: string;

    @Property({ nullable: true })
    gateway: string;
}