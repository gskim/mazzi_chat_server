import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User from '../entities/User'
import { UserInput } from '../types/User.types'

@Service()
@Resolver()
class UserResolver {

	private user: User

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	  ) {}

	@Query((returns) => [User] || null)
	public async users() {
		const users = await this.userRepository.find()
		return users
	}

	@Mutation((returns) => User)
	public async addUser(
		@Arg('user') newUserData: UserInput,
		@Ctx() ctx,
	): Promise<User> {
		const user = this.userRepository.create(newUserData)
		return await this.userRepository.save(user)
	}
}
