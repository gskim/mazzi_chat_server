import { plainToClass, TransformClassToPlain } from 'class-transformer'
import { BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post as RequestPost, QueryParam } from 'routing-controllers'
import Post from '../entities/Post'
import Unlike from '../entities/Unlike'
import User from '../entities/User'
import { PostRepresentor } from '../representors/PostRepresentor'
import LikeService from '../services/LikeService'
import NotificationService from '../services/NotificationService'
import PostService from '../services/PostService'
import UnlikeService from '../services/UnlikeService'

@JsonController('/posts')
export class PostController {

	constructor(
		protected postService: PostService,
		protected likeService: LikeService,
		protected unlikeService: UnlikeService,
		protected notificationService: NotificationService,
	) {}

	// 게시글 리스트
	@Get('/')
	public async getPostList(
		@CurrentUser() currentUser: User,
		@QueryParam('lastId') lastId?: number,
	) {
		const posts =  await this.postService.getPostList(lastId)
	}

	// 게시글보기
	@TransformClassToPlain()
	@Get('/:id')
	public async getPostDetail(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
	) {
		const post = await this.postService.getPost(id)
		if (!post) throw new NotFoundError('not found post')
		const representorPost = plainToClass(PostRepresentor, post)
		representorPost.isMine(currentUser)
		representorPost.isLikeIt(currentUser)
		representorPost.isNotLikeIt(currentUser)
		return representorPost
	}

	// 게시글 등록
	@RequestPost('/')
	public async addPost(
		@CurrentUser() currentUser: User,
		@BodyParam('text') text: string,
		@BodyParam('title') title: string,
	) {
		const post = plainToClass(Post, {
			text: text,
			title: title,
			user: currentUser,
		})
		await this.postService.addPost(post)
	}

	// 댓글 등록
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

	@Get('/:id/replies')
	public async getReplies(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
		@QueryParam('lastId') lastId?: number,
	) {
		return await this.postService.getReplies(id, lastId)
	}

	// 좋아요 토글
	@RequestPost('/:id/like')
	public async toggleLike(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
		@BodyParam('like') isLike: boolean,
	) {
		const [like, post] = await Promise.all([
			this.likeService.get(id, currentUser),
			this.postService.getPostWithUser(id),
		])
		if (!post) {
			throw new NotFoundError('Not found post')
		}
		if (like) {
			await this.likeService.update(like, isLike)
		} else {
			await this.likeService.add(post, currentUser)
			// 처음 좋아요일때 푸시메세지
			// await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		}
	}

	// 싫어요 토글
	@RequestPost('/:id/unlike')
	public async toggleUnlike(
		@CurrentUser() currentUser: User,
		@Param('id') id: number,
		@BodyParam('unlike') isUnlike: boolean,
	) {
		const [unlike, post] = await Promise.all([
			this.unlikeService.get(id, currentUser),
			this.postService.getPostWithUser(id),
		])
		if (!post) {
			throw new NotFoundError('Not found post')
		}
		if (unlike) {
			await this.unlikeService.update(unlike, isUnlike)
		} else {
			await this.unlikeService.add(post, currentUser)
			// 처음 좋아요일때 푸시메세지
			// await this.notificationService.addLikeNotification(post.user, currentUser, post.id)
		}
	}
}
