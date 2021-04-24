import { AuthRole, AuthUser } from "../../db/entity";
import { BaseRepository, hash } from "../../lib/core";

export class UsersRepository extends BaseRepository {
	getActiveUser(username: string) {
		return this.orm.em.findOneOrFail(AuthUser, { $or: [{ uid: username }, { email: username }], isActive: true });
	}

	async getUsers(pageSize, currentPage) {
		const params = { page: currentPage, size: pageSize };
		let [items, count] = await this.orm.em.findAndCount(
			AuthUser,
			{},
			{ limit: params.size, offset: params.page * params.size }
		);
		return { items, count };
	}

	getUserRoles() {
		return this.orm.em.find(AuthRole, {}, { orderBy: { id: "ASC" } });
	}

	async createUser(payload: Partial<AuthUser>, role: AuthRole) {
		payload.password = await hash(payload.password);
		let asset = this.orm.em.create(AuthUser, payload);
		asset.uid = String(asset.uid).toLowerCase().trim();
		await this.orm.em.persist(asset);
	}

	async updateUser(uid: string, payload: Partial<AuthUser>) {
		let entity = await this.orm.em.findOneOrFail(AuthUser, { uid: uid });
		entity?.assign({ name: payload.name, isActive: payload.isActive, email: payload.email });
		if (payload.password) {
			entity.password = await hash(payload.password);
		}
		await this.orm?.em.flush();
	}

	getUser(uid: string) {
		return this.orm.em.findOne(AuthUser, { uid });
	}
}
