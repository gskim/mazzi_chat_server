import { classToPlain, plainToClass } from 'class-transformer'
import { Request } from 'express'
import { CurrentUser, Get, JsonController, QueryParam, Req, Res } from 'routing-controllers'
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
		return await Post.find()
	}

	@Get('/one')
	public async getOne(
		@QueryParam('id') id: number,
	) {
		return await this.postService.getPostTree(id)
	}

	@Get('/addChild')
	public async addChild(
		@QueryParam('id') id: number,
	) {
		const newPost = new Post()
		newPost.text = 'child1'
		newPost.parent = plainToClass(Post, { id: id })
		return await this.postService.addPost(newPost)
	}

	@Get('/add')
	public async add(@Res() res) {
		const post = new Post()
		post.text = 'text1'
		const a = await this.postService.addPost(post)
		return a
	}

}
