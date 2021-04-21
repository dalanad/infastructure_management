'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210419160744 extends Migration {

  async up() {
    this.addSql('alter table "support_request" add column "status" text check ("status" in (\'OPEN\', \'RESOLVED\', \'CLOSED\', \'BLOCKED\', \'WAITING\')) default \'OPEN\' not null, add column "priority" text check ("priority" in (\'LOW\', \'NORMAL\', \'HIGH\', \'URGENT\')) default \'NORMAL\' not null;');

    this.addSql('alter table "support_request_field" drop constraint if exists "support_request_field_field_check";');
    this.addSql('alter table "support_request_field" alter column "field" type jsonb using ("field"::jsonb);');
    this.addSql('alter table "support_request_field" alter column "field" drop default;');
  }

}
exports.Migration20210419160744 = Migration20210419160744;
