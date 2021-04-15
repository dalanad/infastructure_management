'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210415053935 extends Migration {

  async up() {
    this.addSql('create table "support_request_type" ("id" serial primary key, "name" varchar(255) not null);');

    this.addSql('create table "support_request_type_field" ("order" int4 not null, "request_type_id" int4 not null, "name" varchar(255) not null, "type" text check ("type" in (\'TEXT\', \'EMAIL\', \'NUMBER\', \'SELECT\')) not null, "metadata" jsonb not null default \'{}\');');
    this.addSql('alter table "support_request_type_field" add constraint "support_request_type_field_pkey" primary key ("order", "request_type_id");');

    this.addSql('create table "support_request" ("request_id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "request_type_id" int4 not null);');
    this.addSql('alter table "support_request" add constraint "support_request_pkey" primary key ("request_id");');

    this.addSql('create table "support_request_field" ("request_request_id" varchar(255) not null, "field_order" int4 not null, "field_request_type_id" int4 not null, "data" varchar(255) not null);');
    this.addSql('alter table "support_request_field" add constraint "support_request_field_pkey" primary key ("request_request_id", "field_order", "field_request_type_id");');

    this.addSql('alter table "support_request_type_field" add constraint "support_request_type_field_request_type_id_foreign" foreign key ("request_type_id") references "support_request_type" ("id") on update cascade;');

    this.addSql('alter table "support_request" add constraint "support_request_request_type_id_foreign" foreign key ("request_type_id") references "support_request_type" ("id") on update cascade;');

    this.addSql('alter table "support_request_field" add constraint "support_request_field_request_request_id_foreign" foreign key ("request_request_id") references "support_request" ("request_id") on update cascade;');
    this.addSql('alter table "support_request_field" add constraint "support_request_field_field_order_field_request_type_id_foreign" foreign key ("field_order", "field_request_type_id") references "support_request_type_field" ("order", "request_type_id") on update cascade;');

    this.addSql('create index "support_request_field_field_order_field_request_type_id_index" on "support_request_field" ("field_order", "field_request_type_id");');
  }

}
exports.Migration20210415053935 = Migration20210415053935;
