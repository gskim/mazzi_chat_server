import { Exclude, Expose, Transform, Type } from 'class-transformer'
import Like from '../entities/Like'
import { PostStatus } from '../entities/Post'
import Unlike from '../entities/Unlike'
import User from '../entities/User'

@Exclude()
export class PostUserProfileRepresentor {
	@Expose()
	public id: number
	@Expose()
	public nickname: string
	@Expose()
	public profilePhoto: string
}

@Exclude()
export class PostRepresentor {
	@Expose({ toClassOnly: true })
	public likes: Like[]
	@Expose({ toClassOnly: true })
	public unlikes: Unlike[]

	@Expose()
	@Type(() => PostUserProfileRepresentor)
	public user: PostUserProfileRepresentor

	@Expose()
	public mine: boolean
	@Expose()
	public iLikeIt: boolean
	@Expose()
	public iDontLikeIt: boolean

	@Expose()
	public id: number
	@Expose()
	public orderId: number
	@Expose()
	public title: string
	@Expose()
	public text: string
	@Expose()
	public status: PostStatus
	@Expose()
	public createdAt: Date

	@Expose()
	get likeCnt(): number {
		return this.likes.length
	}

	@Expose()
	get unlikeCnt(): number {
		return this.unlikes.length
	}

	public isMine(user: User) {
		this.mine = this.user.id === user.id
	}
	public isLikeIt(user: User) {
		this.iLikeIt = this.likes.some((like) => like.user.id === user.id)
	}
	public isNotLikeIt(user: User) {
		this.iDontLikeIt = this.unlikes.some((unlike) => unlike.user.id === user.id)
	}
}

Exclude()
export class PostListRepresentor {
	@Expose()
	@Type(() => PostRepresentor)
	public list: PostRepresentor[]
}
