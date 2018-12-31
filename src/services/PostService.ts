import { classToPlain, plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { getManager, Repository } from 'typeorm'
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
		// const manager = getManager()
		// return await manager.save(post)
		return await this.postRepository.addPost(post)
	}

	public async getPost(id: number) {
		return await this.postRepository.getPost(id)
	}
}
