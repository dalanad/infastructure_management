'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210404031422 extends Migration {

  async up() {
    this.addSql('alter table "service_job" rename column "done_on" to "start";');


    this.addSql('alter table "service_job" rename column "finished_on" to "end";');
  }

}
exports.Migration20210404031422 = Migration20210404031422;
