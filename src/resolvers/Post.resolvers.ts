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
		const manager = getManager()
		const post = await Post.findOne(id, {
			relations: ['user'],
		})

		console.log('---------')
		if (post) {
			const results = await manager.getTreeRepository(Post).findDescendantsTree(post)

			return results
		}
		return {}
	}
}
