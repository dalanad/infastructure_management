import { Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "../base.entity";
import { AuthUser } from "../auth/auth-user.entity";

@Entity()
export class ActivityFeed {
    @PrimaryKey()
    id: number;
    @OneToMany(() => Activity, o => o.feed)
    activities: Activity[]
}


interface ChangeSetContent {
    field: string;
    bfi: string;
    afi: string;
}

@Entity()
export class Activity extends BaseEntity {
    @PrimaryKey()
    id: number;

    @ManyToOne(() => AuthUser, { nullable: true })
    user: AuthUser;

    @Property()
    meta: object = {}

    @Property()
    content: { body: string } | ChangeSetContent[]

    @Property({ columnType: 'jsonb' })
    attachments: { url: string, type: string }[] = []

    @ManyToOne(() => ActivityFeed, {})
    feed: ActivityFeed;
}
