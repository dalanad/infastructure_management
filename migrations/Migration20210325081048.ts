import { Migration } from '@mikro-orm/migrations';

export class Migration20210325081048 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "asset" rename column "decommissioned" to "discarded";');


    this.addSql('alter table "asset" drop constraint if exists "asset_status_check";');
    this.addSql('alter table "asset" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "asset" add constraint "asset_status_check" check ("status" in (\'NOT_IN_USE\', \'IN_USE\', \'IN_REPAIR\', \'DISCARDED\'));');
  }

}
