import { Migration } from '@mikro-orm/migrations';

export class Migration20210322174955 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "asset" add column "purchase_order_no" varchar(255) not null default \'\', add column "grn_no" varchar(255) not null default \'\';');
  }

}
