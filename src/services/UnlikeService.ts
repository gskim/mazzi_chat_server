import { plainToClass } from 'class-transformer'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post from '../entities/Post'
import Unlike from '../entities/Unlike'
import User from '../entities/User'
import UnlikeRepository from '../repositories/UnlikeRepository'
@Service()
export default class UnlikeService {
	@InjectRepository() private readonly unlikeRepository: UnlikeRepository

	public async add(post: Post, user: User) {
		const unlike = new Unlike()
		unlike.post = post
		unlike.user = user
		await this.unlikeRepository.save(unlike)
	}

	public async update(unlike: Unlike, status: boolean) {
		unlike.status = status
		await this.unlikeRepository.save(unlike)
	}

	public async get(postId: number, user: User) {
		return await this.unlikeRepository.findOne({
			where: {
				post: plainToClass(Post, { id: postId }) ,
				user: user,
			},
		})
	}
}
