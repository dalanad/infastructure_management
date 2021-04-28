import { Activity, ActivityFeed } from "../../lib/db/entity";
import { orm } from "../../lib/db/init";
import { EntityName, Utils } from "@mikro-orm/core";

export async function postActivity(feedId: string, activityData: Partial<Activity>) {
	const feedRepository = orm.em.getRepository(ActivityFeed);
	let feed = await getFeed(feedId);

	const activity = orm.em.create(Activity, activityData);
	feed.activities.add(activity);

	feedRepository.persist(feed);
	orm.em.persist(activity);
}

export async function getFeed(feedId: string) {
	const feedRepository = orm.em.getRepository(ActivityFeed);
	let feed = await feedRepository.findOne(feedId);

	if (feed == null) {
		feed = feedRepository.create({ id: feedId });
	}
	feedRepository.persist(feed);
	return feed;
}

export async function getFeedOfEntity(et: EntityName<any>, entity) {
	return getFeed(`${Utils.className(et)}-${Utils.extractPK(entity)}`);
}
