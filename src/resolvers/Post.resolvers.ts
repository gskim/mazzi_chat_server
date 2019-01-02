import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { getManager, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post from '../entities/Post'
import PostService from '../services/PostService'
@Service()
@Resolver()
class PostResolver {

	private post: Post

	constructor(protected postService: PostService) {}

	@Query((returns) => Post)
	public async getUserTree(
		@Arg('id') id: number,
	) {
		return await this.postService.getPostTree(id)
	}
}
