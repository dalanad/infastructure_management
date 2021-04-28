import { BaseRepository } from "../../lib/core";
import { SupportRequestType } from "../../lib/db/entity";
import { wrap } from "@mikro-orm/core";

export class SupportRequestTypeRepository extends BaseRepository {
	async getAll() {
		return this.orm.em.find(SupportRequestType, {}, { orderBy: { id: "asc" } });
	}

	async getOne(id: number): Promise<SupportRequestType> {
		return this.orm.em.findOneOrFail(SupportRequestType, { id }, {});
	}

	async create(obj: Partial<SupportRequestType>) {
		let x = this.orm.em.create(SupportRequestType, obj);
		this.orm.em.persist(x);
		await this.orm.em.flush();
	}

	async save(id: number, obj: Partial<SupportRequestType>) {
		let x = await this.orm.em.findOneOrFail(SupportRequestType, id);
		let fields = [...obj.fields];
		wrap(x).assign(obj);

		if (fields.length) {
			for (const it of fields) {
				if (it.requestType == null) {
					delete it.requestType;
				}
				for (const poItem of x.fields.getSnapshot()) {
					console.log("asd", poItem.order, it.order);
					if (poItem.order === it.order) {
						wrap(poItem).assign(it);
						this.orm.em.persist(poItem);
					}
				}
			}
		}
		this.orm.em.persist(x);
		await this.orm.em.flush();
	}
}
