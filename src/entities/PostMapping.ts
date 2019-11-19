import {
	BaseEntity,
	Column,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	TableForeignKey,
	Unique,
} from 'typeorm'
import Post from './Post'

@Entity()
@Unique('parent_child', ['parent', 'child'])
class PostMapping extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number

	@ManyToOne((type) => Post, (post) => post.postMappings)
	public parent: number

	@ManyToOne((type) => Post, (post) => post.postMappings)
	public child: number

}
export default PostMapping
