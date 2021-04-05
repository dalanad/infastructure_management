'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210403115632 extends Migration {

  async up() {
    this.addSql('alter table "service_job" rename column "device_id" to "asset_id";');
  }

}
exports.Migration20210403115632 = Migration20210403115632;
