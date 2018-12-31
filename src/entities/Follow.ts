import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import User from './User'

@ObjectType()
@Entity()
class Follow extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => Boolean)
	@Column()
	public isFollow: boolean

	@Field((type) => User)
	@ManyToOne((type) => User)
	public fromUser: User

	@Field((type) => User)
	@ManyToOne((type) => User)
	public toUser: User

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Follow
