import { plainToClass } from 'class-transformer'
import { Request } from 'express'
import { CurrentUser, Get, JsonController, Req, Res } from 'routing-controllers'
import { Service } from 'typedi'
import { getManager, getTreeRepository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Post, { PostStatus } from '../entities/Post'
import PostService from '../services/PostService'
@Service()
@JsonController('/posts')
export class PostController {

	constructor(protected postService: PostService) {}

	@Get('/')
	public async posts() {
		const manager = getManager()
		return await manager.getTreeRepository(Post).findTrees()
	}

	@Get('/one')
	public async getOne() {
		const manager = getManager()
		// const post = await Post.findOne(73)
		const post = plainToClass(Post, { id: 73, text: 'a' })
		return await manager.getTreeRepository(Post).findDescendantsTree(post)
	}

	@Get('/addChild')
	public async addChild() {
		const post = await Post.findOne(89)
		if (post) {
			const newPost = new Post()
			newPost.text = 'child2'
			return await this.postService.addPost(newPost)
		}
		return {}
	}

	@Get('/add')
	public async add(@Res() res) {
		const post = new Post()
		post.text = 'text3'
		const a = await this.postService.addPost(post)
		return a
	}

}
