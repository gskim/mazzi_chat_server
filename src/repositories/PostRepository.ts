import { EntityRepository, getManager, Repository } from 'typeorm'
import Post from '../entities/Post'
@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
	public async addPost(post: Post) {
		const manager = getManager()
		return await manager.save(post)
		// return this.save(post)
	}
	public async getPost(id: number) {
		return await this.findOne(id, {
			relations: ['user'],
		})
	}
}
