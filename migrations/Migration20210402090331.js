'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210402090331 extends Migration {

  async up() {
    this.addSql('create table "activity_feed" ("id" varchar(255) not null);');
    this.addSql('alter table "activity_feed" add constraint "activity_feed_pkey" primary key ("id");');

    this.addSql('create table "activity" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "user_uid" varchar(255) null, "meta" jsonb not null, "content" jsonb not null, "attachments" jsonb not null, "feed_id" varchar(255) not null);');

    this.addSql('alter table "activity" add constraint "activity_user_uid_foreign" foreign key ("user_uid") references "auth_user" ("uid") on update cascade on delete set null;');
    this.addSql('alter table "activity" add constraint "activity_feed_id_foreign" foreign key ("feed_id") references "activity_feed" ("id") on update cascade;');
  }

}
exports.Migration20210402090331 = Migration20210402090331;
