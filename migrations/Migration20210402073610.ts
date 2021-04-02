import { Migration } from '@mikro-orm/migrations';

export class Migration20210402073610 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "activity_feed" ("id" serial primary key);');

    this.addSql('create table "activity" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "user_uid" varchar(255) null, "meta" jsonb not null, "content" jsonb not null, "attachments" jsonb not null, "feed_id" int4 not null);');

    this.addSql('alter table "activity" add constraint "activity_user_uid_foreign" foreign key ("user_uid") references "auth_user" ("uid") on update cascade on delete set null;');
    this.addSql('alter table "activity" add constraint "activity_feed_id_foreign" foreign key ("feed_id") references "activity_feed" ("id") on update cascade;');
  }

}
