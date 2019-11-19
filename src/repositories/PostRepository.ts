import { EntityRepository, getManager, Repository } from 'typeorm'
import Post from '../entities/Post'
@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
	public async add(post: Post) {
		return this.save(post)
	}
	public async get(id: number) {
		return await this.findOne(id, {
			relations: ['user', 'likes', 'likes.user', 'unlikes', 'unlikes.user', 'images', 'postMappings'],
		})
	}

	public async getWithParent(id: number) {
		return await this.findOne(id, { relations: ['parent'] })
	}

	public async getWithUser(id: number) {
		return await this.findOne(id, {
			relations: ['user'],
		})
	}

	public async getTree(id: number) {
		return await this.findOne(id, {
			relations: ['user', 'images', 'likes', 'unlikes', 'children', 'children.user',
			'children.likes', 'children.unlikes', 'children.children', 'children.children.user',
			'children.children.likes', 'children.children.unlikes'],
		})
	}
}
