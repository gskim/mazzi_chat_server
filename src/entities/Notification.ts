import {
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
	Unique,
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
	EXPIRE = 'expire',
	EXTEND = 'extend',
}

@Entity({
	orderBy: {
		orderId: 'ASC',
	},
})

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

	@Index({ unique: true })
	@Column()
	public orderId: number

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Notification
