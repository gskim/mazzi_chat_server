import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
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
	Tree,
	TreeChildren,
	TreeLevelColumn,
	TreeParent,
	Unique,
	UpdateDateColumn,
} from 'typeorm'
import Post from './Post'

@ObjectType()
@Entity()
class Image extends BaseEntity {

	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'text', nullable: false })
	public originalName: string

	@Column({ type: 'text', nullable: false })
	public name: string

	@Column({ type: 'varchar', length: 10 })
	public ext: string

	@Column({ type: 'int' })
	public size: number

	@ManyToOne((type) => Post)
	public post: Post

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

}
export default Image
