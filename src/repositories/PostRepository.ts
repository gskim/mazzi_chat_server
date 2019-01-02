import { EntityRepository, getManager, Repository } from 'typeorm'
import Post from '../entities/Post'
@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
	public async add(post: Post) {
		return this.save(post)
	}
	public async get(id: number) {
		return await this.findOne(id, {
			relations: ['user'],
		})
	}
	public async getTree(id: number) {
		return await this.findOne(id, {
			relations: ['user', 'children', 'children.user', 'children.children', 'children.children.user'],
		})
	}
}
