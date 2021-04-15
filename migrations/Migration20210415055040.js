'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210415055040 extends Migration {

  async up() {
    this.addSql('alter table "support_request_type_field" drop constraint if exists "support_request_type_field_type_check";');
    this.addSql('alter table "support_request_type_field" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "support_request_type_field" add constraint "support_request_type_field_type_check" check ("type" in (\'TEXT\', \'EMAIL\', \'NUMBER\', \'SELECT\', \'TEXTAREA\'));');
  }

}
exports.Migration20210415055040 = Migration20210415055040;
