import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'
import User from './User'

@ObjectType()
@Entity()
class Message extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => String)
	@Column({ type: 'text' })
	public text: string

	@Field((type) => Boolean)
	@Column({ type: 'boolean', default: false })
	public isRead: boolean

	@Field((type) => Boolean)
	@Column({ type: 'boolean', default: false })
	public sendSuccess: boolean

	@ManyToOne((type) => Chat, (chat) => chat.id)
	public chat: Chat

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date
}
export default Message
