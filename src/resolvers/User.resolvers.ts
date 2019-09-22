import { Arg, Args, Ctx, Field, FieldResolver, InputType, Mutation, PubSub, Query, Resolver, ResolverInterface, Root, Subscription } from 'type-graphql'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Context } from '../App'
import User from '../entities/User'
import UserService from '../services/UserService'
import { UserInput } from '../types/User.types'
import createJWT from '../utils/createJWT'

// @Service()
@Resolver((of) => User)
class UserResolver {

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		protected userService: UserService,
	) { }

	@Query((returns) => String || null)
	public async getToken(@Arg('userId') userId: number, @Ctx() ctx: Context) {
		console.log(ctx)
		return createJWT(userId)
	}

	@Query((returns) => [User] || null)
	public async getUsers(@Ctx() ctx) {
		const users = await this.userRepository.find({
			relations: ['posts'],
		})
		return users
	}

	@Query((returns) => User)
	public async getUser(@Arg('userId') userId: number, @Ctx() ctx) {
		console.log(ctx)
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
		console.log(root)
		return root.posts.length
	}
}
