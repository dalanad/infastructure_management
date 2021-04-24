import { BaseRepository } from "../../lib/core";
import { SupportRequest, SupportRequestField } from "../../db/entity";
import { wrap } from "@mikro-orm/core";
import { getNextVal, ID_SEQUENCES } from "../../lib/data";

export class SupportRequestRepository extends BaseRepository {
	async getAll() {
		return this.orm.em.find(
			SupportRequest,
			{},
			{ orderBy: { requestId: "desc" }, populate: ["requestType"] }
		);
	}

	async getOne(id: string): Promise<SupportRequest> {
		let request: any = await this.orm.em.findOneOrFail(SupportRequest, { requestId: id });
		request.data = await this.orm.em.find(SupportRequestField, { request: { requestId: id } });
		return request;
	}

	async create(obj: Partial<SupportRequest>): Promise<SupportRequest> {
		let x = this.orm.em.create(SupportRequest, obj);
		x.requestId = await getNextVal(ID_SEQUENCES.SUPPORT_REQ, { prefix: "SR" });
		this.orm.em.persist(x);
		await this.orm.em.flush();
		return x;
	}

	async save(id: string, obj: Partial<SupportRequest>): Promise<SupportRequest> {
		let x = await this.orm.em.findOneOrFail(SupportRequest, { requestId: id });
		wrap(x).assign(obj);
		this.orm.em.persist(x);
		await this.orm.em.flush();
		return x;
	}
}
