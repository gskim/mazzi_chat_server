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
class Like extends BaseEntity {

	@PrimaryGeneratedColumn() public id: number

	@Column()
	public status: boolean

	@OneToOne((type) => User)
	public user: User

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Like
