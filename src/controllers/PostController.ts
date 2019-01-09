import * as Entity from 'baiji-entity'
import { classToPlain, plainToClass } from 'class-transformer'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post as RequestPost, QueryParam } from 'routing-controllers'
import { Service } from 'typedi'
import { getManager, getTreeRepository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Like from '../entities/Like'
import Post, { PostStatus } from '../entities/Post'
import Unlike from '../entities/Unlike'
import User from '../entities/User'
import PostRepresentor from '../representors/PostRepresentor'
import NotificationService from '../services/NotificationService'
import PostService from '../services/PostService'
@Service()
@JsonController('/posts')
export class PostController {

	constructor(
		protected postService: PostService,
		protected notificationService: NotificationService,
	) {}

	@Get('/')
	public async getPostList(
		@CurrentUser() currentUser: User,
		@QueryParam('lastId') lastId: number,
	) {
		const posts =  await this.postService.getPostList(lastId)
		return PostRepresentor.postList.parse(posts)
	}

	@Get('/:id')
	public async getPostDetail(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
	) {
		const post = await this.postService.getPostTree(id)
		return PostRepresentor.postDetail.parse(post)
	}

	@RequestPost('/')
	public async addPost(
		@CurrentUser() currentUser: User,
		@BodyParam('text') text: string,
	) {
		const post = plainToClass(Post, {
			text: text,
			user: currentUser,
		})
		await this.postService.addPost(post)
	}

	@RequestPost('/:id')
	public async addReply(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
		@BodyParam('text') text: string,
	) {
		const reply = plainToClass(Post, {
			text: text,
			user: currentUser,
			parent: plainToClass(Post, {
				id: id,
			}),
		})
		const createdReply = await this.postService.addPost(reply)
	}

	@RequestPost('/:id/like')
	public async toggleLike(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
	) {
		const [like, post] = await Promise.all([
			Like.findOne({
				where: {
					post: plainToClass(Post, { id: id }),
					user: currentUser,
				},
			}),
			Post.findOne(id, {
				relations: ['user'],
			}),
		])
		if (!post) {
			throw new NotFoundError('Not found post')
		}
		if (like) {
			like.status = !like.status
			await like.save()
			if (like.status) await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		} else {
			const newLike = plainToClass(Like, {
				post: post,
				user: currentUser,
			})
			await newLike.save()
			await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		}
	}

	@RequestPost('/:id/unlike')
	public async toggleUnlike(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
	) {
		const [unlike , post] = await Promise.all([
			await Unlike.findOne({
				where: {
					postId: id,
					userId: currentUser.id,
				},
			}),
			Post.findOne(id, {
				relations: ['user'],
			}),
		])
		if (!post) {
			throw new NotFoundError('Not found post')
		}
		if (unlike) {
			unlike.status = !unlike.status
			await unlike.save()
			if (unlike.status) await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		} else {
			const newUnlike = plainToClass(Unlike, {
				post: plainToClass(Post, {
					id: id,
				}),
				user: currentUser,
			})
			await newUnlike.save()
			await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		}
	}
}
