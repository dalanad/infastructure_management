import { Migration } from '@mikro-orm/migrations';

export class Migration20210319055453 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "network" ("id" serial primary key, "description" varchar(255) not null, "cidr" varchar(255) not null);');

    this.addSql('create table "device_category" ("id" serial primary key, "name" varchar(255) not null, "computer" bool not null default false, "networked" bool not null default false);');

    this.addSql('create table "device_location" ("id" serial primary key, "name" varchar(255) not null, "floor" varchar(255) not null, "wing" varchar(255) not null);');

    this.addSql('create table "device_manufacturer" ("id" serial primary key, "name" varchar(255) not null);');

    this.addSql('create table "auth_org" ("id" varchar(255) not null, "name" varchar(255) not null, "address" varchar(255) not null default \'\', "telephone" varchar(255) not null default \'\', "logo" varchar not null default \'/assets/static/store.svg\');');
    this.addSql('alter table "auth_org" add constraint "auth_org_pkey" primary key ("id");');

    this.addSql('create table "supplier" ("id" serial not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "display_name" varchar(255) not null, "company_name" varchar(255) not null, "contact_name" varchar(255) not null default \'\', "contact_info_email" varchar(255) not null, "contact_info_address" varchar(255) not null, "contact_info_city" varchar(255) not null, "contact_info_phone" varchar(255) not null, "contact_info_mobile" varchar(255) not null, "credit_period" int4 not null default 0);');
    this.addSql('alter table "supplier" add constraint "supplier_pkey" primary key ("id");');

    this.addSql('create table "asset" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "asset_code" varchar(255) not null, "model" varchar(255) not null, "serial_no" varchar(255) not null, "manufacturer_id" int4 not null, "category_id" int4 not null, "location_id" int4 not null, "spec" varchar(255) not null, "supplier_id" serial not null, "warranty" int4 not null default 0, "date_purchased" timestamptz(0) null, "date_commissioned" timestamptz(0) null, "decommissioned" timestamptz(0) null, "decommission_reason" varchar(255) null, "expected_lifespan" int4 not null default 0, "purchase_cost" int4 not null default 0, "owner" varchar(255) null default \'\', "software" varchar(255) null default \'[]\', "status" text check ("status" in (\'NOT_IN_USE\', \'IN_USE\', \'IN_REPAIR\', \'DECOMMISSIONED\')) not null, "condition" text check ("condition" in (\'FUNCTIONAL\', \'BROKEN\')) not null, "computer_ram" varchar(255) null, "computer_cpu" varchar(255) null, "computer_hdd_capacity" varchar(255) null, "net_ip" varchar(255) null, "net_mac" varchar(255) null, "net_subnet_id" int4 null, "net_gateway" varchar(255) null);');
    this.addSql('alter table "asset" add constraint "asset_asset_code_unique" unique ("asset_code");');
    this.addSql('alter table "asset" add constraint "asset_serial_no_unique" unique ("serial_no");');

    this.addSql('create table "service_schedule" ("id" serial primary key, "asset_id" int4 not null, "interval" int4 not null, "description" varchar(255) not null, "active" bool not null);');

    this.addSql('create table "auth_task" ("id" varchar(255) not null, "name" varchar(255) not null, "module_id" varchar(255) null);');
    this.addSql('alter table "auth_task" add constraint "auth_task_pkey" primary key ("id");');

    this.addSql('create table "auth_role" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "name" varchar(255) not null, "editable" boolean not null, "description" varchar(255) null);');

    this.addSql('create table "auth_role_tasks" ("auth_role_id" int4 not null, "auth_task_id" varchar(255) not null);');
    this.addSql('alter table "auth_role_tasks" add constraint "auth_role_tasks_pkey" primary key ("auth_role_id", "auth_task_id");');

    this.addSql('create table "auth_user" ("uid" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "email" varchar(255) not null, "avatar" varchar not null, "password" varchar(255) not null, "name" varchar(255) null, "is_active" bool not null default true, "email_verified" bool not null default false, "reset_code" int4 null, "role_id" int4 not null);');
    this.addSql('alter table "auth_user" add constraint "auth_user_pkey" primary key ("uid");');
    this.addSql('alter table "auth_user" add constraint "auth_user_email_unique" unique ("email");');

    this.addSql('create table "service_job" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "done" varchar(255) null default \'\', "todo" varchar(255) null default \'\', "type" text check ("type" in (\'ON_REQUEST\', \'AD_HOC\', \'ROUTINE\')) not null, "status" varchar(255) not null default \'CREATED\', "device_id" int4 not null, "location_id" int4 not null, "done_on" timestamptz(0) null, "finished_on" timestamptz(0) null, "cost" int4 null, "duration" int4 not null default 0, "creation_by_uid" varchar(255) not null);');

    this.addSql('create table "service_done_by" ("service_id" int4 not null, "user_uid" varchar(255) not null, "contribution" int4 not null);');
    this.addSql('alter table "service_done_by" add constraint "service_done_by_pkey" primary key ("service_id", "user_uid");');

    this.addSql('alter table "asset" add constraint "asset_manufacturer_id_foreign" foreign key ("manufacturer_id") references "device_manufacturer" ("id") on update cascade;');
    this.addSql('alter table "asset" add constraint "asset_category_id_foreign" foreign key ("category_id") references "device_category" ("id") on update cascade;');
    this.addSql('alter table "asset" add constraint "asset_location_id_foreign" foreign key ("location_id") references "device_location" ("id") on update cascade;');
    this.addSql('alter table "asset" add constraint "asset_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade;');
    this.addSql('alter table "asset" add constraint "asset_net_subnet_id_foreign" foreign key ("net_subnet_id") references "network" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "service_schedule" add constraint "service_schedule_asset_id_foreign" foreign key ("asset_id") references "asset" ("id") on update cascade;');

    this.addSql('alter table "auth_role_tasks" add constraint "auth_role_tasks_auth_role_id_foreign" foreign key ("auth_role_id") references "auth_role" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "auth_role_tasks" add constraint "auth_role_tasks_auth_task_id_foreign" foreign key ("auth_task_id") references "auth_task" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "auth_user" add constraint "auth_user_role_id_foreign" foreign key ("role_id") references "auth_role" ("id");');

    this.addSql('alter table "service_job" add constraint "service_job_device_id_foreign" foreign key ("device_id") references "asset" ("id") on update cascade;');
    this.addSql('alter table "service_job" add constraint "service_job_location_id_foreign" foreign key ("location_id") references "device_location" ("id") on update cascade;');
    this.addSql('alter table "service_job" add constraint "service_job_creation_by_uid_foreign" foreign key ("creation_by_uid") references "auth_user" ("uid") on update cascade;');

    this.addSql('alter table "service_done_by" add constraint "service_done_by_service_id_foreign" foreign key ("service_id") references "service_job" ("id") on update cascade;');
    this.addSql('alter table "service_done_by" add constraint "service_done_by_user_uid_foreign" foreign key ("user_uid") references "auth_user" ("uid") on update cascade;');
  }

}
