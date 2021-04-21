'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210415154242 extends Migration {

  async up() {
    this.addSql('alter table "support_request_field" rename column "field_order" to "order";');

    this.addSql('alter table "support_request_field" add column "field"  jsonb not null default \'{}\';');
    this.addSql('alter table "support_request_field" drop constraint "support_request_field_field_order_field_request_type_id_foreign";');
    this.addSql('alter table "support_request_field" drop column "field_request_type_id";');
  }

}
exports.Migration20210415154242 = Migration20210415154242;
