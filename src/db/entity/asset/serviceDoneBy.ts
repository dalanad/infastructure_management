import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { ServiceJob } from "./serviceJob";
import { AuthUser } from "./../auth/auth-user.entity";

@Entity()
export class ServiceDoneBy {

    @Property()
    contribution: number;

    @ManyToOne(() => ServiceJob, { primary: true })
    service: ServiceJob;

    @ManyToOne(() => AuthUser, { eager: true, primary: true })
    user: AuthUser;

}
