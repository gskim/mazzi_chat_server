import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import User from './User'

export enum NotificationType {
	LIKE = 'like',
	UNLIKE = 'unlike',
	REPLY = 'reply',
	INVITE = 'invite',
	ACCEPT = 'accept',
	LEAVE = 'leave',
	EXPIRATION = 'expiration',
	EXTEND = 'extend',
}

@Entity()
class Notification extends BaseEntity {

	@PrimaryGeneratedColumn() public id: number

	@Column()
	public text: string

	@Column({ type: 'enum', enum: NotificationType })
	public type: NotificationType

	@Column()
	public targetId: number

	@ManyToOne((type) => User)
	public sendUser: User

	@Column({ default: false })
	public isRead: boolean

	@ManyToOne((type) => User)
	public receiveUser: User

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Notification
