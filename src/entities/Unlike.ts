import { Field, ID, ObjectType } from 'type-graphql'
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
import Post from './Post'
import User from './User'

@ObjectType()
@Entity()
class Unlike extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => Boolean)
	@Column({ default: true })
	public status: boolean

	@Field((type) => User)
	@ManyToOne((type) => User)
	public user: User

	@ManyToOne((type) => Post)
	public post: Post

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Unlike
