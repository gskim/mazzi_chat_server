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
class Unlike extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => Boolean)
	@Column()
	public status: boolean

	@Field((type) => User)
	@OneToOne((type) => User)
	public user: User

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Unlike
