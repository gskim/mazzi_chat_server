import { plainToClass } from 'class-transformer'
import { NotFoundError } from 'routing-controllers'
import { Service } from 'typedi'
import { LessThan, MoreThan } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post, { PostStatus } from '../entities/Post'
import PostMapping from '../entities/PostMapping'
import PostOrderSequence from '../entities/PostOrderSequence'
import User from '../entities/User'
import PostMappingRepository from '../repositories/PostMappingRepository'
import PostOrderSequenceRepository from '../repositories/PostOrderSequenceRepository'
import PostRepository from '../repositories/PostRepository'
@Service()
export default class PostService {
	@InjectRepository() private readonly postRepository: PostRepository
	@InjectRepository() private readonly postOrderSequenceRepository: PostOrderSequenceRepository
	@InjectRepository() private readonly postMappingRepository: PostMappingRepository
	public async addPost(post: Post) {
		const postOrderSequence = await this.postOrderSequenceRepository.save(new PostOrderSequence())
		post.orderId = -1 * postOrderSequence.id
		const addedPost = await this.postRepository.add(post)
		return addedPost
	}

	public async addReply(postId: number, text: string, user: User) {
		const post = await this.postRepository.getWithParent(postId)
		if (!post) throw new NotFoundError('not found post')
		const reply = await this.addPost(plainToClass(Post, { text: text, user: user, parent: post }))
		if (post.parent) {
			await this.postMappingRepository.save(plainToClass(PostMapping, { parent: post.parent.id, child: reply.id }))
		}
		await this.postMappingRepository.save(plainToClass(PostMapping, { parent: post.id, child: reply.id }))
		return reply
	}

	public async getPost(id: number) {
		return await this.postRepository.get(id)
	}

	public async getPostWithUser(id: number) {
		return await this.postRepository.getWithUser(id)
	}

	public async getPostAll() {
		return await this.postRepository.find()
	}

	public async getPostList(lastId?: number) {
		return await this.postRepository.find({
			relations: ['user', 'likes', 'likes.user', 'unlikes', 'unlikes.user', 'images', 'postMappings'],
			where: {
				orderId: lastId ? MoreThan(lastId) : MoreThan(-9999999),
				parent: null,
			},
			take: 10,
		})
	}

	public async getReplies(postId: number, lastId?: number) {
		return await this.postRepository.createQueryBuilder('post')
		.leftJoinAndSelect('post.user', 'user')
		.leftJoinAndSelect(`post.likes`, 'likes')
		.leftJoinAndSelect(`post.unlikes`, 'unlikes')
		.leftJoinAndSelect(`likes.user`, 'likeUser')
		.leftJoinAndSelect(`unlikes.user`, 'unlikeUser')
		.leftJoinAndSelect(`post.postMappings`, 'postMappings')
		.where(`post.parentId = :postId`)
		.andWhere(`post.orderId > :lastId`)
		.setParameters({
			postId: postId,
			status: PostStatus.PUBLIC,
			lastId: lastId ? lastId : -9999999,
		})
		.take(10)
		.getMany()
	}

	/**
	 * name
	 */
	public async getPostTree(id: number) {
		return await this.postRepository.getTree(id)
	}
}
