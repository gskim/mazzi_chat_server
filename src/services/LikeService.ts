import { classToPlain, plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Like from '../entities/Like'
import Post from '../entities/Post'
import User from '../entities/User'
import LikeRepository from '../repositories/LikeRepository'
@Service()
export default class LikeService {
	@InjectRepository() private readonly likeRepository: LikeRepository

	public async add(post: Post, user: User) {
		const like = new Like()
		like.post = post
		like.user = user
		await this.likeRepository.save(like)
		// await this.likeRepository.save(like)
	}

	public async update(like: Like, status: boolean) {
		like.status = status
		await this.likeRepository.save(like)
	}

	public async get(postId: number, user: User) {
		return await this.likeRepository.findOne({
			where: {
				post: plainToClass(Post, { id: postId }) ,
				user: user,
			},
		})
	}
}
