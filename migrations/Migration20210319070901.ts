import { Migration } from '@mikro-orm/migrations';

export class Migration20210319070901 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "device_location" add column "created_at" timestamptz(0) not null default now(), add column "updated_at" timestamp not null default now();');

    this.addSql('alter table "device_manufacturer" add column "created_at" timestamptz(0) not null default now(), add column "updated_at" timestamp not null default now();');
  }

}
