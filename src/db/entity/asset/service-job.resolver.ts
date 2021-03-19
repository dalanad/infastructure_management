import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Connection, getRepository } from "typeorm";
import { ServiceDoneBy } from "./serviceDoneBy";
import { JobStatus, ServiceJob } from "./serviceJob";
import { GraphQLJSONObject } from "graphql-type-json";
import { CurrentUser } from "../common/timeline.resolver";
import { User } from "../auth/user";
import { OrderBy } from "../common-interfaces";

@Resolver(of => ServiceJob)
export class ServiceJobResolver {
    constructor(private readonly _conn: Connection) { }

    @Query(type => [ServiceJob])
    serviceJobs(
        @Args('id', {type: () => ID, nullable: true}) id: number,
        @Args('take', {type: () => Int, nullable: true, defaultValue: 10}) take: number,
        @Args('skip', {type: () => Int, defaultValue: 0, nullable: true}) skip: number,
        @Args('order', {type: () => OrderBy, nullable: true}) order: OrderBy
    ) {
        return this._conn.getRepository(ServiceJob).find({
            where: id ? {id} : undefined, take, skip,
            order: order ? {[order.field]: order.dir} : {"creationTime": "DESC"}
        });
    }

    @ResolveField(type => [ServiceDoneBy])
    doneBy(@Parent() job: ServiceJob) {
        return this._conn.getRepository(ServiceDoneBy).find({where: {service: job.id}});
    }

    @Mutation(type => String)
    async discardJob(@Args({name: 'jobId', type: () => ID}) jobId, @CurrentUser()user: User) {
        await this._conn.getRepository(ServiceJob).update(jobId, {status: JobStatus.DISCARDED})
        return "success";
    }

    @Mutation(type => String)
    async completeJob(@Args({name: 'jobId', type: () => ID}) jobId, @CurrentUser() user: User) {
        await this._conn.getRepository(ServiceJob).update(jobId, {status: JobStatus.DONE, doneOn: new Date()})
        return "success";
    }

    @Mutation(type => ServiceJob)
    async saveServiceJob(@Args({name: 'record', type: () => GraphQLJSONObject}) update, @CurrentUser()user: User) {
        // @ts-ignore
        const incoming: ServiceJob = this._conn.getRepository(ServiceJob).create(update);
        if (!incoming.id) {
            incoming.creationBy = user;
            delete incoming.id
        }
        // set status to pending when startDate is set
        if (incoming.status == JobStatus.CREATED && incoming.doneOn) {
            incoming.status = JobStatus.PENDING;
        }

        let doneBy = [...incoming.doneBy]
        delete incoming.doneBy;
        const service = await this._conn.getRepository(ServiceJob).save(incoming);
        doneBy = doneBy.map(v => {
            if (!v.service) v.service = service;
            return v
        });
        await getRepository(ServiceDoneBy).save(doneBy)
        return getRepository(ServiceJob).findOne(service.id);

    }

}
