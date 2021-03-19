import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Supplier } from "./supplier";

@Resolver(of => Supplier)
export class SupplierResolver {
    constructor(@InjectRepository(Supplier) private repo: Repository<Supplier>) { }

    @Query(returns => [Supplier])
    suppliers(@Args('id', {type: () => String, nullable: true}) id: string) {
        return this.repo.find({where: id ? {id} : undefined, take: 10});
    }

    @Mutation(type => Supplier)
    saveSupplier(@Args({name: 'supplier', type: () => String}) update) {
        return this.repo.save(this.repo.create(JSON.parse(update)));
    }
}
