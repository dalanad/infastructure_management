import { Migration } from '@mikro-orm/migrations';

export class Migration20210321113054 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "asset" drop constraint if exists "asset_software_check";');
    this.addSql('alter table "asset" alter column "software" type jsonb using ("software"::jsonb);');
    this.addSql('alter table "asset" alter column "software" set default \'[]\';');

    this.addSql('alter table "asset" drop constraint "serial_no_check";');
  }

}
