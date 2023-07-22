'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20230718042146 extends Migration {

  async up() {
    this.addSql('alter table "support_request" drop constraint if exists "support_request_status_check";');
    this.addSql('alter table "support_request" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "support_request" add constraint "support_request_status_check" check ("status" in (\'OPEN\', \'RESOLVED\', \'CLOSED\', \'BLOCKED\', \'WAITING\'));');
    this.addSql('alter table "support_request" alter column "status" drop default;');
    this.addSql('alter table "support_request" drop constraint if exists "support_request_priority_check";');
    this.addSql('alter table "support_request" alter column "priority" type text using ("priority"::text);');
    this.addSql('alter table "support_request" add constraint "support_request_priority_check" check ("priority" in (\'LOW\', \'NORMAL\', \'HIGH\', \'URGENT\'));');
    this.addSql('alter table "support_request" alter column "priority" drop default;');

    this.addSql('create table "device_location_parent" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "name" varchar(255) not null, "description" varchar(255) not null);');

    this.addSql('alter table "device_location" add column "parent_id" int4 null;');

    this.addSql('alter table "device_location" add constraint "device_location_parent_id_foreign" foreign key ("parent_id") references "device_location_parent" ("id") on update cascade on delete set null;');
  }

}
exports.Migration20230718042146 = Migration20230718042146;
