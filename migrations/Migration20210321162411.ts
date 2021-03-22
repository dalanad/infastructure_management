import { Migration } from '@mikro-orm/migrations';

export class Migration20210321162411 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "sys_config" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamp not null default now(), "data" jsonb not null);');
    this.addSql('alter table "sys_config" add constraint "sys_config_pkey" primary key ("id");');
  }

}
