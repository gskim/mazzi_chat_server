import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import {
	AfterInsert,
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Tree,
	TreeChildren,
	TreeLevelColumn,
	TreeParent,
	Unique,
	UpdateDateColumn,
} from 'typeorm'
import Image from './Image'
import Like from './Like'
import Unlike from './Unlike'
import User from './User'

export enum PostStatus {
	PUBLIC = 'public',
	PRIVATE = 'private',
	DELETE = 'delete',
}
registerEnumType(PostStatus, { name: 'PostStatus' })
@ObjectType()
@Entity({
	orderBy: {
		orderId: 'ASC',
	},
})

class Post extends BaseEntity {

	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field()
	@Column({ type: 'varchar', nullable: true, length: 30 })
	public title: string

	@Field()
	@Column({ type: 'text', nullable: false })
	public text: string

	@Field()
	@Column({ type: 'enum', enum: PostStatus, default: PostStatus.PUBLIC })
	public status: PostStatus

	@Field((type) => Image)
	@OneToMany((type) => Image, (image) => image.post)
	public images: Image[]

	@Index({ unique: true })
	@Column()
	public orderId: number

	@Field((type) => User)
	@ManyToOne((type) => User)
	public user: User

	@Field((type) => Post)
	@ManyToOne((type) => Post, (post) => post.children)
	public parent: Post

	@Field((type) => [Post])
	@OneToMany((type) => Post, (post) => post.parent)
	public children: Post[]

	@OneToMany((type) => Like, (like) => like.post)
	public likes: Like[]

	@OneToMany((type) => Unlike, (unlike) => unlike.post)
	public unlikes: Unlike[]

	@Field()
	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Post
