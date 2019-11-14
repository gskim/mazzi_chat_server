import { Service } from 'typedi'
import { LessThan, MoreThan } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post, { PostStatus } from '../entities/Post'
import PostOrderSequence from '../entities/PostOrderSequence'
import PostRepository from '../repositories/PostRepository'
@Service()
export default class PostService {
	@InjectRepository() private readonly postRepository: PostRepository
	public async addPost(post: Post) {
		const postOrderSequence = await PostOrderSequence.save(new PostOrderSequence())
		post.orderId = -1 * postOrderSequence.id
		return await this.postRepository.add(post)
	}

	public async getPost(id: number) {
		return await this.postRepository.get(id)
	}

	public async getPostAll() {
		return await this.postRepository.find()
	}

	public async getPostList(lastId?: number) {
		return await this.postRepository.find({
			relations: ['user', 'children', 'likes', 'unlikes', 'images', 'children.children'],
			where: {
				id: lastId ? LessThan(lastId) : MoreThan(0),
			},
			take: 20,
		})
	}

	public async getReplies(postId: number, lastId?: number) {
		return await this.postRepository.createQueryBuilder('post')
		.leftJoin('post.children', 'children')
		.leftJoin(`post.likes`, 'likes')
		.leftJoin(`children.likes`, 'childrenLikes')
		.select(`"post"."id"`, 'id')
		.addSelect(`"post"."text"`, 'text')
		// .addSelect(`COUNT(children.id)`, 'replyCnt')
		.where(`"post"."parentId" = :postId`)
		.andWhere(`post.status = :status`)
		.andWhere(`post.orderId > :lastId`)
		.setParameters({
			postId: postId,
			status: PostStatus.PUBLIC,
			lastId: lastId ? lastId : -9999999,
		})
		.getRawMany()
	}

	/**
	 * name
	 */
	public async getPostTree(id: number) {
		return await this.postRepository.getTree(id)
	}
}
