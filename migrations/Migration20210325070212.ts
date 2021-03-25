import { Migration } from '@mikro-orm/migrations';

export class Migration20210325070212 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "asset" add column "sticker_printed" timestamptz(0) null;');
  }

}
