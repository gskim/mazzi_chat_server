import { classToPlain, plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { getManager, LessThan, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post from '../entities/Post'
import PostOrderSequence from '../entities/PostOrderSequence'
import PostRepository from '../repositories/PostRepository'
@Service()
export default class PostService {
	constructor(
		@InjectRepository(Post) private readonly postRepository: PostRepository,
) {}
	public async addPost(post: Post) {
		const postOrderSequence = await PostOrderSequence.save(new PostOrderSequence())
		post.orderId = -1 * postOrderSequence.id
		return await this.postRepository.add(post)
	}

	public async getPost(id: number) {
		return await this.postRepository.get(id)
	}

	public async getPostList(lastId: number) {
		return await this.postRepository.find({
			relations: ['user', 'children', 'likes', 'unlikes', 'image', 'children.children'],
			where: {
				id: lastId ? LessThan(lastId) : MoreThan(0),
			},
			take: 20,
		})
	}

	/**
	 * name
	 */
	public async getPostTree(id: number) {
		return await this.postRepository.getTree(id)
	}
}
