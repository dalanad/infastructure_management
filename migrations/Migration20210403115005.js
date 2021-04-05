'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210403115005 extends Migration {

  async up() {
    this.addSql('alter table "service_job" rename column "todo" to "description";');


    this.addSql('alter table "service_job" add column "job_id" varchar(255) not null;');
    this.addSql('alter table "service_job" drop constraint "service_job_pkey" cascade');
    this.addSql('alter table "service_job" add constraint "service_job_pkey" primary key ("job_id");');
    this.addSql('alter table "service_job" drop column "id";');

    this.addSql('alter table "service_done_by" add column "service_job_id" varchar(255) not null;');
    this.addSql('alter table "service_done_by" drop column "service_id";');

    this.addSql('alter table "service_done_by" add constraint "service_done_by_service_job_id_foreign" foreign key ("service_job_id") references "service_job" ("job_id") on update cascade;');
  }

}
exports.Migration20210403115005 = Migration20210403115005;
