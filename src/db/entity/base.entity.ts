import {
	AfterCreate,
	AfterUpdate,
	BaseEntity as S,
	BeforeCreate,
	BeforeUpdate,
	EntityManager,
	EventArgs,


	Property,
	Utils
} from "@mikro-orm/core";

export abstract class BaseEntity extends S<BaseEntity, any> {

	@Property({ defaultRaw: "now()" })
	createdAt: Date;

	@Property({ onUpdate: () => new Date(), defaultRaw: "now()", columnType: "timestamp" })
	updatedAt: Date;

	@BeforeCreate()
	@BeforeUpdate()
	setOrgId(params) {

	}

	@AfterCreate()
	@AfterUpdate()
	async audit(params: EventArgs<any>) {
		const em: EntityManager = params.em;
		const cs = params.changeSet;
		const orgId = "T000001";
		const uid = "T000001";
		const pl = { ...cs.payload };
		delete pl.updatedAt;
		delete pl.createdAt;

		const previousValues: any = {};

		Object.keys(pl).forEach((key) => {
			if (cs.originalEntity && cs.originalEntity[ key ]) previousValues[ key ] = cs.originalEntity[ key ];
		});

		// await em.getConnection()
		// 	.execute(`INSERT INTO audit_trail (  entity,pk, "user", org_id, type, afi, bfi)
        //                                   VALUES (  '${cs.name}', '${serialize(
		// 		Utils.extractPK(params.entity)
		// 	)}', '${uid}', '${orgId}', '${cs.type}', 
        //                                   '${JSON.stringify(pl)}', '${JSON.stringify(
		// 		previousValues
		// 	)}');
        // `);
	}
}

function serialize(obj) {
	return typeof obj === "string" ? obj : JSON.stringify(obj);
}
