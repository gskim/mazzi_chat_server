import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User from '../entities/User'
import { UserInput } from '../types/User.types'

@Resolver()
class UserResolver {

	private user: User

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	  ) {}

	@Query((returns) => [User] || null)
	public async users() {
		return await this.userRepository.findOne(1)
	}

	@Mutation((returns) => User)
	public async addUser(
		@Arg('user') newUserData: UserInput,
		@Ctx() ctx,
	): Promise<User> {
		console.log(newUserData)
		const user = this.userRepository.create(newUserData)
		return await this.userRepository.save(user)
	}
}
