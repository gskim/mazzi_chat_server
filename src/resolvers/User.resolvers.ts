import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User from '../entities/User'
import UserService from '../services/UserService'
import { UserInput } from '../types/User.types'

@Service()
@Resolver((of) => User)
class UserResolver {

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		protected userService: UserService,
	) { }

	@Query((returns) => [User] || null)
	public async getUsers() {
		const users = await this.userRepository.find()
		return users
	}

	@Query((returns) => User)
	public async getUser(@Arg('userId') userId: number) {
		const user = await this.userRepository.findOne({
			relations: ['posts', 'posts.images'],
			where: {
				id: userId,
			},
		})
		return user
	}

	@Mutation((returns) => User)
	public async addUser(
		@Arg('user') newUserData: UserInput,
		@Ctx() ctx,
	): Promise<User> {
		const user = this.userRepository.create(newUserData)
		return await this.userRepository.save(user)
	}

	@FieldResolver((returns) => Number)
	public async postCount(@Root() root: User) {
		return root.posts.length
	}
}
