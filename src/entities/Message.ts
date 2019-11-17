import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'
import User from './User'

@ObjectType()
@Entity({
	orderBy: {
		orderId: 'ASC',
	},
})

class Message extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => String)
	@Column({ type: 'text' })
	public text: string

	@Field((type) => Boolean)
	@Column({ type: 'boolean', default: false })
	public isImage: boolean

	@Field((type) => Boolean)
	@Column({ type: 'boolean', default: false })
	public isRead: boolean

	@Field((type) => Boolean)
	@Column({ type: 'boolean', default: false })
	public sendSuccess: boolean

	@Index({ unique: true })
	@Column()
	public orderId: number

	@ManyToOne((type) => Chat)
	public chat: Chat

	@ManyToOne((type) => User)
	public user: User

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date
}
export default Message
