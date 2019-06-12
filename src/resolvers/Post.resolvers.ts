import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql'
import Post from '../entities/Post'
import PostService from '../services/PostService'
// @Service()
@Resolver((of) => Post)
class PostResolver {

	private post: Post

	constructor(protected postService: PostService) { }

	@Query((returns) => Post)
	public async getPostTree(
		@Arg('id') id: number,
	) {
		return await this.postService.getPostTree(id)
	}

	@Query((returns) => [Post])
	public async posts() {
		return await this.postService.getPostAll()
	}

	@FieldResolver((returns) => Number)
	public likeCnt(
		@Root() root: Post,
	) {
		return root.likes.length
	}

}
